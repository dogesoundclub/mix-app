"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
class StageMateItem extends skydapp_browser_1.DomNode {
    constructor(id, mix, name, isDancing) {
        super(".stage-mate-item");
        this.id = id;
        this.mix = mix;
        this.name = name;
        this.isDancing = isDancing;
        this.append(this.dancingDisplay = (0, skydapp_browser_1.el)(".dancing-container"), (0, skydapp_browser_1.el)("img", { src: `https://storage.googleapis.com/dsc-mate/336/dscMate-${id}.png`, alt: "mate-mock" }), (0, skydapp_browser_1.el)(".checkbox-container", this.checkbox = (0, skydapp_browser_1.el)("input", { type: "checkbox", id: `mate${id}` }, {
            change: () => {
                this.fireEvent(this.checkbox.domElement.checked === true ? "selected" : "deselected");
            },
        }), (0, skydapp_browser_1.el)("label", { for: `mate${id}` }), (0, skydapp_browser_1.el)("p", `#${id} ${name}`)));
        this.setDancing();
    }
    setDancing() {
        if (this.isDancing) {
            this.dancingDisplay.append((0, skydapp_browser_1.el)("img", { src: "/images/shared/img/stage-background.gif", alt: "daning" }), (0, skydapp_browser_1.el)("p.mix", `${this.mix}`));
        }
    }
    deselect() {
        this.checkbox.domElement.checked = false;
    }
}
exports.default = StageMateItem;
//# sourceMappingURL=StageMateItem.js.map