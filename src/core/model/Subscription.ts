import { RssChannel } from "../../rss/model/RssChannel";

export class Subscription {
    url: string = "";
    name: string = "";
    lastestGuid: string = "";
    notificationEnabled: boolean = false;
    refreshInterval: number = 0;
    refreshTimeout: number = 0;
    lastRefresh: number = 0;
    channel: RssChannel | null = null;

    serialize() {
        return JSON.stringify(this, ["url", "name", "lastestGuid", "notificationEnabled", "refreshInterval", "lastRefresh"]);
    }

    static fromString(value: string) {
        let tmp = JSON.parse(value);
        let sub: Subscription = new Subscription();
        sub.url = tmp.url || "";
        sub.name = tmp.name || "";
        sub.lastestGuid = tmp.lastestGuid || "";
        sub.notificationEnabled = !!tmp.notificationEnabled;
        sub.refreshInterval = tmp.refreshInterval || 0;
        sub.lastRefresh = tmp.lastRefresh || 0;
        return sub;
    }
}