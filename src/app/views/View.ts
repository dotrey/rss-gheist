import { App } from "../App";

export class View {
    constructor(public parent: HTMLElement, public app: App) {
        this.create();
    }

    create() {
        // To be implemented by all classes individually
    }
}