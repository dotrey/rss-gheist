import { _ } from "../ElementCreator";
import { SettingsView } from "./SettingsView";
import { SubscriptionDetailView } from "./SubscriptionDetailView";
import { SubscriptionListView } from "./SubscriptionListView";
import { View } from "./View";

export class MainView extends View {
    container?: HTMLElement;
    subscriptionList?: SubscriptionListView;
    subscriptionDetails?: SubscriptionDetailView;
    settings?: SettingsView;

    create() {
        this.container = _("main");
        this.subscriptionList = new SubscriptionListView(this.container, this.app);
        this.subscriptionDetails = new SubscriptionDetailView(this.container, this.app);
        this.settings = new SettingsView(this.container, this.app);
        this.parent.appendChild(this.container);
    }
}