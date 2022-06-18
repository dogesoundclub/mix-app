import { utils } from "ethers";
import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import CommonUtil from "../CommonUtil";
import Confirm from "../component/shared/dialogue/Confirm";
import StageBmcsItem from "../component/stage/StageBmcsItem";
import StageEmateItem from "../component/stage/StageEmateItem";
import StageMateItem from "../component/stage/StageMateItem";
import MixStakingContract from "../contracts/mix/MixStakingContract";
import BiasContract from "../contracts/nft/BiasContract";
import EMatesContract from "../contracts/nft/EMatesContract";
import MateContract from "../contracts/nft/MateContract";
import Klaytn from "../klaytn/Klaytn";
import Wallet from "../klaytn/Wallet";
import Layout from "./Layout";
import ViewUtil from "./ViewUtil";

export default class Stage implements View {

    private stakingMates: number[] = [];
    private stakingEmates: number[] = [];
    private stakingBmcss: number[] = [];

    private unstakingMates: number[] = [];
    private unstakingEmates: number[] = [];
    private unstakingBmcss: number[] = [];

    private container: DomNode;

    private onStageMates: DomNode;
    private offStageMates: DomNode;

    private stageUpCount: DomNode;
    private stageDownCount: DomNode;

    private stageUpButton: DomNode;
    private stageDownButton: DomNode;

    private mixNeedsDisplay: DomNode;
    private returnMixTimeDisplay: DomNode;

    private selectedStakings: { address: string, id: number }[] = [];
    private selectedUnstakings: { address: string, id: number }[] = [];

