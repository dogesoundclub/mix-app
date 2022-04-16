"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
class Confirm extends skydapp_browser_1.Popup {
    constructor(title, message, confirmTitle, confirm) {
        super(".popup-background");
        this.append(this.content = (0, skydapp_browser_1.el)(".dialogue.confirm", (0, skydapp_browser_1.el)(".close-container", { click: () => this.delete(), }, (0, skydapp_browser_1.el)("img", { src: "/images/shared/icn/close.svg", alt: "close" })), (0, skydapp_browser_1.el)("h2", title), (0, skydapp_browser_1.el)("p", message), (0, skydapp_browser_1.el)(".button-container", (0, skydapp_browser_1.el)("button", confirmTitle, {
            click: () => {
                confirm();
                this.delete();
            },
        }))));
    }
}
exports.default = Confirm;
//# sourceMappingURL=Confirm.js.map