import { EventHub } from "../event/EventHub";
import { EventMap } from "../event/EventMap";
import { SubscriptionNotificationEvent } from "../event/events/SubscriptionNotificationEvent";
import { NotificationWrapper } from "../wrapper/NotificationWrapper";
import { StorageWrapper } from "../wrapper/StorageWrapper";
import { SubscriptionController } from "./SubscriptionController";

export class RssGheist {
    private storage: StorageWrapper;
    private subscriptions: SubscriptionController;
    private notifications: NotificationWrapper;

    constructor() {
        this.notifications = new NotificationWrapper();
        this.storage = new StorageWrapper();
        this.subscriptions = new SubscriptionController(this.storage);
    }

    initialize() {
        EventHub.addEventListener("subscription-notification", this.showSubscriptionNotification.bind(this));
    }

    addSubscription(url: string) {
        this.subscriptions.add(url);
    }

    getSubscription(url: string) {
        return this.subscriptions.get(url);
    }

    removeSubscription(url: string) {
        this.subscriptions.remove(url);
    }

    listSubscriptions() {
        return this.subscriptions.list();
    }

    refreshSubscription(url: string) {
        this.subscriptions.refresh(url);
    }

    setSubscriptionNotificiations(url: string, active: boolean) {
        if (active) {
            this.notifications.requestPermission();
        }
        this.subscriptions.setNotification(url, active);
    }

    setSubscriptionAutoRefresh(url: string, active: boolean) {
        this.subscriptions.setAutoRefresh(url, active);
    }

    setCorsProxy(proxy: string) {
        this.subscriptions.setCorsProxy(proxy);
    }

    getCorsProxy() {
        return this.subscriptions.getCorsProxy();
    }
    
    /**
     * An event listener is expected to return a boolean that indicates whether the listener
     * can be removed (on returning false) or remains active (on returning true or void).
     * @param type
     * @param listener
     */
    addEventListener<K extends keyof EventMap>(type: K, listener: (e: EventMap[K]) => boolean|void) {
        EventHub.addEventListener(type, listener);
    }

    /**
     * Removes a single event listener.
     * @param type
     * @param listener
     */
    removeEventListener<K extends keyof EventMap>(type: K, listener: (e: EventMap[K]) => boolean|void) {
        EventHub.removeEventListener(type, listener);
    }

    private showSubscriptionNotification(e: SubscriptionNotificationEvent) {
        let options: NotificationOptions = {
            body: e.item.description,
            vibrate: [200, 100, 200]
        };
        this.notifications.showNotification(e.item.title, options);
    }
}