import { RssGheist } from "../core/RssGheist";
import { EventHub } from "../event/EventHub";
import { EventMap } from "../event/EventMap";
import { SubscriptionEvent } from "../event/events/SubscriptionEvent";
import { MainView } from "./views/MainView";

export class App {
    constructor(public rss: RssGheist) {
        rss.initialize();
        new MainView(document.body, this);
    }

    listSubscriptions() {
        return this.rss.listSubscriptions()
    }

    getSubscription(url: string) {
        return this.rss.getSubscription(url);
    }

    addSubscription(url: string) {
        this.rss.addSubscription(url);
    }

    removeSubscription(url: string) {
        if (confirm(`Remove RSS feed '${url}'?`)) {
            this.rss.removeSubscription(url);
            return true;
        }
        return false;
    }

    refreshSubscription(url: string) {
        this.rss.refreshSubscription(url);
    }

    selectSubscription(url: string) {
        EventHub.raiseEvent("subscription-selected", new SubscriptionEvent(url));
    }

    setSubscriptionNotifications(url: string, active: boolean) {
        this.rss.setSubscriptionNotificiations(url, active);
    }

    setSubscriptionAutoRefresh(url: string, active: boolean) {
        this.rss.setSubscriptionAutoRefresh(url, active);
    }

    setCorsProxy(proxy: string) {
        this.rss.setCorsProxy(proxy);
    }

    getCorsProxy() {
        return this.rss.getCorsProxy();
    }

    /**
     * An event listener is expected to return a boolean that indicates whether the listener
     * can be removed (on returning false) or remains active (on returning true or void).
     * @param type
     * @param listener
     */
    addEventListener<K extends keyof EventMap>(type: K, listener: (e: EventMap[K]) => boolean|void) {
        this.rss.addEventListener(type, listener);
    }
}