import { BigNumber } from "@ethersproject/bignumber";
import { DomNode, el, msg } from "skydapp-browser";
import { constants, utils } from "ethers";
import CommonUtil from "../../../CommonUtil";
import CasesByKatePoolContract from "../../../contracts/mix/CasesByKatePoolContract";
import MixContract from "../../../contracts/mix/MixContract";
import CasesByKateContract from "../../../contracts/nft/CasesByKateContract";
import Wallet from "../../../klaytn/Wallet";
import Confirm from "../../shared/dialogue/Confirm";
import Loading from "../../shared/loading/Loading";
import CaseItem from "./CaseItem";

export default class CasesByKateTab extends DomNode {

    private cases: number[] = [];
    private totalMix: BigNumber = BigNumber.from(0);
    private totalMixDisplay: DomNode;

    private list: DomNode;

    constructor() {
        super(".cases-by-kate-tab");
        this.append(
            el("header",
                el(".total-mix",
                    el("h4", msg("MINING_TAB_TITLE")),
                    this.totalMixDisplay = el("span", "Loading..."),
                ),
                el("button.take-all-button", msg("MINING_TAB_BUTTON"), {
                    click: async () => {
                        if (await Wallet.connected() !== true) {
                            await Wallet.connect();
                        }
                        const owner = await Wallet.loadAddress();
                        if (owner !== undefined) {
                            const balance = await MixContract.balanceOf(owner);
                            const fee = this.totalMix.div(9);
                            if (balance.lt(fee)) {
                                new Confirm(msg("MINING_TAB_CONFIRM_TITLE1"), msg("MINING_TAB_CONFIRM_DESC1"), msg("MINING_TAB_CONFIRM_BUTTON1"), () => {
                                    open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                                });
                            } else {
                                if ((await MixContract.allowance(owner, CasesByKatePoolContract.address)).lt(fee)) {
                                    await MixContract.approve(CasesByKatePoolContract.address, constants.MaxUint256);
                                    setTimeout(async () => {
                                        await CasesByKatePoolContract.claim(this.cases);
                                    }, 2000);
                                } else {
                                    await CasesByKatePoolContract.claim(this.cases);
                                }
                            }
                        }
                    },
                }),
            ),
            this.list = el(".case-list", new Loading()),
        );
        this.load();
    }

    private async load() {
        if (await Wallet.connected() !== true) {
            await Wallet.connect();
        }
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {

            const balance = (await CasesByKateContract.balanceOf(walletAddress)).toNumber();

            const promises: Promise<void>[] = [];
            for (let i = 0; i < balance; i += 1) {
                const promise = async (index: number) => {
                    const caseId = await CasesByKateContract.tokenOfOwnerByIndex(walletAddress, index);
                    this.cases.push(caseId.toNumber());
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);

            this.list.empty();

            for (const caseId of this.cases) {
                new CaseItem(this, caseId).appendTo(this.list);
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