    constructor() {
        Layout.current.title = "Stage";
        Layout.current.content.append(
            this.container = el(".stage-view",
                el("section",
                    el("header",
                        el("h1", "Stage"),
                        //el("p", "(v2)"),
                    ),
                    el("p", "보유하고 있는 캐릭터를 클럽 스테이지 위로 올려 춤을 추게 하거나, 스테이지 아래에서 쉬게 할 수 있습니다. 무대 위로 올라간 캐릭터는 인싸가 되어 도지사운드클럽에서 진행하는 모든 거버넌스에서 기존보다 2배의 보팅 파워를 얻게 됩니다.\n\n도지사운드클럽의 커뮤니티 토큰인 MIX를 일정 기간 예치해야 캐릭터를 스테이지에 올릴 수 있습니다. 예치에 필요한 MIX의 양은 전체 믹스의 발행량, 락업되어있는 믹스의 양, 발행된 도지사운드클럽의 PFP 개수를 통해 계산됩니다. 예치 기간은 현재 1개월입니다. 예치 기간은 DSC 거버넌스를 통해 변경될 수 있습니다. 예치한 시점에서 정해진 예치 기간이 끝나면 믹스를 돌려받을 수 있습니다."),
                    el(".warning", msg("MINING_V1_DESC3")),
                    el(".info-container",
                        this.mixNeedsDisplay = el("p", "현재 캐릭터 당 MIX 예치양 : ... mix"),
                        this.returnMixTimeDisplay = el("p", "현재 예치 기간 : ... block (... day)"),
                    ),
                    el(".dancing-mate-container",
                        el("header",
                            el("h6", "춤추고 있는 클럽메이트"),
                            this.stageDownCount = el("p", ""),
                        ),
                        this.onStageMates = el(".mate-list",
                        ),
                        this.stageDownButton = el(".button-container",
                            el("a", {
                                click: async () => {
                                    if (this.selectedStakings.length > 0) {
                                        new Confirm("클럽 무대에서 내려 쉬게 하기", "예치한 믹스를 돌려받고 무대 아래에서 쉬게 합니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?", "확인", async () => {
                                            const nfts: string[] = [];
                                            const ids: number[] = [];
                                            for (const data of this.selectedStakings) {
                                                nfts.push(data.address);
                                                ids.push(data.id);
                                            }
                                            await MixStakingContract.withdrawMix(nfts, ids);
                                            ViewUtil.waitTransactionAndRefresh();
                                        });
                                    }
                                }
                            },
                                el("img", { src: "/images/shared/icn/stage-down.svg", alt: "stage down" }),
                                "STAGE DOWN",
                            ),
                        ),
                    ),
                    el("hr"),
                    el(".resting-mate-container",
                        el("header",
                            el("h6", "대기중인 클럽메이트"),
                            this.stageUpCount = el("p", ""),
                        ),
                        this.offStageMates = el(".mate-list",
                        ),
                        this.stageUpButton = el(".button-container",
                            el("a", {
                                click: async () => {
                                    if (this.selectedUnstakings.length > 0) {
                                        const mix = await MixStakingContract.mixNeeds();
                                        new Confirm("클럽 무대 위로 올리기", `총 ${CommonUtil.numberWithCommas(utils.formatEther(mix.mul(this.selectedUnstakings.length)))} 믹스를 스테이킹하고 캐릭터를 클럽 위로 올립니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?`, "확인", async () => {
                                            const nfts: string[] = [];
                                            const ids: number[] = [];
                                            for (const data of this.selectedUnstakings) {
                                                nfts.push(data.address);
                                                ids.push(data.id);
                                            }
                                            await MixStakingContract.stakingMix(nfts, ids);
                                            ViewUtil.waitTransactionAndRefresh();
                                        });
                                    }
                                }
                            },
                                el("img", { src: "/images/shared/icn/stage-up.svg", alt: "stage up" }),
                                el("p", "STAGE UP"),
                            ),
                        ),
                    ),
                ),
            )
        );
        this.loadInfos();
        this.loadClubmates();
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public selectStaking(address: string, id: number) {
        this.selectedStakings.push({ address, id });
    }

    public deselectStaking(address: string, id: number) {
        const index = this.selectedStakings.findIndex((s) => s.address === address && s.id === id);
        if (index !== -1) {
            this.selectedStakings.splice(index, 1);
        }
    }

    public selectUnstaking(address: string, id: number) {
        this.selectedUnstakings.push({ address, id });
    }

    public deselectUnstaking(address: string, id: number) {
        const index = this.selectedUnstakings.findIndex((s) => s.address === address && s.id === id);
        if (index !== -1) {
            this.selectedUnstakings.splice(index, 1);
        }
    }

    private async loadInfos() {
        this.mixNeedsDisplay.empty().appendText(`현재 캐릭터 당 MIX 예치양 : ${CommonUtil.numberWithCommas(utils.formatEther(await MixStakingContract.mixNeeds()))} mix`);
        const block = (await MixStakingContract.returnMixTime()).toNumber();
        this.returnMixTimeDisplay.empty().appendText(`현재 예치 기간 : ${block} block (${block / 86400} day)`);
    }

    private async loadClubmates() {
        if (await Wallet.connected() !== true) {
            await Wallet.connect();
        }
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {
            const promises: Promise<void>[] = [];

            const mateBalance = (await MateContract.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < mateBalance; i += 1) {
                const promise = async (index: number) => {
                    const mateId = await MateContract.tokenOfOwnerByIndex(walletAddress, index);
                    if ((await MixStakingContract.stakingBlocks(MateContract.address, mateId)).gt(0)) {
                        this.stakingMates.push(mateId.toNumber());
                    } else {
                        this.unstakingMates.push(mateId.toNumber());
                    }
                };
                promises.push(promise(i));
            }

            const emateBalance = (await EMatesContract.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < emateBalance; i += 1) {
                const promise = async (index: number) => {
                    const emateId = await EMatesContract.tokenOfOwnerByIndex(walletAddress, index);
                    if ((await MixStakingContract.stakingBlocks(EMatesContract.address, emateId)).gt(0)) {
                        this.stakingEmates.push(emateId.toNumber());
                    } else {
                        this.unstakingEmates.push(emateId.toNumber());
                    }
                };
                promises.push(promise(i));
            }

            const bmcsBalance = (await BiasContract.balanceOf(walletAddress)).toNumber();
            for (let i = 0; i < bmcsBalance; i += 1) {
                const promise = async (index: number) => {
                    const bmcsId = await BiasContract.tokenOfOwnerByIndex(walletAddress, index);
                    if ((await MixStakingContract.stakingBlocks(BiasContract.address, bmcsId)).gt(0)) {
                        this.stakingBmcss.push(bmcsId.toNumber());
                    } else {
                        this.unstakingBmcss.push(bmcsId.toNumber());
                    }
                };
                promises.push(promise(i));
            }

            await Promise.all(promises);

            const mateNames = await (await fetch("https://api.dogesound.club/mate/names")).json();
            const currentBlock = await Klaytn.loadBlockNumber();

            let stakingCount = 0;
            let unstakingCount = 0;
            for (const stakingMate of this.stakingMates) {
                this.onStageMates.append(new StageMateItem(this, stakingMate, 300, mateNames[stakingMate], currentBlock, true));
                stakingCount += 1;
            }

            for (const stakingEmate of this.stakingEmates) {
                this.onStageMates.append(new StageEmateItem(this, stakingEmate, 300, "", currentBlock, true));
                stakingCount += 1;
            }

            for (const stakingBmcs of this.stakingBmcss) {
                this.onStageMates.append(new StageBmcsItem(this, stakingBmcs, 300, "", currentBlock, true));
                stakingCount += 1;
            }

            for (const unstakingMate of this.unstakingMates) {
                this.offStageMates.append(new StageMateItem(this, unstakingMate, 300, mateNames[unstakingMate], currentBlock, false));
                unstakingCount += 1;
            }

            for (const unstakingEmate of this.unstakingEmates) {
                this.offStageMates.append(new StageEmateItem(this, unstakingEmate, 300, "", currentBlock, false));
                unstakingCount += 1;
            }

            for (const unstakingBmcs of this.unstakingBmcss) {
                this.offStageMates.append(new StageBmcsItem(this, unstakingBmcs, 300, "", currentBlock, false));
                unstakingCount += 1;
            }

            this.stageUpCount.empty().appendText(`${unstakingCount}개`);
            this.stageDownCount.empty().appendText(`${stakingCount}개`);
        }
    }

    public close(): void {
        this.container.delete();
    }
}