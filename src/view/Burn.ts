import { DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";
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
        Layout.current.title = "MIX 소각";
        Layout.current.content.append(
            this.container = el(".burn-view",
                el("section",
                    el("img", { src: "/images/shared/logo/mix.svg" }),
                    el("h1", "믹스 소각"),
                    el("p", "MIX가 소각될 때 마다 소각량의 0.3%가 부스에 대한 지분에 따라 분배됩니다."),
                    this.burnInput = el("input", { placeholder: "소각할 액수를 넣어주세요" }),
                    el("button", "소각하기", {
                        click: async () => {
                            await MixContract.burn(utils.parseEther(this.burnInput.domElement.value));
                            ViewUtil.waitTransactionAndRefresh();
                        },
                    }),
                    el(".mix-container",
                        this.balanceDisplay = el("span", new Loading()),
                        el("button.max-btn", "최대 수량", {
                            click: async () => {
                                const walletAddress = await Wallet.loadAddress();
                                if (walletAddress !== undefined) {
                                    const balance = await MixContract.balanceOf(walletAddress);
                                    this.burnInput.domElement.value = utils.formatEther(balance);
                                }
                            },
                        })
                    ),
                    el("p.warning", "예치 시에는 2번의 트랜잭션이 발생합니다. 한번은 토큰 사용 허락을 위한 것이며,\n다른 하나는 실제 예치를 위한 것입니다."),
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