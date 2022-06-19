import { SubscriptionEvent } from "./events/SubscriptionEvent";
import { SubscriptionNotificationEvent } from "./events/SubscriptionNotificationEvent";

export interface EventMap {
    "subscription-added": SubscriptionEvent,
    "subscription-content-updated": SubscriptionEvent,
    "subscription-notification": SubscriptionNotificationEvent,
    "subscription-refreshed": SubscriptionEvent,
    "subscription-removed": SubscriptionEvent,
    "subscription-selected": SubscriptionEvent
}