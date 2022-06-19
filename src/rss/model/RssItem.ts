export class RssItem {
    title: string = "";
    description: string = "";
    author: string = "";
    link: string = "";
    guid: string = "";
    pubDate: Date|null = null;
    categories: string[] = [];
}