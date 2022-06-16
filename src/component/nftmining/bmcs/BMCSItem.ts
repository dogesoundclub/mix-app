import { DomNode, el, msg } from "skydapp-browser";
import { BigNumber, constants, utils } from "ethers";
import CommonUtil from "../../../CommonUtil";
import BiasPoolContract from "../../../contracts/mix/BiasPoolContract";
import MixContract from "../../../contracts/mix/MixContract";
import Wallet from "../../../klaytn/Wallet";
import Confirm from "../../shared/dialogue/Confirm";
import BMCSTab from "./BMCSTab";
import BiasContract from "../../../contracts/nft/BiasContract";

export default class BMCSItem extends DomNode {

    private mixAmount: DomNode;
    private claimable: BigNumber = BigNumber.from(0);
    private image: DomNode<HTMLImageElement>;
    private refreshInterval: any;

    constructor(private tab: BMCSTab, private id: number, name: string | undefined) {
        super(".mate-item");
        this.append(
            el(".content",
                this.image = el("img", { alt: `bias-${id}` }),
                el(".info",
                    el("h5", msg("MINING_ITEM_TITLE")),
                    this.mixAmount = el(".amount", "Loading..."),
                ),
                el(".controller",
                    el("button.claim-button", msg("MINING_ITEM_BUTTON"), {
                        click: async () => {
                            if (await Wallet.connected() !== true) {
                                await Wallet.connect();
                            }
                            const owner = await Wallet.loadAddress();
                            if (owner !== undefined) {
                                const balance = await MixContract.balanceOf(owner);
                                const fee = this.claimable.div(9);
                                if (balance.lt(fee)) {
                                    new Confirm(msg("MINING_TAB_CONFIRM_TITLE1"), msg("MINING_TAB_CONFIRM_DESC1"), msg("MINING_TAB_CONFIRM_BUTTON1"), () => {
                                        open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                                    });
                                } else {
                                    if ((await MixContract.allowance(owner, BiasPoolContract.address)).lt(fee)) {
                                        await MixContract.approve(BiasPoolContract.address, constants.MaxUint256);
                                        setTimeout(async () => {
                                            await BiasPoolContract.claim([this.id]);
                                        }, 2000);
                                    } else {
                                        await BiasPoolContract.claim([this.id]);
                                    }
                                }
                            }
                        },
                    }),
                ),
            ),
        );
        this.load();
        this.refreshInterval = setInterval(() => this.load(), 1000);
    }

    private async load() {
        const metadata = await (await fetch(`https://api.dogesound.club/bmcs/${this.id}`)).json();
        this.image.domElement.src = metadata.image;

        const claimable = await BiasPoolContract.claimableOf(this.id);
        if (this.deleted !== true) {
            this.mixAmount.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(claimable), 5));
            this.tab.changeMix(claimable.sub(this.claimable));
            this.claimable = claimable;
        }
    }

    public delete() {
        clearInterval(this.refreshInterval);
        super.delete();
    }
}
