"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const BiasContract_1 = __importDefault(require("../../contracts/nft/BiasContract"));
class StageBmcsItem extends skydapp_browser_1.DomNode {
    constructor(id, mix, name, isDancing) {
        super(".stage-bmcs-item");
        this.id = id;
        this.mix = mix;
        this.name = name;
        this.isDancing = isDancing;
        this.append(this.dancingDisplay = (0, skydapp_browser_1.el)(".dancing-container"), (0, skydapp_browser_1.el)(".progress-container", (0, skydapp_browser_1.el)(".progress", this.bar = (0, skydapp_browser_1.el)(".bar")), (0, skydapp_browser_1.el)(".title", "MIX 수령까지 남은 Block"), (0, skydapp_browser_1.el)("p", "1,296,000")), this.imageDisplay = (0, skydapp_browser_1.el)("img", { src: "", alt: "mate-mock" }), (0, skydapp_browser_1.el)(".checkbox-container", this.checkbox = (0, skydapp_browser_1.el)("input", { type: "checkbox", id: `mate${id}` }, {
            change: () => {
                this.fireEvent(this.checkbox.domElement.checked === true ? "selected" : "deselected");
            },
        }), (0, skydapp_browser_1.el)("label", { for: `BMCS${id}` }), (0, skydapp_browser_1.el)("p", `#${id} ${name}`)));
        this.init();
    }
    async init() {
        this.loadImage();
        this.setDanding();
        this.loadBar();
    }
    loadBar() {
        this.bar.style({
            width: `${100}%`,
        });
    }
    async loadImage() {
        const uri = await BiasContract_1.default.tokenURI(this.id);
        const metadata = await (await fetch(uri)).json();
        this.imageDisplay.domElement.src = metadata.image;
    }
    setDanding() {
        if (this.isDancing) {
            this.dancingDisplay.append((0, skydapp_browser_1.el)("img", { src: "/images/shared/img/stage-background.gif", alt: "daning" }), (0, skydapp_browser_1.el)("p.mix", `${this.mix}`));
        }
    }
    deselect() {
        this.checkbox.domElement.checked = false;
    }
}
exports.default = StageBmcsItem;
//# sourceMappingURL=StageBmcsItem.js.map