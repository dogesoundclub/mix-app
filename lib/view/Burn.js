"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
const ethers_1 = require("ethers");
const MixContract_1 = __importDefault(require("../contracts/mix/MixContract"));
const Loading_1 = __importDefault(require("../component/shared/loading/Loading"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
const Layout_1 = __importDefault(require("./Layout"));
class Burn {
    constructor() {
        Layout_1.default.current.title = "MIX 소각";
        Layout_1.default.current.content.append(this.container = (0, skynode_1.el)(".burn-view", (0, skynode_1.el)("section", (0, skynode_1.el)("img", { src: "/images/shared/logo/mix.svg" }), (0, skynode_1.el)("h1", "믹스 소각"), (0, skynode_1.el)("p", "MIX가 소각될 때 마다 소각량의 0.3%가 부스에 대한 지분에 따라 분배됩니다."), this.burnInput = (0, skynode_1.el)("input", { placeholder: "소각할 액수를 넣어주세요" }), (0, skynode_1.el)("button", "소각하기", {
            click: async () => {
                await MixContract_1.default.burn(ethers_1.utils.parseEther(this.burnInput.domElement.value));
                ViewUtil_1.default.waitTransactionAndRefresh();
            },
        }), (0, skynode_1.el)(".mix-container", this.balanceDisplay = (0, skynode_1.el)("span", new Loading_1.default()), (0, skynode_1.el)("button.max-btn", "최대 수량", {
            click: async () => {
                const walletAddress = await Wallet_1.default.loadAddress();
                if (walletAddress !== undefined) {
                    const balance = await MixContract_1.default.balanceOf(walletAddress);
                    this.burnInput.domElement.value = ethers_1.utils.formatEther(balance);
                }
            },
        })), (0, skynode_1.el)("p.warning", "예치 시에는 2번의 트랜잭션이 발생합니다. 한번은 토큰 사용 허락을 위한 것이며,\n다른 하나는 실제 예치를 위한 것입니다."))));
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