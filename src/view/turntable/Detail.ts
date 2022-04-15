import { DomNode, el, msg } from "skydapp-browser";
import { constants, utils } from "ethers";
import { View, ViewParams } from "skydapp-common";
import CommonUtil from "../../CommonUtil";
import MateList from "../../component/mate/MateList";
import Config from "../../Config";
import MixEmitterContract from "../../contracts/mix/MixEmitterContract";
import MatesListenersContract from "../../contracts/turntable/MatesListenersContract";
import TurntableExtrasContract from "../../contracts/turntable/TurntableExtrasContract";
import TurntablesContract from "../../contracts/turntable/TurntablesContract";
import Klaytn from "../../klaytn/Klaytn";
import Wallet from "../../klaytn/Wallet";
import turntables from "../../turntables.json";
import Prompt from "../../component/shared/dialogue/Prompt";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";
import LPTokenListenersV2 from "../../component/turntable/LPTokenListenersV2";
import KlayMIXListenersContractV2 from "../../contracts/turntable/KlayMIXListenersContractV2";
import KSPMIXListenersContractV2 from "../../contracts/turntable/KSPMIXListenersContractV2";

export default class Detail implements View {

    private container: DomNode;
    private title: DomNode;
    private socailDisplay: DomNode;
    private infoDisplay: DomNode;
    private imgDisplay: DomNode<HTMLImageElement>;
    private controller: DomNode;
    private controller2: DomNode;
    private mateRewardInfo: DomNode;
    private listeningMateList: MateList;

    constructor(params: ViewParams) {
        const turntableId = parseInt(params.id, 10);
        Layout.current.title = `${msg("TURNTABLE_DETAIL_TITLE")}${turntableId}`;
        Layout.current.content.append(this.container = el(".turntable-detail-view",
            el("section",
                el("header",
                    this.imgDisplay = el("img"),
                    el("section",
                        this.socailDisplay = el(".social-container"),
                        this.title = el("h1", `${msg("TURNTABLE_DETAIL_TITLE")}${turntableId}`),
                        this.infoDisplay = el(".info"),
                    ),
                ),
                el("hr"),
                this.controller = el(".controller"),
                this.controller2 = el(".controller2"),
                el("section",
                    el("h2", msg("TURNTABLE_DETAIL_TITLE1")),
                    el("button", msg("TURNTABLE_DETAIL_BUTTON1"), { click: () => ViewUtil.go(`/turntable/${turntableId}/miningmates`) }),
                    this.mateRewardInfo = el(".mate-reward-info"),
                    this.listeningMateList = new MateList(false, false),
                ),
                el(".controller",
                    el("button.add-mates-button", msg("TURNTABLE_DETAIL_BUTTON2"), {
                        click: () => ViewUtil.go(`/turntable/${turntableId}/addmates`),
                    }),
                    el("button.remove-mates-button", msg("TURNTABLE_DETAIL_BUTTON3"), {
                        click: () => ViewUtil.go(`/turntable/${turntableId}/removemates`),
                    }),
                ),
                el("a.mate-holders-button", msg("TURNTABLE_DETAIL_BUTTON4"), {
                    click: () => ViewUtil.go(`/turntable/${turntableId}/mateholders`),
                }),
                el("hr"),
                el("section",
                    el("h2", msg("TURNTABLE_DETAIL_TITLE2")),
                    el("p.warning", msg("TURNTABLE_DETAIL_DESC2")),
                    el(".listeners",
                        new LPTokenListenersV2(
                            "Klay-MIX Listeners V2",
                            KlayMIXListenersContractV2,
                            turntableId,
                            14,
                        ),
                        new LPTokenListenersV2(
                            "KSP-MIX Listeners V2",
                            KSPMIXListenersContractV2,
                            turntableId,
                            15,
                        ),
                    ),
                ),
            ),
        ));
        this.loadInfo(turntableId);
        this.loadListeningMates(turntableId);
    }

