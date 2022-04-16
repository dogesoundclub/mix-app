"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../../../CommonUtil"));
const BiasPoolContract_1 = __importDefault(require("../../../contracts/mix/BiasPoolContract"));
const MixContract_1 = __importDefault(require("../../../contracts/mix/MixContract"));
const Wallet_1 = __importDefault(require("../../../klaytn/Wallet"));
const Confirm_1 = __importDefault(require("../../shared/dialogue/Confirm"));
class BMCSItem extends skydapp_browser_1.DomNode {
    constructor(tab, id, name) {
        super(".mate-item");
        this.tab = tab;
        this.id = id;
        this.claimable = ethers_1.BigNumber.from(0);
        this.append((0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)("img", { src: `https://storage.googleapis.com/dsc-bias/bias/bmcs/bia-${id}.png`, alt: `bias-${id}` }), (0, skydapp_browser_1.el)(".info", (0, skydapp_browser_1.el)("h5", (0, skydapp_browser_1.msg)("MINING_ITEM_TITLE")), this.mixAmount = (0, skydapp_browser_1.el)(".amount", "Loading...")), (0, skydapp_browser_1.el)(".controller", (0, skydapp_browser_1.el)("button.claim-button", (0, skydapp_browser_1.msg)("MINING_ITEM_BUTTON"), {
            click: async () => {
                if (await Wallet_1.default.connected() !== true) {
                    await Wallet_1.default.connect();
                }
                const owner = await Wallet_1.default.loadAddress();
                if (owner !== undefined) {
                    const balance = await MixContract_1.default.balanceOf(owner);
                    const fee = this.claimable.div(9);
                    if (balance.lt(fee)) {
                        new Confirm_1.default((0, skydapp_browser_1.msg)("MINING_TAB_CONFIRM_TITLE1"), (0, skydapp_browser_1.msg)("MINING_TAB_CONFIRM_DESC1"), (0, skydapp_browser_1.msg)("MINING_TAB_CONFIRM_BUTTON1"), () => {
                            open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                        });
                    }
                    else {
                        if ((await MixContract_1.default.allowance(owner, BiasPoolContract_1.default.address)).lt(fee)) {
                            await MixContract_1.default.approve(BiasPoolContract_1.default.address, ethers_1.constants.MaxUint256);
                            setTimeout(async () => {
                                await BiasPoolContract_1.default.claim([this.id]);
                            }, 2000);
                        }
                        else {
                            await BiasPoolContract_1.default.claim([this.id]);
                        }
                    }
                }
            },
        }))));
        this.load();
        this.refreshInterval = setInterval(() => this.load(), 1000);
    }
    async load() {
        const claimable = await BiasPoolContract_1.default.claimableOf(this.id);
        if (this.deleted !== true) {
            this.mixAmount.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(claimable), 5));
            this.tab.changeMix(claimable.sub(this.claimable));
            this.claimable = claimable;
        }
    }
    delete() {
        clearInterval(this.refreshInterval);
        super.delete();
    }
}
exports.default = BMCSItem;
//# sourceMappingURL=BMCSItem.js.map