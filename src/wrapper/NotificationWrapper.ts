export class NotificationWrapper {
    private hasPermission: boolean = false;
    private notifications: Notification[] = [];
    maxNotificationCount: number = 3;

    constructor() {
        this.checkPermission();
    }

    showNotification(title: string, options?: NotificationOptions): boolean {
        if (this.hasPermission) {
            const notification = new Notification(title, options);
            notification.addEventListener("close", () => {
                let i = this.notifications.indexOf(notification);
                if (i >= 0) {
                    this.notifications.splice(i, 1);
                }
            });
            this.notifications.push(notification);
            while (this.notifications.length > this.maxNotificationCount) {
                let tmp = this.notifications.shift();
                tmp?.close();
            }
        }
        return this.hasPermission;
    }

    requestPermission() {
        if (this.hasPermission) {
            return;
        }

        const permissionHandler = () => {
            this.checkPermission();
        }
        if (this.checkNotificationPromise()) {
            Notification.requestPermission().then(permissionHandler);
        } else {
            Notification.requestPermission(permissionHandler)
        }
    }

    private checkPermission() {
        if (!window || !("Notification" in window)) {
            this.hasPermission = false;
            console.log("no notification support");
            return;
        } else {
            this.hasPermission = Notification.permission === "granted";
        }
    }

    private checkNotificationPromise() {
        // Safari does not yet support the promise variant and requires a callback function
        // From https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API#feature-detecting_the_requestpermission_promise
        try {
            Notification.requestPermission().then();
        } catch (e) {
            return false;
        }

        return true;
    }


}