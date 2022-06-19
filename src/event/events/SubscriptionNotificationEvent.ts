import { RssItem } from "../../rss/model/RssItem";

export class SubscriptionNotificationEvent {
    constructor(public url: string, public item: RssItem) {}
}