"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const superagent_1 = __importDefault(require("superagent"));
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const BurnPoolContract_1 = __importDefault(require("../contracts/mix/BurnPoolContract"));
const MixEmitterContract_1 = __importDefault(require("../contracts/mix/MixEmitterContract"));
const Layout_1 = __importDefault(require("./Layout"));
const MixContract_1 = __importDefault(require("../contracts/mix/MixContract"));
class Home {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("HOME_TITLE");
        Layout_1.default.current.content.append((this.container = (0, skydapp_browser_1.el)(".home-view", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)(".overview-container", (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_OVERVIEW_TITLE1")), this.priceDisplay = (0, skydapp_browser_1.el)("p", "...원")), (0, skydapp_browser_1.el)("hr"), (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_OVERVIEW_TITLE2")), this.poolDisplay = (0, skydapp_browser_1.el)("p", "...MIX")), (0, skydapp_browser_1.el)("hr"), (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_OVERVIEW_TITLE3")), this.burnableDisplay = (0, skydapp_browser_1.el)("p", "...MIX"))), (0, skydapp_browser_1.el)(".desc-container", (0, skydapp_browser_1.el)("img", { src: "/images/shared/logo/mix.svg", alt: "mix logo" }), (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("HOME_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("HOME_DESC1")), (0, skydapp_browser_1.el)(".button-container", (0, skydapp_browser_1.el)("a", (0, skydapp_browser_1.msg)("HOME_BUY_MIX_BUTTON")), (0, skydapp_browser_1.el)("a.outline", (0, skydapp_browser_1.msg)("HOME_WHITEPAPER_BUTTON"))), (0, skydapp_browser_1.el)("a.add-mix", (0, skydapp_browser_1.msg)("HOME_ADD_MIX_BUTTON"))), (0, skydapp_browser_1.el)(".scroll-container", (0, skydapp_browser_1.el)("img", { src: "/images/shared/img/scroll.svg", alt: "scroll" }))), (0, skydapp_browser_1.el)("article", (0, skydapp_browser_1.el)(".pool-container", (0, skydapp_browser_1.el)("h2", (0, skydapp_browser_1.msg)("HOME_POOL_TITLE")), (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)(".info-card", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_POOL_TITLE1")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("HOME_POOL_DESC1"))), (0, skydapp_browser_1.el)(".info-card", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_POOL_TITLE2")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("HOME_POOL_DESC2"))), (0, skydapp_browser_1.el)(".info-card", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_POOL_TITLE3")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("HOME_POOL_DESC3"))), (0, skydapp_browser_1.el)(".info-card", (0, skydapp_browser_1.el)("h3", (0, skydapp_browser_1.msg)("HOME_POOL_TITLE4")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("HOME_POOL_DESC4")))))))));
        this.loadPrice();
    }
    async loadPrice() {
        const result = await superagent_1.default.get("https://api.dogesound.club/mix/price");
        if (this.container.deleted !== true) {
            this.priceDisplay.empty().appendText(`${CommonUtil_1.default.numberWithCommas(result.text)} 원`);
        }
        const pid = await BurnPoolContract_1.default.getPoolId();
        const burnable = await MixEmitterContract_1.default.pendingMix(pid);
        const totalSupply = await MixContract_1.default.totalSupply();
        if (this.container.deleted !== true) {
            this.burnableDisplay.empty().appendText(`${CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(burnable))} MIX`);
            this.poolDisplay.empty().appendText(`${CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(totalSupply))} MIX`);
        }
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Home;
//# sourceMappingURL=Home.js.map