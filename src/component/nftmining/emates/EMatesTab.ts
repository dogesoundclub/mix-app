import { BigNumber } from "@ethersproject/bignumber";
import { DomNode, el } from "@hanul/skynode";
import { constants, utils } from "ethers";
import superagent from "superagent";
import CommonUtil from "../../../CommonUtil";
import EMatesPoolContract from "../../../contracts/mix/EMatesPoolContract";
import MixContract from "../../../contracts/mix/MixContract";
import EMatesContract from "../../../contracts/nft/EMatesContract";
import Wallet from "../../../klaytn/Wallet";
import Confirm from "../../shared/dialogue/Confirm";
import Loading from "../../shared/loading/Loading";
import EMateItem from "./EMateItem";

export default class EMatesTab extends DomNode {

    private mates: number[] = [];
    private totalMix: BigNumber = BigNumber.from(0);
    private totalMixDisplay: DomNode;

    private list: DomNode;

    constructor() {
        super(".mates-tab");
        this.append(
            el("header",
                el(".total-mix",
                    el("h4", "쌓인 총 MIX"),
                    this.totalMixDisplay = el("span", "Loading..."),
                ),
                el("button.take-all-button", "한꺼번에 받기", {
                    click: async () => {
                        if (await Wallet.connected() !== true) {
                            await Wallet.connect();
                        }
                        const owner = await Wallet.loadAddress();
                        if (owner !== undefined) {
                            const balance = await MixContract.balanceOf(owner);
                            const fee = this.totalMix.div(9);
                            if (balance.lt(fee)) {
                                new Confirm("믹스 구매", "NFT로부터 MIX를 수령받기 위해서는 수령받을 MIX의 10%의 MIX를 선납해야 합니다.", "구매", () => {
                                    open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                                });
                            } else {
                                if ((await MixContract.allowance(owner, EMatesPoolContract.address)).lt(fee)) {
                                    await MixContract.approve(EMatesPoolContract.address, constants.MaxUint256);
                                    setTimeout(async () => {
                                        await EMatesPoolContract.claim(this.mates);
                                    }, 2000);
                                } else {
                                    await EMatesPoolContract.claim(this.mates);
                                }
                            }
                        }
                    },
                }),
            ),
            this.list = el(".mate-list", new Loading()),
        );
        this.load();
    }

    private async load() {
        if (await Wallet.connected() !== true) {
            await Wallet.connect();
        }
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {

            const result = await superagent.get("https://api.dogesound.club/mate/names");
            const mateNames = result.body;

            const balance = (await EMatesContract.balanceOf(walletAddress)).toNumber();

            const promises: Promise<void>[] = [];
            for (let i = 0; i < balance; i += 1) {
                const promise = async (index: number) => {
                    const mateId = await EMatesContract.tokenOfOwnerByIndex(walletAddress, index);
                    this.mates.push(mateId.toNumber());
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);

            this.list.empty();

            for (const mateId of this.mates) {
                new EMateItem(this, mateId, mateNames[mateId]).appendTo(this.list);
            }

        } else {
            this.list.empty();
        }
    }

    public changeMix(mix: BigNumber) {
        this.totalMix = this.totalMix.add(mix);
        this.totalMixDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(this.totalMix), 5));
    }
}
