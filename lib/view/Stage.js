"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const Confirm_1 = __importDefault(require("../component/shared/dialogue/Confirm"));
const BiasContract_1 = __importDefault(require("../contracts/nft/BiasContract"));
const EMatesContract_1 = __importDefault(require("../contracts/nft/EMatesContract"));
const MateContract_1 = __importDefault(require("../contracts/nft/MateContract"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const Layout_1 = __importDefault(require("./Layout"));
class Stage {
    constructor() {
        this.mates = [];
        this.emates = [];
        this.bmcss = [];
        Layout_1.default.current.title = "Stage";
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".stage-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)("h1", "MIX 채굴"), (0, skydapp_browser_1.el)("p", "(v2)")), (0, skydapp_browser_1.el)("p", "보유하고 있는 캐릭터를 클럽 스테이지 위로 올려 춤을 추게 하거나, 스테이지 아래에서 쉬게 할 수 있습니다. 무대 위로 올라간 캐릭터는 인싸가 되어 도지사운드클럽에서 진행하는 모든 거버넌스에서 기존보다 2배의 보팅 파워를 얻게 됩니다.\n\n도지사운드클럽의 커뮤니티 토큰인 MIX를 일정 기간 예치해야 캐릭터를 스테이지에 올릴 수 있습니다. 예치에 필요한 MIX의 양은 전체 믹스의 발행량, 락업되어있는 믹스의 양, 발행된 도지사운드클럽의 PFP 개수를 통해 계산됩니다. 예치 기간은 현재 1개월입니다. 예치 기간은 DSC 거버넌스를 통해 변경될 수 있습니다. 예치한 시점에서 정해진 예치 기간이 끝나면 믹스를 돌려받을 수 있습니다."), (0, skydapp_browser_1.el)(".warning", (0, skydapp_browser_1.msg)("MINING_V1_DESC3")), (0, skydapp_browser_1.el)(".dancing-mate-container", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)("h6", "춤추고 있는 클럽메이트"), (0, skydapp_browser_1.el)("p", "(10개)")), this.onStageMates = (0, skydapp_browser_1.el)(".mate-list"), (0, skydapp_browser_1.el)(".button-container", (0, skydapp_browser_1.el)("a", {
            click: () => {
                new Confirm_1.default("클럽 무대에서 내려 쉬게 하기", "예치한 믹스를 돌려받고 무대 아래에서 쉬게 합니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?", "확인", () => { });
            }
        }, (0, skydapp_browser_1.el)("img", { src: "/images/shared/icn/stage-down.svg", alt: "stage down" }), "STAGE DOWN"))), (0, skydapp_browser_1.el)("hr"), (0, skydapp_browser_1.el)(".resting-mate-container", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)("h6", "춤추고 있는 클럽메이트"), (0, skydapp_browser_1.el)("p", "10개")), this.offStageMates = (0, skydapp_browser_1.el)(".mate-list"), (0, skydapp_browser_1.el)(".button-container", (0, skydapp_browser_1.el)("a", {
            click: () => {
                new Confirm_1.default("클럽 무대 위로 올리기", "총 XXX 믹스를 스테이킹하고 캐릭터를 클럽 위로 올립니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?", "확인", () => { });
            }
        }, (0, skydapp_browser_1.el)("img", { src: "/images/shared/icn/stage-up.svg", alt: "stage up" }), (0, skydapp_browser_1.el)("p", "STAGE UP")))))));
        this.load();
    }
    changeParams(params, uri) { }
    async load() {
        if (await Wallet_1.default.connected() !== true) {
            await Wallet_1.default.connect();
        }
        const walletAddress = await Wallet_1.default.loadAddress();
        if (walletAddress !== undefined) {
            const promises = [];
            const mateBalance = (await MateContract_1.default.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < mateBalance; i += 1) {
                const promise = async (index) => {
                    const mateId = await MateContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    this.mates.push(mateId.toNumber());
                };
                promises.push(promise(i));
            }
            const emateBalance = (await EMatesContract_1.default.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < emateBalance; i += 1) {
                const promise = async (index) => {
                    const emateId = await EMatesContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    this.emates.push(emateId.toNumber());
                };
                promises.push(promise(i));
            }
            const bmcsBalance = (await BiasContract_1.default.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < bmcsBalance; i += 1) {
                const promise = async (index) => {
                    const bmcsId = await BiasContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    this.bmcss.push(bmcsId.toNumber());
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);
            console.log(this.mates, this.emates, this.bmcss);
        }
    }
    close() {
        this.container.delete();
    }
}
exports.default = Stage;
//# sourceMappingURL=Stage.js.map