import { Subscription } from "../../core/model/Subscription";
import { _ } from "../ElementCreator";
import { View } from "./View";

export class SubscriptionDetailView extends View {
    container: HTMLElement | undefined;
    selectedSubscription: Subscription | undefined;

    create(): void {
        this.container = _("div", "subscription-details");
        this.createGreeting();
        this.parent.appendChild(this.container);

        this.app.addEventListener("subscription-selected", (e) => {
            this.container?.classList.remove("center-items");
            if (!this.selectedSubscription ||
                (this.selectedSubscription && this.selectedSubscription.url !== e.url)) {
                this.selectedSubscription = this.app.getSubscription(e.url);
                if (this.selectedSubscription && !this.selectedSubscription.channel) {
                    this.app.refreshSubscription(this.selectedSubscription.url);
                }
                this.refresh();
            }
        });

        this.app.addEventListener("subscription-refreshed", (e) => {
            if (this.selectedSubscription && this.selectedSubscription.url === e.url) {
                this.refresh();
            }
        });

        this.app.addEventListener("subscription-content-updated", (e) => {
            if (this.selectedSubscription && this.selectedSubscription.url === e.url) {
                this.refresh();
            }
        });
    }

    private refresh() {        
        // if (this.selectedSubscription) {
        //     this.selectedSubscription = this.app.getSubscription(this.selectedSubscription.url)!;
        // }
        if (!this.selectedSubscription || !this.selectedSubscription.channel || !this.container) {
            return;
        }
        this.container.innerHTML = "";
        for (const item of this.selectedSubscription.channel.items) {
            let ie = _("div", "channel-item", [
                _("div", "channel-item-date", item.pubDate ? item.pubDate.toLocaleString() : ""),
                _("div", "channel-item-link", item.link ? `<a href="${item.link}" target="_blank">open in new tab</a>` : "", true),
                _("div", "channel-item-title", item.title),
                _("div", "channel-item-body", item.description)
            ]);
            this.container.appendChild(ie);
        }
    }

    private createGreeting() {
        if (!this.container) {
            return;
        }

        this.container.appendChild(_("div", "greeting", [
            _("h1", "", "rss gheist"),
            _("h2", "", "simple, free, client-side"),
            _("p", "", "I created rss gheist because I needed a simple RSS reader with notifications. All offers I found required me to sign up, so I took a weekend to create this simple, client-side RSS reader. No registration needed, <s>no configuration needed</s>...", true),
            _("h2", "", "but... CORS"),
            _("p", "", "The initial test immediately showed a critical flaw of this client-side only design: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS\" target=\"_blank\">CORS</a>.", true),
            _("p", "", "Now don't get me wrong here, CORS is something good, but since it prevents JS from getting data from an RSS feed (unless the feed has an <code>Access-Control-Allow-Origin: *</code> HTTP header specified), it basically killed the idea of client-side only.", true),
            _("p", "", "But, there always is a way, and in this case it is a <b>CORS proxy</b>. There are many out there, and you can even create your own with the <code>corsproxy.php</code> file from rss gheist's repository. The proxy runs on a server, fetches the data from the RSS feed and adds the <code>Access-Control-Allow-Origin: *</code> HTTP header we need for the client-side script to retrieve the data.", true),
            _("p", "", "Search for a proxy you like or create your own, then add the proxy's URL in the settings field in a format where only the feed's URL needs to be appended. For example, if you use the <code>corsproxy.php</code> on <code>yourserver.com</code>, you would enter <code>https://yourserver.com/corsproxy.php?url=</code>. Now rss gheist is ready to fetch the feed's data!", true)
        ]));
    }
}