import { DomNode, el, msg } from "skydapp-browser";
import { constants } from "ethers";
import { View, ViewParams } from "skydapp-common";
import CommonUtil from "../../CommonUtil";
import TurntableItem from "../../component/turntable/TurntableItem";
import MateContract from "../../contracts/nft/MateContract";
import KlayMIXListenersContract from "../../contracts/turntable/KlayMIXListenersContract";
import KSPMIXListenersContract from "../../contracts/turntable/KSPMIXListenersContract";
import MatesListenersContract from "../../contracts/turntable/MatesListenersContract";
import TurntablesContract from "../../contracts/turntable/TurntablesContract";
import Klaytn from "../../klaytn/Klaytn";
import Wallet from "../../klaytn/Wallet";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class Turntable implements View {

    private container: DomNode;
    private myTurntableList: DomNode;
    private listeningTurntableList: DomNode;
    private totalVolumeDisplay: DomNode;
    private totalTurntableList: DomNode;

    constructor() {
        Layout.current.title = msg("TURNTABLE_TITLE");
        Layout.current.content.append(
            this.container = el(".turntable-view",
                el("section",
                    el("h1", msg("TURNTABLE_TITLE")),
                    el("p", msg("TURNTABLE_DESC")),
                    el(".my-turntable",
                        el("h2", msg("TURNTABLE_TITLE1")),
                        // el("button", "턴테이블 구매하기", { click: () => ViewUtil.go("/turntable/buy") }),
                        this.myTurntableList = el(".turntable-list"),
                    ),
                    el(".listening-turntable",
                        el("h2", msg("TURNTABLE_TITLE2")),
                        this.listeningTurntableList = el(".turntable-list"),
                    ),
                    el(".all-turntable",
                        el("h2", msg("TURNTABLE_TITLE3")),
                        this.totalVolumeDisplay = el("p"),
                        this.totalTurntableList = el(".turntable-list"),
                    ),
                ),
            )
        );

        this.loadTotalVolume();
        this.loadTurntables();
    }


    private async loadTotalVolume() {
        const totalVolume = await TurntablesContract.totalVolume();
        this.totalVolumeDisplay.empty().appendText(`총 볼륨: ${CommonUtil.numberWithCommas(totalVolume.toString())}`);
    }

    private async loadTurntables() {

        const count = (await TurntablesContract.turntableLength()).toNumber();
        const walletAddress = await Wallet.loadAddress();
        const currentBlock = await Klaytn.loadBlockNumber();

        const matesTurntableIds: number[] = [];
        if (walletAddress !== undefined) {
            const balance = (await MateContract.balanceOf(walletAddress)).toNumber();
            const promises: Promise<void>[] = [];
            for (let i = 0; i < balance; i += 1) {
                const promise = async (index: number) => {
                    const mateId = await MateContract.tokenOfOwnerByIndex(walletAddress, index);
                    if (await MatesListenersContract.listening(mateId)) {
                        matesTurntableIds.push((await MatesListenersContract.listeningTo(mateId)).toNumber());
                    }
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);
        }

        const promises: Promise<void>[] = [];
        for (let i = 0; i < count; i += 1) {
            const promise = async (id: number) => {
                try {
                    const turntable = await TurntablesContract.turntables(id);
                    if (this.container.deleted !== true) {
                        if (
                            matesTurntableIds.includes(id) === true || (
                                walletAddress !== undefined && (
                                    (await KlayMIXListenersContract.shares(id, walletAddress)).gt(0) ||
                                    (await KSPMIXListenersContract.shares(id, walletAddress)).gt(0)
                                )
                            )
                        ) {
                            new TurntableItem(id, currentBlock, turntable).appendTo(this.listeningTurntableList);
                        }
                        if (turntable.owner !== constants.AddressZero) {
                            if (turntable.owner === walletAddress) {
                                new TurntableItem(id, currentBlock, turntable, true).appendTo(this.myTurntableList);
                            }
                            new TurntableItem(id, currentBlock, turntable).appendTo(this.totalTurntableList);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            promises.push(promise(i));
        }
        await Promise.all(promises);
    }


    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}