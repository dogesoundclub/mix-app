import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import { utils } from "ethers";
import MixContract from "../contracts/mix/MixContract";
import Loading from "../component/shared/loading/Loading";
import Wallet from "../klaytn/Wallet";
import CommonUtil from "../CommonUtil";
import ViewUtil from "./ViewUtil";
import Layout from "./Layout";

export default class Burn implements View {

    private container: DomNode;
    private balanceDisplay: DomNode;
    private burnInput: DomNode<HTMLInputElement>;

    constructor() {
        Layout.current.title = msg("BURN_TITLE");
        Layout.current.content.append(
            this.container = el(".burn-view",
                el("section",
                    el("img", { src: "/images/shared/logo/mix.svg" }),
                    el("h1", msg("BURN_TITLE")),
                    el("p", msg("BURN_DESC1")),
                    this.burnInput = el("input", { placeholder: msg("BURN_INPUT1") }),
                    el("button", msg("BURN_BUTTON1"), {
                        click: async () => {
                            await MixContract.burn(utils.parseEther(this.burnInput.domElement.value));
                            ViewUtil.waitTransactionAndRefresh();
                        },
                    }),
                    el(".mix-container",
                        this.balanceDisplay = el("span", new Loading()),
                        el("button.max-btn", msg("BURN_BUTTON2"), {
                            click: async () => {
                                const walletAddress = await Wallet.loadAddress();
                                if (walletAddress !== undefined) {
                                    const balance = await MixContract.balanceOf(walletAddress);
                                    this.burnInput.domElement.value = utils.formatEther(balance);
                                }
                            },
                        })
                    ),
                    el("p.warning", msg("BURN_DESC2")),
                ),
            )
        );
        this.loadBalance();
    }

    private async loadBalance() {
        if (await Wallet.connected() !== true) {
            await Wallet.connect();
        }
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {
            const balance = await MixContract.balanceOf(walletAddress);
            this.balanceDisplay.empty().appendText(`MIX: ${CommonUtil.numberWithCommas(utils.formatEther(balance))}`);
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}