"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
const ethers_1 = require("ethers");
const superagent_1 = __importDefault(require("superagent"));
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const BurnPoolContract_1 = __importDefault(require("../contracts/mix/BurnPoolContract"));
const MixEmitterContract_1 = __importDefault(require("../contracts/mix/MixEmitterContract"));
const Layout_1 = __importDefault(require("./Layout"));
class Home {
    constructor() {
        Layout_1.default.current.title = "NFT 프로젝트 허브를 위한 토큰";
        Layout_1.default.current.content.append((this.container = (0, skynode_1.el)(".home-view", (0, skynode_1.el)("header", (0, skynode_1.el)(".overview-container", (0, skynode_1.el)(".content", (0, skynode_1.el)("h3", "1믹스 가격"), this.priceDisplay = (0, skynode_1.el)("p", "...원")), (0, skynode_1.el)("hr"), (0, skynode_1.el)(".content", (0, skynode_1.el)("h3", "1믹스 발행량"), this.poolDisplay = (0, skynode_1.el)("p", "...MIX")), (0, skynode_1.el)("hr"), (0, skynode_1.el)(".content", (0, skynode_1.el)("h3", "믹스 소각풀"), this.burnableDisplay = (0, skynode_1.el)("p", "...MIX"))), (0, skynode_1.el)(".desc-container", (0, skynode_1.el)("img", { src: "/images/shared/logo/mix.svg", alt: "mix logo" }), (0, skynode_1.el)("h1", "NFT 프로젝트 허브를 위한 토큰"), (0, skynode_1.el)("p", "MIX는 NFT 프로젝트들의 허브를 위한 토큰입니다.\nDSC 사이트의 전 범위에서 사용되며, Klayswap에서 유동성 공급 및 거래에 사용될 예정입니다.\n또한 MIX를 활용한 기능을 추가하기로 약속한 파트너 프로젝트의 서비스에서도 사용될 예정입니다."), (0, skynode_1.el)(".button-container", (0, skynode_1.el)("a", "믹스 구매하기"), (0, skynode_1.el)("a.outline", "백서 보기")), (0, skynode_1.el)("a.add-mix", "MIX 지갑에 추가하기")), (0, skynode_1.el)(".scroll-container", (0, skynode_1.el)("img", { src: "/images/shared/img/scroll.svg", alt: "scroll" }))), (0, skynode_1.el)("article", (0, skynode_1.el)(".pool-container", (0, skynode_1.el)("h2", "풀 정보"), (0, skynode_1.el)("section", (0, skynode_1.el)(".info-card", (0, skynode_1.el)("h3", "메이트 풀"), (0, skynode_1.el)("p", "메이트 홀더들은 DSC 커뮤니티의 가장 적극적인 사용자들로, 메이트를 보유하고 있으면 MIX를 분배받게 됩니다. 메이트 홀더들은 쌓여진 MIX를 인출하기 위해 쌓여진 MIX 수량의 10%를 선납해야합니다. 이를 통해 MIX의 유통량이 늘어납니다.")), (0, skynode_1.el)(".info-card", (0, skynode_1.el)("h3", "파트너 풀"), (0, skynode_1.el)("p", "파트너 풀은 MIX 커뮤니티와 파트너십을 맺은 프로젝트들에 할당되는 풀입니다. 해당 프로젝트들은 MIX를 활용하는 기능들을 지속적으로 추가할 예정입니다. 인출 방식은 메이트와 동일합니다.")), (0, skynode_1.el)(".info-card", (0, skynode_1.el)("h3", "리스너 풀"), (0, skynode_1.el)("p", "NFT 홀더들의 경우, 본인의 NFT를 턴테이블에 등록하면 해당 턴테이블의 리스너가 되어 추가적인 MIX를 받을 수 있습니다. Klayswap 유동성 풀 사용자들의 경우, 턴테이블에 LP 토큰을 예치하면 마찬가지로 리스너가 되어 추가적인 MIX를 받을 수 있습니다. 리스너에게 할당된 MIX는 턴테이블 소유주에게 30%가, NFT 및 LP 토큰 홀더들에게 70%를 분배됩니다. 리스너 시스템을 통해 턴테이블 소유자들은 리스너를 유치하기 위해 노력할 것입니다.")), (0, skynode_1.el)(".info-card", (0, skynode_1.el)("h3", "턴테이블"), (0, skynode_1.el)("p", "턴테이블은 MIX를 중~장기로 스테이킹하고자 하는 사용자들을 위한 시스템입니다. 사용자들은 사이트 내에서 MIX로 턴테이블을 구매할 수 있으며, 턴테이블의 “볼륨”에 따라 MIX를 분배받는 비율이 결정됩니다. 턴테이블의 등급에 따라 가격과 볼륨이 다르며, 턴테이블에는 배터리가 존재합니다. 배터리가 모두 소모된 턴테이블은 다시 MIX를 통해 배터리를 충전해야 지속적으로 MIX를 얻을 수 있습니다. 턴테이블은 분해가 가능하며, 분해하면 조립시 사용된 MIX의 80%를 돌려받습니다.")), (0, skynode_1.el)(".info-card", (0, skynode_1.el)("h3", "Klayswap 유동성 풀"), (0, skynode_1.el)("p", "Klayswap의 유동성 풀에 발행량 중 일부를 할당합니다. 이를 통해 Klayswap 내 MIX 풀의 APR을 상승시켜, MIX 토큰이 더 큰 유동성을 갖도록 만듭니다. 풀은 Klay-MIX LP 및 KSP-MIX LP, 두 가지가 있습니다.")), (0, skynode_1.el)(".info-card", (0, skynode_1.el)("h3", "Dev Fund"), (0, skynode_1.el)("p", "개발 펀드는 개발 및 마케팅 등 MIX의 활용처를 늘리고 주어진 목표를 달성하는 책임을 이행할 수 있도록 합니다."))))))));
        this.loadPrice();
    }
    async loadPrice() {
        const result = await superagent_1.default.get("https://api.dogesound.club/mix/price");
        if (this.container.deleted !== true) {
            this.priceDisplay.empty().appendText(`${CommonUtil_1.default.numberWithCommas(result.text)}원`);
        }
        const pid = await BurnPoolContract_1.default.getPoolId();
        const burnable = await MixEmitterContract_1.default.pendingMix(pid);
        if (this.container.deleted !== true) {
            this.burnableDisplay.empty().appendText(CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(burnable)));
            this.poolDisplay.empty().appendText("...");
        }
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Home;
//# sourceMappingURL=Home.js.map