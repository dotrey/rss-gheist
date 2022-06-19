import { _ } from "../ElementCreator";
import { View } from "./View";

export class SettingsView extends View {
    container?: HTMLElement;

    create() {
        this.container = _("div", "settings");
        this.container.tabIndex = 0;

        this.container.appendChild(this.createAddNew());
        this.container.appendChild(this.createCorsProxy());
        this.parent.appendChild(this.container);
    }

    private createAddNew() {
        let box = _("div", "setting", [
            _("div", "setting-name", "Add RSS Feed")
        ]);
        let row = _("div", "first-element-fill-h");
        let input = _("input") as HTMLInputElement;
        input.type = "text";
        input.placeholder = "RSS Feed URL";
        input.autocomplete = "off";
        row.appendChild(input);
        let button = _("button") as HTMLButtonElement;
        button.innerText = "add feed";
        row.appendChild(button);

        let form = _("form") as HTMLFormElement;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.app.addSubscription(input.value);
            form.reset();
        });
        form.appendChild(row);
        box.appendChild(form);

        return box;
    }

    private createCorsProxy() {
        let box = _("div", "setting", [
            _("div", "setting-name", "CORS Proxy")
        ]);
        let row = _("div", "first-element-fill-h");
        let input = _("input") as HTMLInputElement;
        input.type = "text";
        input.placeholder = "CORS Proxy URL";
        input.autocomplete = "off";
        input.value = this.app.getCorsProxy();
        row.appendChild(input);
        let button = _("button") as HTMLButtonElement;
        button.innerText = "update";
        row.appendChild(button);

        let form = _("form") as HTMLFormElement;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.app.setCorsProxy(input.value);
            input.value = this.app.getCorsProxy();
        });
        form.appendChild(row);
        box.appendChild(form);

        return box;
    }
}