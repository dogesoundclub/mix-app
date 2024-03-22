"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const CommonUtil_1 = __importDefault(require("../../CommonUtil"));
const MixStakingContract_1 = __importDefault(require("../../contracts/mix/MixStakingContract"));
const EMatesContract_1 = __importDefault(require("../../contracts/nft/EMatesContract"));
const Alert_1 = __importDefault(require("../shared/dialogue/Alert"));
class StageEmateItem extends skydapp_browser_1.DomNode {
    constructor(stage, id, mix, name, currentBlock, isDancing) {
        super(".stage-emate-item");
        this.id = id;
        this.mix = mix;
        this.name = name;
        this.currentBlock = currentBlock;
        this.isDancing = isDancing;
        this.stakingBlock = 0;
        this.returnMixTimes = 0;
        this.append(this.dancingDisplay = (0, skydapp_browser_1.el)(".dancing-container"), isDancing === true ? (0, skydapp_browser_1.el)(".progress-container", {
            click: () => {
                if (isDancing === true) {
                    const percent = (this.currentBlock - this.stakingBlock) / this.returnMixTimes * 100;
                    if (percent < 100) {
                        new Alert_1.default("해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.");
                        return;
                    }
                }
                if (this.checkbox.domElement.checked) {
                    this.imageDisplay.style({
                        border: "none"
                    });
                    this.checkbox.domElement.checked = false;
                    if (isDancing === true) {
                        stage.deselectStaking(EMatesContract_1.default.address, id);
                    }
                    else {
                        stage.deselectUnstaking(EMatesContract_1.default.address, id);
                    }
                }
                else {
                    this.imageDisplay.style({
                        border: "5px solid red"
                    });
                    this.checkbox.domElement.checked = true;
                    if (isDancing === true) {
                        stage.selectStaking(EMatesContract_1.default.address, id);
                    }
                    else {
                        stage.selectUnstaking(EMatesContract_1.default.address, id);
                    }
                }
            },
        }, (0, skydapp_browser_1.el)(".progress", this.bar = (0, skydapp_browser_1.el)(".bar")), (0, skydapp_browser_1.el)(".title", "MIX 되찾기까지 남은 Block"), this.remains = (0, skydapp_browser_1.el)("p", "")) : undefined, this.imageDisplay = (0, skydapp_browser_1.el)("img", {
            src: `https://storage.googleapis.com/emates/klaytn/Emates-${id}.png`, alt: "mate-mock",
            click: () => {
                if (isDancing === true) {
                    const percent = (this.currentBlock - this.stakingBlock) / this.returnMixTimes * 100;
                    if (percent < 100) {
                        new Alert_1.default("해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.");
                        return;
                    }
                }
                if (this.checkbox.domElement.checked) {
                    this.imageDisplay.style({
                        border: "none"
                    });
                    this.checkbox.domElement.checked = false;
                    if (isDancing === true) {
                        stage.deselectStaking(EMatesContract_1.default.address, id);
                    }
                    else {
                        stage.deselectUnstaking(EMatesContract_1.default.address, id);
                    }
                }
                else {
                    this.imageDisplay.style({
                        border: "5px solid red"
                    });
                    this.checkbox.domElement.checked = true;
                    if (isDancing === true) {
                        stage.selectStaking(EMatesContract_1.default.address, id);
                    }
                    else {
                        stage.selectUnstaking(EMatesContract_1.default.address, id);
                    }
                }
            },
        }), (0, skydapp_browser_1.el)(".checkbox-container", this.checkbox = (0, skydapp_browser_1.el)("input", { type: "checkbox", id: `emate${id}` }, {
            change: () => {
                if (isDancing === true) {
                    const percent = (this.currentBlock - this.stakingBlock) / this.returnMixTimes * 100;
                    if (percent < 100) {
                        new Alert_1.default("해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.");
                        this.checkbox.domElement.checked = !this.checkbox.domElement.checked;
                        return;
                    }
                }
                this.fireEvent(this.checkbox.domElement.checked === true ? "selected" : "deselected");
                if (this.checkbox.domElement.checked) {
                    this.imageDisplay.style({
                        border: "5px solid red"
                    });
                    if (isDancing === true) {
                        stage.selectStaking(EMatesContract_1.default.address, id);
                    }
                    else {
                        stage.selectUnstaking(EMatesContract_1.default.address, id);
                    }
                }
                else {
                    this.imageDisplay.style({
                        border: "none"
                    });
                    if (isDancing === true) {
                        stage.deselectStaking(EMatesContract_1.default.address, id);
                    }
                    else {
                        stage.deselectUnstaking(EMatesContract_1.default.address, id);
                    }
                }
            },
        }), (0, skydapp_browser_1.el)("label", { for: `emate${id}` }), (0, skydapp_browser_1.el)("p", `#${id} ${name}`)));
        this.setDancing();
        this.loadBar();
    }
    async loadBar() {
        this.stakingBlock = (await MixStakingContract_1.default.stakingBlocks(EMatesContract_1.default.address, this.id)).toNumber();
        this.returnMixTimes = (await MixStakingContract_1.default.returnMixTimes(EMatesContract_1.default.address, this.id)).toNumber();
        const percent = (this.currentBlock - this.stakingBlock) / this.returnMixTimes * 100;
        this.bar?.style({ width: `${percent > 100 ? 100 : percent}%` });
        this.remains?.empty().appendText(CommonUtil_1.default.numberWithCommas(String(this.stakingBlock + this.returnMixTimes - this.currentBlock)));
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
exports.default = StageEmateItem;
//# sourceMappingURL=StageEmateItem.js.map