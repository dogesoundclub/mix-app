import { DomNode, el, msg } from "skydapp-browser";
import { BigNumber, utils } from "ethers";
import { View, ViewParams } from "skydapp-common";
import CommonUtil from "../CommonUtil";
import Loading from "../component/shared/loading/Loading";
import BoothContract from "../contracts/mix/BoothContract";
import MixContract from "../contracts/mix/MixContract";
import Klaytn from "../klaytn/Klaytn";
import Wallet from "../klaytn/Wallet";
import Layout from "./Layout";
import ViewUtil from "./ViewUtil";

export default class Booth implements View {

    private container: DomNode;

    private aprDisplay: DomNode;
    private priceDisplay: DomNode;
    private totalBalanceDisplay: DomNode;
    private burn24Display: DomNode;
    private reward24Display: DomNode;

    private stakeInput: DomNode<HTMLInputElement>;
    private balanceDisplay: DomNode;
    private unstakeInput: DomNode<HTMLInputElement>;
    private mixsetDisplay: DomNode;

    constructor() {
        Layout.current.title = msg("BOOTH_TITLE");
        Layout.current.content.append(
            this.container = el(".booth-view",
                el("section",
                    el("section",
                        el(".content",
                            el(".title", "1 MIXSET"),
                            this.priceDisplay = el("span", new Loading()),
                            el("span", " MIX"),
                        ),
                        el(".grid-container",
                            el(".content",
                                el(".title", msg("BOOTH_TITLE1"),),
                                this.aprDisplay = el("span.bold", new Loading()),
                                el("span", " %"),
                            ),
                            el(".content",
                                el(".title", msg("BOOTH_TITLE2")),
                                this.totalBalanceDisplay = el("span.bold", new Loading()),
                                el("span", " MIX"),
                            ),
                            el(".content",
                                el(".title", msg("BOOTH_TITLE3")),
                                this.burn24Display = el("span.bold", new Loading()),
                                el("span", " MIX"),
                            ),
                            el(".content",
                                el(".title", msg("BOOTH_TITLE4")),
                                this.reward24Display = el("span.bold", new Loading()),
                                el("span", " MIX"),
                            ),
                        ),
                    ),
                    el("hr"),
                    el("section.staking",
                        el("h2", msg("BOOTH_TITLE")),
                        el("p", msg("BOOTH_DESC1")),
                        el(".form",
                            this.stakeInput = el("input", { placeholder: msg("BOOTH_INPUT1") }),
                            el("button", msg("BOOTH_BUTTON1"), {
                                click: async () => {
                                    await BoothContract.stake(utils.parseEther(this.stakeInput.domElement.value));
                                    ViewUtil.waitTransactionAndRefresh();
                                },
                            }),
                            el(".container",
                                el(".caption",
                                    el("label", "MIX: "),
                                    this.balanceDisplay = el("span", new Loading())),
                                el("button.max-btn", msg("BOOTH_BUTTON2"), {
                                    click: async () => {
                                        const walletAddress = await Wallet.loadAddress();
                                        if (walletAddress !== undefined) {
                                            const balance = await MixContract.balanceOf(walletAddress);
                                            this.stakeInput.domElement.value = utils.formatEther(balance);
                                        }
                                    },
                                }))),
                        el(".warning", msg("BOOTH_DESC2")),
                        el("h2", msg("BOOTH_TITLE5")),
                        el(".form",
                            this.unstakeInput = el("input", { placeholder: msg("BOOTH_INPUT2") }),
                            el("button", msg("BOOTH_BUTTON3"), {
                                click: async () => {
                                    await BoothContract.unstake(utils.parseEther(this.unstakeInput.domElement.value));
                                    ViewUtil.waitTransactionAndRefresh();
                                },
                            }),
                            el(".container",
                                el(".caption",
                                    el("label", "MIXSET: "),
                                    this.mixsetDisplay = el("span", new Loading()),
                                ),
                                el("button.max-btn", msg("BOOTH_BUTTON2"), {
                                    click: async () => {
                                        const walletAddress = await Wallet.loadAddress();
                                        if (walletAddress !== undefined) {
                                            const staked = await BoothContract.balanceOf(walletAddress);
                                            this.unstakeInput.domElement.value = utils.formatEther(staked);
                                        }
                                    },
                                })
                            )
                        ),
                    ),
                )
            ),
        );
        this.loadInfo();
        this.loadBalance();
    }

    private async loadInfo() {

        const totalMix = await MixContract.balanceOf(BoothContract.address);
        const totalMixset = await BoothContract.getTotalSupply();

        if (totalMixset.eq(0)) {
            this.priceDisplay.empty().appendText("1");
        } else {
            this.priceDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(totalMix.mul(BigNumber.from("1000000000000000000")).div(totalMixset)), 5));
        }

        if (totalMix.eq(0)) {
            this.aprDisplay.empty().appendText("0");
            this.totalBalanceDisplay.empty().appendText("0");
            this.burn24Display.empty().appendText("0");
            this.reward24Display.empty().appendText("0");
        } else {
            const currentBlock = await Klaytn.loadBlockNumber();
            const transferEvents = await MixContract.getTransferEvents(BoothContract.address, currentBlock - 86400, currentBlock);
            let total24 = BigNumber.from(0);
            for (const event of transferEvents) {
                total24 = total24.add(event.returnValues[2]);
            }
            const stakeEvents = await BoothContract.getStakeEvents(currentBlock - 86400, currentBlock);
            for (const event of stakeEvents) {
                total24 = total24.sub(event.returnValues[1]);
            }
            const apr = total24.mul(3650000).div(totalMix).toNumber() / 100;

            this.aprDisplay.empty().appendText(CommonUtil.numberWithCommas(apr.toString()));
            this.totalBalanceDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(totalMix)));
            this.burn24Display.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(total24.mul(1000).div(3))));
            this.reward24Display.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(total24)));
        }
    }

    private async loadBalance() {
        if (await Wallet.connected() !== true) {
            await Wallet.connect();
        }
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {
            const balance = await MixContract.balanceOf(walletAddress);
            this.balanceDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(balance)));

            const mixset = await BoothContract.balanceOf(walletAddress);
            this.mixsetDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(mixset)));
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}