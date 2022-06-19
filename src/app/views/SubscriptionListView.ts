import { _ } from "../ElementCreator";
import { SubscriptionListViewItem } from "./SubscriptionListViewItem";
import { View } from "./View";

export class SubscriptionListView extends View {
    container: HTMLElement | undefined;
    create(): void {
        this.container = _("div", "subscription-list");
        this.parent.appendChild(this.container);
        for (const sub of this.app.listSubscriptions()) {
            new SubscriptionListViewItem(this.container, this.app, sub);
        }
        
        this.app.addEventListener("subscription-added", (e) => {
            let sub = this.app.getSubscription(e.url);
            if (sub) {
                new SubscriptionListViewItem(this.container!, this.app, sub);
            }
        });
        this.app.addEventListener("subscription-removed", (e) => {
            this.container!.querySelector(`subscription[data-url="${e.url}"]`)?.remove();
        });
    }
}