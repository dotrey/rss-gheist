import { App } from "./app/App";
import { RssGheist } from "./core/RssGheist";

const rssg: RssGheist = new RssGheist();
const app: App = new App(rssg);
(window as any).rssg = rssg;
(window as any).rss = app;