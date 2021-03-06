"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_1 = require("@ethersproject/bignumber");
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../../../CommonUtil"));
const MixContract_1 = __importDefault(require("../../../contracts/mix/MixContract"));
const PixelCatPoolContract_1 = __importDefault(require("../../../contracts/mix/PixelCatPoolContract"));
const PixelCatContract_1 = __importDefault(require("../../../contracts/nft/PixelCatContract"));
const Wallet_1 = __importDefault(require("../../../klaytn/Wallet"));
const Confirm_1 = __importDefault(require("../../shared/dialogue/Confirm"));
const Loading_1 = __importDefault(require("../../shared/loading/Loading"));
const PixelCatItem_1 = __importDefault(require("./PixelCatItem"));
class PixelCatTab extends skydapp_browser_1.DomNode {
    constructor() {
        super(".pixel-cat-tab");
        this.nfts = [];
        this.totalMix = bignumber_1.BigNumber.from(0);
        this.append((0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)(".total-mix", (0, skydapp_browser_1.el)("h4", (0, skydapp_browser_1.msg)("MINING_TAB_TITLE")), this.totalMixDisplay = (0, skydapp_browser_1.el)("span", "Loading...")), (0, skydapp_browser_1.el)("button.take-all-button", (0, skydapp_browser_1.msg)("MINING_TAB_BUTTON"), {
            click: async () => {
                if (await Wallet_1.default.connected() !== true) {
                    await Wallet_1.default.connect();
                }
                const owner = await Wallet_1.default.loadAddress();
                if (owner !== undefined) {
                    const balance = await MixContract_1.default.balanceOf(owner);
                    const fee = this.totalMix.div(9);
                    if (balance.lt(fee)) {
                        new Confirm_1.default((0, skydapp_browser_1.msg)("MINING_TAB_CONFIRM_TITLE1"), (0, skydapp_browser_1.msg)("MINING_TAB_CONFIRM_DESC1"), (0, skydapp_browser_1.msg)("MINING_TAB_CONFIRM_BUTTON1"), () => {
                            open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                        });
                    }
                    else {
                        if ((await MixContract_1.default.allowance(owner, PixelCatPoolContract_1.default.address)).lt(fee)) {
                            await MixContract_1.default.approve(PixelCatPoolContract_1.default.address, ethers_1.constants.MaxUint256);
                            setTimeout(async () => {
                                await PixelCatPoolContract_1.default.claim(this.nfts);
                            }, 2000);
                        }
                        else {
                            await PixelCatPoolContract_1.default.claim(this.nfts);
                        }
                    }
                }
            },
        })), this.list = (0, skydapp_browser_1.el)(".pixel-cat-list", new Loading_1.default()));
        this.load();
    }
    async load() {
        if (await Wallet_1.default.connected() !== true) {
            await Wallet_1.default.connect();
        }
        const walletAddress = await Wallet_1.default.loadAddress();
        if (walletAddress !== undefined) {
            const balance = (await PixelCatContract_1.default.balanceOf(walletAddress)).toNumber();
            const promises = [];
            for (let i = 0; i < balance; i += 1) {
                const promise = async (index) => {
                    const nftId = await PixelCatContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    this.nfts.push(nftId.toNumber());
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);
            this.list.empty();
            for (const nftId of this.nfts) {
                new PixelCatItem_1.default(this, nftId).appendTo(this.list);
            }
        }
        else {
            this.list.empty();
        }
    }
    changeMix(mix) {
        this.totalMix = this.totalMix.add(mix);
        this.totalMixDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(this.totalMix), 5));
    }
}
exports.default = PixelCatTab;
//# sourceMappingURL=PixelCatTab.js.map