    private async loadInfo(turntableId: number) {
        const currentBlock = await Klaytn.loadBlockNumber();
        const walletAddress = await Wallet.loadAddress();

        const turntable = await TurntablesContract.turntables(turntableId);
        if (turntable.owner === constants.AddressZero) {
            this.infoDisplay.empty().appendText(msg("TURNTABLE_DETAIL_DESC3"));
        } else {
            const lifetime = turntable.endBlock - currentBlock;
            const claimable = await TurntablesContract.claimableOf(turntableId);

            const extra = await TurntableExtrasContract.extras(turntableId);
            let data: any = {};
            try { data = JSON.parse(extra); } catch (e) { console.error(e); }

            if (data.name !== undefined) {
                Layout.current.title = data.name;
                this.title.empty().appendText(data.name);
            }

            const turntableType = turntables[turntable.typeId];
            this.imgDisplay.domElement.src = turntableType.img;
            this.infoDisplay.empty().append(
                el(".volume", `Volume: ${CommonUtil.numberWithCommas(String(turntableType.volume))}`),
            );

            if (data.bgm !== undefined) {
                let bgm = data.bgm;
                const v = bgm.indexOf("?v=");
                if (v !== -1) {
                    bgm = `https://www.youtube.com/embed/${bgm.substring(v + 3)}`;
                } else if (bgm.indexOf("https://youtu.be/") === 0) {
                    bgm = `https://www.youtube.com/embed/${bgm.substring(17)}`;
                }
                this.infoDisplay.append(
                    // el("iframe.video", {
                    //     height: "200",
                    //     src: bgm,
                    //     title: "YouTube video player",
                    //     allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                    // }),
                );
            }
            if (data.description !== undefined) {
                this.infoDisplay.append(
                    el("p", data.description),
                );
            }
            if (data.kakaotalk !== undefined) {
                this.socailDisplay.append(
                    el(".social", el("a", el("img", { src: "/images/shared/icn/kakao.svg" }), { href: data.kakaotalk, target: "_blank" })),
                );
            }
            if (data.twitter !== undefined) {
                this.socailDisplay.append(
                    el(".social", el("a",
                        el("img", { src: "/images/shared/icn/twitter.svg" }),
                        {
                            href: data.twitter[0] === "@" ? `https://twitter.com/${data.twitter.substring(1)}` : data.twitter,
                            target: "_blank",
                        })),
                );
            }

            this.infoDisplay.append(
                el(".owner", `${msg("TURNTABLE_DETAIL_DESC4")}: ${turntable.owner}`),
                turntable.owner !== walletAddress ? undefined : el(".mix", `${msg("TURNTABLE_DETAIL_DESC5")}: ${CommonUtil.numberWithCommas(utils.formatEther(claimable), 5)}`),
                el(".lifetime", `Lifetime: ${CommonUtil.numberWithCommas(String(lifetime < 0 ? 0 : lifetime))} Blocks`),
            );

            if (turntable.owner === walletAddress) {

                this.controller.empty().append(
                    el("button.charge-button", msg("TURNTABLE_DETAIL_BUTTON5"), {
                        click: () => {
                            new Prompt(msg("TURNTABLE_DETAIL_PROMPT_TITLE1"), msg("TURNTABLE_DETAIL_PROMPT_DESC1"), msg("TURNTABLE_DETAIL_PROMPT_BUTTON1"), async (amount) => {
                                const mix = utils.parseEther(amount);
                                await TurntablesContract.charge(turntableId, mix);
                                ViewUtil.waitTransactionAndRefresh();
                            });
                        },
                    }),
                    el("button.update-button", msg("TURNTABLE_DETAIL_BUTTON6"), { click: () => ViewUtil.go(`/turntable/${turntableId}/update`) }),
                );

                this.controller2.empty().append(
                    el("button.claim-button", msg("TURNTABLE_DETAIL_BUTTON7"), { click: () => TurntablesContract.claim([turntableId]) }),
                );
            }
        }
    }

    private async loadListeningMates(turntableId: number) {

        const poolInfo = await MixEmitterContract.poolInfo(Config.isTestnet === true ? 4 : 9);
        const tokenPerDay = poolInfo.allocPoint / 10000 / 2 * 86400 * 0.7;
        const totalShares = (await MatesListenersContract.totalShares()).toNumber();
        this.mateRewardInfo.empty().append(
            el("p", `${msg("TURNTABLE_DETAIL_DESC6")}: ${CommonUtil.numberWithCommas(String(tokenPerDay / totalShares))}`)
        );

        const mateBalance = (await MatesListenersContract.listenerCount(turntableId)).toNumber();

        const mates: number[] = [];

        const promises: Promise<void>[] = [];
        for (let i = 0; i < mateBalance; i += 1) {
            const promise = async (index: number) => {
                const mateId = (await MatesListenersContract.listeners(turntableId, index)).toNumber();
                mates.push(mateId);
            };
            promises.push(promise(i));
        }
        await Promise.all(promises);

        this.listeningMateList.load(mates);
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}
