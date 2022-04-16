"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const MixContract_1 = __importDefault(require("../contracts/mix/MixContract"));
const Loading_1 = __importDefault(require("../component/shared/loading/Loading"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
const Layout_1 = __importDefault(require("./Layout"));
class Burn {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("BURN_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".burn-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("img", { src: "/images/shared/logo/mix.svg" }), (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("BURN_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("BURN_DESC1")), this.burnInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("BURN_INPUT1") }), (0, skydapp_browser_1.el)("button", (0, skydapp_browser_1.msg)("BURN_BUTTON1"), {
            click: async () => {
                await MixContract_1.default.burn(ethers_1.utils.parseEther(this.burnInput.domElement.value));
                ViewUtil_1.default.waitTransactionAndRefresh();
            },
        }), (0, skydapp_browser_1.el)(".mix-container", this.balanceDisplay = (0, skydapp_browser_1.el)("span", new Loading_1.default()), (0, skydapp_browser_1.el)("button.max-btn", (0, skydapp_browser_1.msg)("BURN_BUTTON2"), {
            click: async () => {
                const walletAddress = await Wallet_1.default.loadAddress();
                if (walletAddress !== undefined) {
                    const balance = await MixContract_1.default.balanceOf(walletAddress);
                    this.burnInput.domElement.value = ethers_1.utils.formatEther(balance);
                }
            },
        })), (0, skydapp_browser_1.el)("p.warning", (0, skydapp_browser_1.msg)("BURN_DESC2")))));
        this.loadBalance();
    }
    async loadBalance() {
        if (await Wallet_1.default.connected() !== true) {
            await Wallet_1.default.connect();
        }
        const walletAddress = await Wallet_1.default.loadAddress();
        if (walletAddress !== undefined) {
            const balance = await MixContract_1.default.balanceOf(walletAddress);
            this.balanceDisplay.empty().appendText(`MIX: ${CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(balance))}`);
        }
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Burn;
//# sourceMappingURL=Burn.js.map