"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const skydapp_browser_1 = require("skydapp-browser");
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const Confirm_1 = __importDefault(require("../component/shared/dialogue/Confirm"));
const StageBmcsItem_1 = __importDefault(require("../component/stage/StageBmcsItem"));
const StageEmateItem_1 = __importDefault(require("../component/stage/StageEmateItem"));
const StageMateItem_1 = __importDefault(require("../component/stage/StageMateItem"));
const MixStakingContract_1 = __importDefault(require("../contracts/mix/MixStakingContract"));
const BiasContract_1 = __importDefault(require("../contracts/nft/BiasContract"));
const EMatesContract_1 = __importDefault(require("../contracts/nft/EMatesContract"));
const MateContract_1 = __importDefault(require("../contracts/nft/MateContract"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const Layout_1 = __importDefault(require("./Layout"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
class Stage {
    constructor() {
        this.stakingMates = [];
        this.stakingEmates = [];
        this.stakingBmcss = [];
        this.unstakingMates = [];
        this.unstakingEmates = [];
        this.unstakingBmcss = [];
        this.selectedStakings = [];
        this.selectedUnstakings = [];
        Layout_1.default.current.title = "Stage";
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".stage-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)("h1", "Stage")), (0, skydapp_browser_1.el)("p", "보유하고 있는 캐릭터를 클럽 스테이지 위로 올려 춤을 추게 하거나, 스테이지 아래에서 쉬게 할 수 있습니다. 무대 위로 올라간 캐릭터는 인싸가 되어 도지사운드클럽에서 진행하는 모든 거버넌스에서 기존보다 2배의 보팅 파워를 얻게 됩니다.\n\n도지사운드클럽의 커뮤니티 토큰인 MIX를 일정 기간 예치해야 캐릭터를 스테이지에 올릴 수 있습니다. 예치에 필요한 MIX의 양은 전체 믹스의 발행량, 락업되어있는 믹스의 양, 발행된 도지사운드클럽의 PFP 개수를 통해 계산됩니다. 예치 기간은 현재 1개월입니다. 예치 기간은 DSC 거버넌스를 통해 변경될 수 있습니다. 예치한 시점에서 정해진 예치 기간이 끝나면 믹스를 돌려받을 수 있습니다."), (0, skydapp_browser_1.el)(".warning", (0, skydapp_browser_1.msg)("MINING_V1_DESC3")), (0, skydapp_browser_1.el)(".info-container", this.mixNeedsDisplay = (0, skydapp_browser_1.el)("p", "현재 캐릭터 당 MIX 예치양 : ... mix"), this.returnMixTimeDisplay = (0, skydapp_browser_1.el)("p", "현재 예치 기간 : ... block (... day)")), (0, skydapp_browser_1.el)(".dancing-mate-container", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)("h6", "춤추고 있는 클럽메이트"), this.stageDownCount = (0, skydapp_browser_1.el)("p", "")), this.onStageMates = (0, skydapp_browser_1.el)(".mate-list"), this.stageDownButton = (0, skydapp_browser_1.el)(".button-container", (0, skydapp_browser_1.el)("a", {
            click: async () => {
                if (this.selectedStakings.length > 0) {
                    new Confirm_1.default("클럽 무대에서 내려 쉬게 하기", "예치한 믹스를 돌려받고 무대 아래에서 쉬게 합니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?", "확인", async () => {
                        const nfts = [];
                        const ids = [];
                        for (const data of this.selectedStakings) {
                            nfts.push(data.address);
                            ids.push(data.id);
                        }
                        await MixStakingContract_1.default.withdrawMix(nfts, ids);
                        ViewUtil_1.default.waitTransactionAndRefresh();
                    });
                }
            }
        }, (0, skydapp_browser_1.el)("img", { src: "/images/shared/icn/stage-down.svg", alt: "stage down" }), "STAGE DOWN"))), (0, skydapp_browser_1.el)("hr"), (0, skydapp_browser_1.el)(".resting-mate-container", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)("h6", "대기중인 클럽메이트"), this.stageUpCount = (0, skydapp_browser_1.el)("p", "")), this.offStageMates = (0, skydapp_browser_1.el)(".mate-list"), this.stageUpButton = (0, skydapp_browser_1.el)(".button-container", (0, skydapp_browser_1.el)("a", {
            click: async () => {
                if (this.selectedUnstakings.length > 0) {
                    const mix = await MixStakingContract_1.default.mixNeeds();
                    new Confirm_1.default("클럽 무대 위로 올리기", `총 ${CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(mix.mul(this.selectedUnstakings.length)))} 믹스를 스테이킹하고 캐릭터를 클럽 위로 올립니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?`, "확인", async () => {
                        const nfts = [];
                        const ids = [];
                        for (const data of this.selectedUnstakings) {
                            nfts.push(data.address);
                            ids.push(data.id);
                        }
                        await MixStakingContract_1.default.stakingMix(nfts, ids);
                        ViewUtil_1.default.waitTransactionAndRefresh();
                    });
                }
            }
        }, (0, skydapp_browser_1.el)("img", { src: "/images/shared/icn/stage-up.svg", alt: "stage up" }), (0, skydapp_browser_1.el)("p", "STAGE UP")))))));
        this.loadInfos();
        this.loadClubmates();
    }
    changeParams(params, uri) { }
    selectStaking(address, id) {
        this.selectedStakings.push({ address, id });
    }
    deselectStaking(address, id) {
        const index = this.selectedStakings.findIndex((s) => s.address === address && s.id === id);
        if (index !== -1) {
            this.selectedStakings.splice(index, 1);
        }
    }
    selectUnstaking(address, id) {
        this.selectedUnstakings.push({ address, id });
    }
    deselectUnstaking(address, id) {
        const index = this.selectedUnstakings.findIndex((s) => s.address === address && s.id === id);
        if (index !== -1) {
            this.selectedUnstakings.splice(index, 1);
        }
    }
    async loadInfos() {
        this.mixNeedsDisplay.empty().appendText(`현재 캐릭터 당 MIX 예치양 : ${CommonUtil_1.default.numberWithCommas(ethers_1.utils.formatEther(await MixStakingContract_1.default.mixNeeds()))} mix`);
        const block = (await MixStakingContract_1.default.returnMixTime()).toNumber();
        this.returnMixTimeDisplay.empty().appendText(`현재 예치 기간 : ${block} block (${block / 86400} day)`);
    }
    async loadClubmates() {
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
                    if ((await MixStakingContract_1.default.stakingBlocks(MateContract_1.default.address, mateId)).gt(0)) {
                        this.stakingMates.push(mateId.toNumber());
                    }
                    else {
                        this.unstakingMates.push(mateId.toNumber());
                    }
                };
                promises.push(promise(i));
            }
            const emateBalance = (await EMatesContract_1.default.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < emateBalance; i += 1) {
                const promise = async (index) => {
                    const emateId = await EMatesContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    if ((await MixStakingContract_1.default.stakingBlocks(EMatesContract_1.default.address, emateId)).gt(0)) {
                        this.stakingEmates.push(emateId.toNumber());
                    }
                    else {
                        this.unstakingEmates.push(emateId.toNumber());
                    }
                };
                promises.push(promise(i));
            }
            const bmcsBalance = (await BiasContract_1.default.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < bmcsBalance; i += 1) {
                const promise = async (index) => {
                    const bmcsId = await BiasContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    if ((await MixStakingContract_1.default.stakingBlocks(BiasContract_1.default.address, bmcsId)).gt(0)) {
                        this.stakingBmcss.push(bmcsId.toNumber());
                    }
                    else {
                        this.unstakingBmcss.push(bmcsId.toNumber());
                    }
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);
            const mateNames = await (await fetch("https://api.dogesound.club/mate/names")).json();
            const currentBlock = await Klaytn_1.default.loadBlockNumber();
            let stakingCount = 0;
            let unstakingCount = 0;
            for (const stakingMate of this.stakingMates) {
                this.onStageMates.append(new StageMateItem_1.default(this, stakingMate, 300, mateNames[stakingMate], currentBlock, true));
                stakingCount += 1;
            }
            for (const stakingEmate of this.stakingEmates) {
                this.onStageMates.append(new StageEmateItem_1.default(this, stakingEmate, 300, "", currentBlock, true));
                stakingCount += 1;
            }
            for (const stakingBmcs of this.stakingBmcss) {
                this.onStageMates.append(new StageBmcsItem_1.default(this, stakingBmcs, 300, "", currentBlock, true));
                stakingCount += 1;
            }
            for (const unstakingMate of this.unstakingMates) {
                this.offStageMates.append(new StageMateItem_1.default(this, unstakingMate, 300, mateNames[unstakingMate], currentBlock, false));
                unstakingCount += 1;
            }
            for (const unstakingEmate of this.unstakingEmates) {
                this.offStageMates.append(new StageEmateItem_1.default(this, unstakingEmate, 300, "", currentBlock, false));
                unstakingCount += 1;
            }
            for (const unstakingBmcs of this.unstakingBmcss) {
                this.offStageMates.append(new StageBmcsItem_1.default(this, unstakingBmcs, 300, "", currentBlock, false));
                unstakingCount += 1;
            }
            this.stageUpCount.empty().appendText(`${unstakingCount}개`);
            this.stageDownCount.empty().appendText(`${stakingCount}개`);
        }
    }
    close() {
        this.container.delete();
    }
}
exports.default = Stage;
//# sourceMappingURL=Stage.js.map