import { RssItem } from "./RssItem";

export class RssChannel {
    title: string = "";
    link: string = "";
    description: string = "";
    pubDate: Date|null = null;
    lastBuildDate: Date|null = null;
    items: RssItem[] = [];

    lastestGuid(): string {
        if (this.items.length > 0) {
            return this.items[0].guid;
        }
        return "";
    }
}