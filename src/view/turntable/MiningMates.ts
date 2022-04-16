import { BigNumber } from "@ethersproject/bignumber";
import { DomNode, el, msg } from "skydapp-browser";
import { utils } from "ethers";
import { View, ViewParams } from "skydapp-common";
import superagent from "superagent";
import CommonUtil from "../../CommonUtil";
import Loading from "../../component/shared/loading/Loading";
import MateItem from "../../component/turntable/MateItem";
import MateContract from "../../contracts/nft/MateContract";
import MatesListenersContract from "../../contracts/turntable/MatesListenersContract";
import Wallet from "../../klaytn/Wallet";
import Layout from "../Layout";

export default class MiningMates implements View {

    private container: DomNode;

    private mates: number[] = [];
    private totalMix: BigNumber = BigNumber.from(0);
    private totalMixDisplay: DomNode;

    private list: DomNode;

    constructor(params: ViewParams) {
        const turntableId = parseInt(params.id as string, 10);
        Layout.current.title = "턴테이블의 메이트로부터 채굴";
        Layout.current.content.append(this.container = el(".mining-mates-from-turntable-view",
            el("h1", "턴테이블의 메이트로부터 채굴하기"),
            el("header",
                el(".total-mix",
                    el("h4", msg("MINING_TAB_TITLE")),
                    this.totalMixDisplay = el("span", "Loading..."),
                ),
                el("button.take-all-button", msg("MINING_TAB_BUTTON"), {
                    click: async () => {
                        await MatesListenersContract.claim(turntableId, this.mates);
                    },
                }),
            ),
            this.list = el(".mate-list", new Loading()),
        ));

        this.load(turntableId);
    }

    private async load(turntableId: number) {
        if (await Wallet.connected() !== true) {
            await Wallet.connect();
        }
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {

            const result = await superagent.get("https://api.dogesound.club/mate/names");
            const mateNames = result.body;

            const mateBalance = (await MatesListenersContract.listenerCount(turntableId)).toNumber();

            const promises: Promise<void>[] = [];
            for (let i = 0; i < mateBalance; i += 1) {
                const promise = async (index: number) => {
                    const mateId = (await MatesListenersContract.listeners(turntableId, index)).toNumber();
                    if (await MateContract.ownerOf(mateId) === walletAddress) {
                        this.mates.push(mateId);
                    }
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);

            this.list.empty();

            for (const mateId of this.mates) {
                new MateItem(this, turntableId, mateId, mateNames[mateId]).appendTo(this.list);
            }

        } else {
            this.list.empty();
        }
    }

    public changeMix(mix: BigNumber) {
        this.totalMix = this.totalMix.add(mix);
        this.totalMixDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(this.totalMix), 5));
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}
