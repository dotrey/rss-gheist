/**
 * Some browsers, mostly when in incognito mode, will deny access to the localStorage.
 * There is nothing we can do in these cases, so the wrapper will silently discard the
 * thrown error.
 */
export class StorageWrapper {
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            this.logError(e);
        } 
    }

    getItem(key: string) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            this.logError(e);
        }
        return "";
    }

    removeItem(key: string) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            this.logError(e);
        }
    }

    setItem(key: string, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            this.logError(e);
        }
    }

    private logError(err: any) {
        console.log("access to local storage failed", err);
    }
}