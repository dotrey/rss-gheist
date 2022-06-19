export function _(elementType?: string, classes?: string|string[], content?: string|HTMLElement[], contentIsHTML?: boolean) {
    const element = document.createElement(elementType || "div");

    classes = classes ?? [];
    if (typeof classes === "string") {
        classes = classes ? [classes] : [];
    }
    if (classes.length) {
        element.classList.add(...classes);
    }
    
    content = content ?? "";
    if (typeof content === "string") {
        if (contentIsHTML) {
            element.innerHTML = content;
        } else {
            element.innerText = content;
        }
    } else {
        for (const child of content) {
            element.appendChild(child);
        }
    }

    return element;
}