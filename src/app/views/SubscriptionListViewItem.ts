import { Subscription } from "../../core/model/Subscription";
import { App } from "../App";
import { _ } from "../ElementCreator";
import { View } from "./View";

export class SubscriptionListViewItem extends View {
    container?: HTMLElement;

    constructor(public parent: HTMLElement, public app: App, public subscription: Subscription) {
        super(parent, app);
        this.create();
    }

    create(): void {
        if (!this.subscription) {
            return;
        }
        this.container = _("div", "subscription");
        this.container.addEventListener("click", () => {
            this.app.selectSubscription(this.subscription.url);
        });

        this.container.dataset.url = this.subscription.url;
        let title = _("div", "title", this.subscription.name || this.subscription.url);
        this.container.appendChild(title);

        this.container.appendChild(_("div", "url", this.subscription.url));

        let dateContent = _("div", "date-content", "content: ");
        if (this.subscription.channel && this.subscription.channel.items.length > 0) {
            dateContent.innerText += this.subscription.channel.items[0].pubDate?.toLocaleString() || "";
        } else {
            dateContent.innerHTML += "&minus;"
        }
        this.container.appendChild(dateContent);

        let dateRefresh = _("div", "date-refresh", "refresh: ");
        if (this.subscription.lastRefresh > 0) {
            let d = new Date();
            d.setTime(this.subscription.lastRefresh);
            dateRefresh.innerText += d.toLocaleString() || "";
        } else {
            dateRefresh.innerHTML += "&minus;"
        }
        this.container.appendChild(dateRefresh);

        let autorefresh = _("label", "autorefresh", "auto refresh");
        let autorefreshCheckbox = _("input", "") as HTMLInputElement;
        autorefreshCheckbox.type = "checkbox";
        autorefreshCheckbox.checked = this.subscription.refreshInterval > 0;
        autorefresh.appendChild(autorefreshCheckbox);
        autorefresh.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        autorefreshCheckbox.addEventListener("change", (_) => {
            console.log(autorefreshCheckbox.checked ? "true" : "false");
            this.app.setSubscriptionAutoRefresh(this.subscription.url, autorefreshCheckbox.checked);
        });
        this.container.appendChild(autorefresh);

        let notification = _("label", "notification", "notification");
        let notificationCheckbox = _("input", "") as HTMLInputElement;
        notificationCheckbox.type = "checkbox";
        notificationCheckbox.checked = this.subscription.notificationEnabled;
        notification.appendChild(notificationCheckbox);
        notification.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        notificationCheckbox.addEventListener("change", (_) => {
            console.log(notificationCheckbox.checked ? "true" : "false");
            this.app.setSubscriptionNotifications(this.subscription.url, notificationCheckbox.checked);
        });
        this.container.appendChild(notification);

        let deleteButton = _("div", "delete", "&#x2715;", true);
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.app.removeSubscription(this.subscription.url)) {
                this.container?.remove();
            }
        });
        this.container.appendChild(deleteButton);

        this.app.addEventListener("subscription-refreshed", (e) => {
            if (e.url !== this.subscription.url) {
                return;
            }

            // this.subscription = this.app.getSubscription(e.url)!;
            // if (!this.subscription) {
            //     return;
            // }

            title.innerText = this.subscription.name;
            notificationCheckbox.checked = this.subscription.notificationEnabled;
            autorefreshCheckbox.checked = this.subscription.refreshInterval > 0;
            dateRefresh.innerText = "refresh:";
            if (this.subscription.lastRefresh > 0) {
                let d = new Date();
                d.setTime(this.subscription.lastRefresh);
                dateRefresh.innerText += " " + d.toLocaleString() || "";
            } else {
                dateRefresh.innerHTML += " &minus;"
            }
            dateContent.innerText = "content:";
            if (this.subscription.channel && this.subscription.channel.items.length > 0) {
                dateContent.innerText += " " + this.subscription.channel.items[0].pubDate?.toLocaleString() || "";
            } else {
                dateContent.innerHTML += " &minus;"
            }
        });

        this.app.addEventListener("subscription-selected", (e) => {
            if (this.subscription.url === e.url) {
                this.container?.classList.add("selected");
            } else {
                this.container?.classList.remove("selected");
            }
        });

        this.parent.appendChild(this.container);
    }
}