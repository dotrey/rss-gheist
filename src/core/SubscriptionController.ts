import { EventHub } from "../event/EventHub";
import { SubscriptionEvent } from "../event/events/SubscriptionEvent";
import { SubscriptionNotificationEvent } from "../event/events/SubscriptionNotificationEvent";
import { RssParser } from "../rss/RssParser";
import { StorageWrapper } from "../wrapper/StorageWrapper";
import { Subscription } from "./model/Subscription";

export class SubscriptionController {
    private defaultRefreshInterval: number = 5 * 60; // 5 minutes
    private rssParser: RssParser = new RssParser();
    private subscriptions: { [url: string]: Subscription } = {};
    private subscriptionStorageKey: string = "subscriptions";
    private proxyStorageKey: string = "corsproxy";
    private proxy: string = "";

    constructor(private storage: StorageWrapper) {
        this.proxy = this.storage.getItem(this.proxyStorageKey) || "";
        this.load();

        EventHub.addEventListener("subscription-selected", (e) => {
            let sub = this.get(e.url);
            if (sub &&
                sub.refreshInterval === 0 &&
                sub.lastRefresh + (this.defaultRefreshInterval * 1000) < Date.now()) {
                // The selected subscription has no auto-refresh and was last refreshed
                // too long ago -> refresh now
                this.refresh(e.url);
            }
        });
    }

    add(url: string) {
        if (typeof this.subscriptions[url] !== "undefined") {
            console.log(`can not add subscription for ${url} -> already exists`);
            return;
        }
        let sub = new Subscription();
        sub.url = url;
        this.subscriptions[url] = sub;
        EventHub.raiseEvent("subscription-added", new SubscriptionEvent(url));
        this.refresh(url)
            .finally(() => {
                this.save();
            });
    }

    get(url: string): Subscription | undefined {
        return this.subscriptions[url];
    }

    list() {
        return Object.values(this.subscriptions);
    }

    remove(url: string) {
        if (typeof this.subscriptions[url] !== "undefined") {
            delete this.subscriptions[url];
            this.save();
            EventHub.raiseEvent("subscription-removed", new SubscriptionEvent(url));
        }        
    }

    setNotification(url: string, active: boolean) {
        if (typeof this.subscriptions[url] === "undefined") {
            return;
        }
        this.subscriptions[url].notificationEnabled = active;
        this.save();
        EventHub.raiseEvent("subscription-refreshed", new SubscriptionEvent(url));
    }

    setAutoRefresh(url: string, active: boolean) {
        if (typeof this.subscriptions[url] === "undefined") {
            return;
        }
        this.subscriptions[url].refreshInterval = active ? this.defaultRefreshInterval : 0;
        this.save();
        EventHub.raiseEvent("subscription-refreshed", new SubscriptionEvent(url));
        this.setRefreshTimeout(this.subscriptions[url])
    }

    async refresh(url: string) {
        const sub = this.subscriptions[url];
        if (typeof sub === "undefined") {
            return;
        }

        let fetchUrl: string = sub.url;
        if (this.proxy) {
            fetchUrl = this.proxy + encodeURIComponent(sub.url);
        }
        const response = await fetch(fetchUrl, {
            method: "GET"
        });
        if (response.ok) {
            const content = await response.text();
            sub.channel = await this.rssParser.parse(content);
            if (sub.channel && sub.name !== sub.channel.title) {
                sub.name = sub.channel.title;
            }
            sub.lastRefresh = Date.now();
            this.save();
            EventHub.raiseEvent("subscription-refreshed", new SubscriptionEvent(sub.url));
            this.checkUpdated(sub);
        }else{
            console.log(`failed to fetch RSS feed ${sub.url} -> ${response.status} ${response.statusText}`);
        }

        this.setRefreshTimeout(sub);
    }

    private setRefreshTimeout(sub: Subscription) {
        if (sub.refreshInterval > 0 && sub.refreshTimeout < 1) {
            sub.refreshTimeout = window.setTimeout(() => {
                sub.refreshTimeout = 0;
                this.refresh(sub.url);
            }, sub.refreshInterval * 1000);
        }
    }

    setCorsProxy(proxy: string) {
        this.storage.setItem(this.proxyStorageKey, proxy);
        this.proxy = proxy;
    }

    getCorsProxy() {
        return this.proxy;
    }

    private checkUpdated(sub: Subscription) {
        if (!sub.channel) {
            return;
        }
        const latest = sub.channel.lastestGuid();
        if (sub.lastestGuid !== latest) {
            EventHub.raiseEvent("subscription-content-updated", new SubscriptionEvent(sub.url));
            if (sub.notificationEnabled && sub.channel.items.length > 0) {
                EventHub.raiseEvent("subscription-notification", new SubscriptionNotificationEvent(sub.url, sub.channel.items[0]));
            }
        }
        sub.lastestGuid = latest;
    }

    save() {
        let data: string[] = Object.values(this.subscriptions).map((sub) => {
            return sub.serialize();
        });
        this.storage.setItem(this.subscriptionStorageKey, JSON.stringify(data));
    }

    load() {
        this.subscriptions = {};
        let subdata = this.storage.getItem(this.subscriptionStorageKey) || "[]";
        try {
            let subs: string[] = JSON.parse(subdata);
            for (const sub of subs) {
                try {
                    let tmp = Subscription.fromString(sub);
                    this.subscriptions[tmp.url] = tmp;
                    this.setRefreshTimeout(this.subscriptions[tmp.url]);
                } catch (e) {
                    // ignored for now
                }
            }
        } catch (e) {
            // ignored for now
        }
    }
}