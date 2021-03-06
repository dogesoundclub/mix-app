"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const Loading_1 = __importDefault(require("../component/shared/loading/Loading"));
const BoothContract_1 = __importDefault(require("../contracts/mix/BoothContract"));
const MixContract_1 = __importDefault(require("../contracts/mix/MixContract"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const Layout_1 = __importDefault(require("./Layout"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
class Booth {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("BOOTH_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".booth-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)(".title", "1 MIXSET"), this.priceDisplay = (0, skydapp_browser_1.el)("span", new Loading_1.default()), (0, skydapp_browser_1.el)("span", " MIX")), (0, skydapp_browser_1.el)(".grid-container", (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)(".title", (0, skydapp_browser_1.msg)("BOOTH_TITLE1")), this.aprDisplay = (0, skydapp_browser_1.el)("span.bold", new Loading_1.default()), (0, skydapp_browser_1.el)("span", " %")), (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)(".title", (0, skydapp_browser_1.msg)("BOOTH_TITLE2")), this.totalBalanceDisplay = (0, skydapp_browser_1.el)("span.bold", new Loading_1.default()), (0, skydapp_browser_1.el)("span", " MIX")), (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)(".title", (0, skydapp_browser_1.msg)("BOOTH_TITLE3")), this.burn24Display = (0, skydapp_browser_1.el)("span.bold", new Loading_1.default()), (0, skydapp_browser_1.el)("span", " MIX")), (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)(".title", (0, skydapp_browser_1.msg)("BOOTH_TITLE4")), this.reward24Display = (0, skydapp_browser_1.el)("span.bold", new Loading_1.default()), (0, skydapp_browser_1.el)("span", " MIX")))), (0, skydapp_browser_1.el)("hr"), (0, skydapp_browser_1.el)("section.staking", (0, skydapp_browser_1.el)("h2", (0, skydapp_browser_1.msg)("BOOTH_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("BOOTH_DESC1")), (0, skydapp_browser_1.el)(".form", this.stakeInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("BOOTH_INPUT1") }), (0, skydapp_browser_1.el)("button", (0, skydapp_browser_1.msg)("BOOTH_BUTTON1"), {
            click: async () => {
                await BoothContract_1.default.stake(ethers_1.utils.parseEther(this.stakeInput.domElement.value));
                ViewUtil_1.default.waitTransactionAndRefresh();
            },
        }), (0, skydapp_browser_1.el)(".container", (0, skydapp_browser_1.el)(".caption", (0, skydapp_browser_1.el)("label", "MIX: "), this.balanceDisplay = (0, skydapp_browser_1.el)("span", new Loading_1.default())), (0, skydapp_browser_1.el)("button.max-btn", (0, skydapp_browser_1.msg)("BOOTH_BUTTON2"), {
            click: async () => {
                const walletAddress = await Wallet_1.default.loadAddress();
                if (walletAddress !== undefined) {
                    const balance = await MixContract_1.default.balanceOf(walletAddress);
                    this.stakeInput.domElement.value = ethers_1.utils.formatEther(balance);
                }
            },
        }))), (0, skydapp_browser_1.el)(".warning", (0, skydapp_browser_1.msg)("BOOTH_DESC2")), (0, skydapp_browser_1.el)("h2", (0, skydapp_browser_1.msg)("BOOTH_TITLE5")), (0, skydapp_browser_1.el)(".form", this.unstakeInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("BOOTH_INPUT2") }), (0, skydapp_browser_1.el)("button", (0, skydapp_browser_1.msg)("BOOTH_BUTTON3"), {
            click: async () => {
                await BoothContract_1.default.unstake(ethers_1.utils.parseEther(this.unstakeInput.domElement.value));
                ViewUtil_1.default.waitTransactionAndRefresh();
            },
        }), (0, skydapp_browser_1.el)(".container", (0, skydapp_browser_1.el)(".caption", (0, skydapp_browser_1.el)("label", "MIXSET: "), this.mixsetDisplay = (0, skydapp_browser_1.el)("span", new Loading_1.default())), (0, skydapp_browser_1.el)("button.max-btn", (0, skydapp_browser_1.msg)("BOOTH_BUTTON2"), {
            click: async () => {
                const walletAddress = await Wallet_1.default.loadAddress();
                if (walletAddress !== undefined) {
                    const staked = await BoothContract_1.default.balanceOf(walletAddress);
                    this.unstakeInput.domElement.value = ethers_1.utils.formatEther(staked);
                }
            },
        })))))));
        this.loadInfo();
        this.loadBalance();
    }
    async loadInfo() {
        const totalMix = await MixContract_1.default.balanceOf(BoothContract_1.default.address);
        const totalMixset = await BoothContract_1.default.getTotalSupply();
        if (totalMixset.eq(0)) {
            this.priceDisplay.empty().appendText("1");
        }
        else {
            this.priceDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(totalMix.mul(ethers_1.BigNumber.from("1000000000000000000")).div(totalMixset)), 5));
        }
        if (totalMix.eq(0)) {
            this.aprDisplay.empty().appendText("0");
            this.totalBalanceDisplay.empty().appendText("0");
            this.burn24Display.empty().appendText("0");
            this.reward24Display.empty().appendText("0");
        }
        else {
            const currentBlock = await Klaytn_1.default.loadBlockNumber();
            const transferEvents = await MixContract_1.default.getTransferEvents(BoothContract_1.default.address, currentBlock - 86400, currentBlock);
            let total24 = ethers_1.BigNumber.from(0);
            for (const event of transferEvents) {
                total24 = total24.add(event.returnValues[2]);
            }
            const stakeEvents = await BoothContract_1.default.getStakeEvents(currentBlock - 86400, currentBlock);
            for (const event of stakeEvents) {
                total24 = total24.sub(event.returnValues[1]);
            }
            const apr = total24.mul(3650000).div(totalMix).toNumber() / 100;
            this.aprDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(apr.toString()));
            this.totalBalanceDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(totalMix)));
            this.burn24Display.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(total24.mul(1000).div(3))));
            this.reward24Display.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(total24)));
        }
    }
    async loadBalance() {
        if (await Wallet_1.default.connected() !== true) {
            await Wallet_1.default.connect();
        }
        const walletAddress = await Wallet_1.default.loadAddress();
        if (walletAddress !== undefined) {
            const balance = await MixContract_1.default.balanceOf(walletAddress);
            this.balanceDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(balance)));
            const mixset = await BoothContract_1.default.balanceOf(walletAddress);
            this.mixsetDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(mixset)));
        }
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Booth;
//# sourceMappingURL=Booth.js.map