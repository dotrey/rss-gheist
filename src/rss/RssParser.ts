import { RssChannel } from "./model/RssChannel";
import { RssItem } from "./model/RssItem";

export class RssParser {

    async parse(source: string): Promise<RssChannel> {
        const parser: DOMParser = new DOMParser();
        const rss: Document = parser.parseFromString(source, "text/xml");
        // Check for parse errors
        const errorNode = rss.querySelector("parseerror");
        if (errorNode) {
            console.log(errorNode);
            throw new Error("RSS parse error");
        }
        return this.createChannel(rss);
    }

    private createChannel(rss: Document) {
        const result: RssChannel = new RssChannel();
        const channel = rss.querySelector("channel");

        if (channel) {
            const title = channel.querySelector("title");
            if (title && title.parentNode === channel) {
                result.title = title.textContent || "";
            }
            const link = channel.querySelector("link");
            if (link && link.parentNode === channel) {
                result.link = link.textContent || "";
            }
            const description = channel.querySelector("description");
            if (description && description.parentNode === channel) {
                result.description = description.textContent || "";
            }
            const lastBuildDate = channel.querySelector("lastBuildDate");
            if (lastBuildDate && lastBuildDate.parentNode === channel) {
                result.lastBuildDate = this.parseDate(lastBuildDate.textContent);
            }
            const pubDate = channel.querySelector("pubDate");
            if (pubDate && pubDate.parentNode === channel) {
                result.pubDate = this.parseDate(pubDate.textContent);
            }

            channel.querySelectorAll("item").forEach((item) => {
                if (item.parentNode === channel) {
                    result.items.push(this.createItem(item));
                }
            });
        } else {
            result.title = "NO RSS CHANNEL";
        }


        return result;
    }

    private createItem(data: Element): RssItem {
        const item: RssItem = new RssItem();

        const title = data.querySelector("title");
        if (title) {
            item.title = title.textContent || "";
        }
        const description = data.querySelector("description");
        if (description) {
            item.description = description.textContent || "";
        }
        const author = data.querySelector("author");
        if (author) {
            item.author = author.textContent || "";
        }
        const link = data.querySelector("link");
        if (link) {
            item.link = link.textContent || "";
        }
        const guid = data.querySelector("guid");
        if (guid) {
            item.guid = guid.textContent || "";
        }
        const pubDate = data.querySelector("pubDate");
        if (pubDate) {
            item.pubDate = this.parseDate(pubDate.textContent);
        }

        data.querySelectorAll("category").forEach((category) => {
            item.categories.push(category.textContent || "");
        });

        return item;
    }

    private parseDate(value: string|null): Date | null {
        if (!value) {
            return null;
        }
        const ts: number = Date.parse(value);
        if (isNaN(ts) || ts < 0) {
            // Invalid value given
            return null;
        }
        const d = new Date();
        d.setTime(ts);
        return d;
    }

}