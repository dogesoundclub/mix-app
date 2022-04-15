import { DomNode, el, msg } from "skydapp-browser";
import { BigNumber, constants, utils } from "ethers";
import CommonUtil from "../../../CommonUtil";
import MixContract from "../../../contracts/mix/MixContract";
import KLITSPoolContract from "../../../contracts/mix/KLITSPoolContract";
import KLITSContract from "../../../contracts/nft/KLITSContract";
import Wallet from "../../../klaytn/Wallet";
import KlubsLoader from "../../../KlubsLoader";
import Confirm from "../../shared/dialogue/Confirm";
import KLITSTab from "./KLITSTab";

export default class KLITSItem extends DomNode {

    private klits: DomNode<HTMLImageElement>;
    private mixAmount: DomNode;
    private claimable: BigNumber = BigNumber.from(0);
    private refreshInterval: any;

    constructor(private tab: KLITSTab, private id: number) {
        super(".klits-item");
        this.append(
            el(".content",
                this.klits = el("img", { alt: `klits-${id}` }),
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
                                    if ((await MixContract.allowance(owner, KLITSPoolContract.address)).lt(fee)) {
                                        await MixContract.approve(KLITSPoolContract.address, constants.MaxUint256);
                                        setTimeout(async () => {
                                            await KLITSPoolContract.claim([this.id]);
                                        }, 2000);
                                    } else {
                                        await KLITSPoolContract.claim([this.id]);
                                    }
                                }
                            }
                        },
                    }),
                ),
            ),
        );
        this.loadImage();
        this.load();
        this.refreshInterval = setInterval(() => this.load(), 1000);
    }

    private async loadImage() {
        const metadata = await KlubsLoader.loadMetadata(KLITSContract.address, this.id);
        this.klits.domElement.src = `${metadata.image}`;
    }

    private async load() {
        const claimable = await KLITSPoolContract.claimableOf(this.id);
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
