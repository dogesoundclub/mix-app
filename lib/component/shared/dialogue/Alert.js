"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
class Alert extends skynode_1.Popup {
    constructor(message, confirmTitle) {
        super(".popup-background");
        this.append(this.content = (0, skynode_1.el)(".dialogue.alert", (0, skynode_1.el)(".close-container", { click: () => this.delete(), }, (0, skynode_1.el)("img", { src: "/images/shared/icn/close.svg", alt: "close" })), (0, skynode_1.el)("p", message), (0, skynode_1.el)(".button-container", (0, skynode_1.el)("button", confirmTitle === undefined ? "확인" : confirmTitle, {
            click: () => this.delete(),
        }))));
    }
}
exports.default = Alert;
//# sourceMappingURL=Alert.js.map