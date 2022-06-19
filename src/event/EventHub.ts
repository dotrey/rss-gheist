import { EventMap } from "./EventMap";

export class EventHub {
    private static listeners: {[eventName: string] : ((e: any) => boolean|void)[]} = {};

    /**
     * An event listener is expected to return a boolean that indicates whether the listener
     * can be removed (on returning false) or remains active (on returning true or void).
     * @param type
     * @param listener
     */
    static addEventListener<K extends keyof EventMap>(type: K, listener: (e: EventMap[K]) => boolean|void) {
        if (typeof EventHub.listeners[type] === "undefined") {
            this.listeners[type] = [];
        }
        if (this.listeners[type].indexOf(listener) < 0) {
            this.listeners[type].push(listener);
        }
    }

    /**
     * Triggers an event that will be received by all listeners registered for the event type.
     * @param type
     * @param event
     * @param isPublic
     */
    static raiseEvent<K extends keyof EventMap>(type: K, event: EventMap[K]) {
        if (typeof this.listeners[type] !== "undefined") {
            let removeLater = [];
            for (const listener of this.listeners[type]) {
                try {
                    if (listener(event) === false) {
                        removeLater.push(listener);
                    }
                } catch (e) {
                    console.log("Error in event listener for " + type, e);
                }
            }
            for (const removedListener of removeLater) {
                this.removeEventListener(type, removedListener);
            }
        }
    }

    /**
     * Removes a single event listener.
     * @param type
     * @param listener
     */
    static removeEventListener<K extends keyof EventMap>(type: K, listener: (e: EventMap[K]) => boolean|void) {
        if (typeof this.listeners[type] !== "undefined") {
            let i: number = this.listeners[type].indexOf(listener);
            if (i > -1) {
                this.listeners[type].splice(i, 1);
            }
        }
    }

    /**
     * Removes all event listeners for an event type.
     * @param type
     */
    static resetListeners<K extends keyof EventMap>(type: K) {
        this.listeners[type] = [];
    }
}