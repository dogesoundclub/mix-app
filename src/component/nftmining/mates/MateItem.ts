import { DomNode, el, msg } from "skydapp-browser";
import { BigNumber, constants, utils } from "ethers";
import CommonUtil from "../../../CommonUtil";
import MatesPoolContract from "../../../contracts/mix/MatesPoolContract";
import MixContract from "../../../contracts/mix/MixContract";
import Wallet from "../../../klaytn/Wallet";
import Confirm from "../../shared/dialogue/Confirm";
import MatesTab from "./MatesTab";

export default class MateItem extends DomNode {

    private mixAmount: DomNode;
    private claimable: BigNumber = BigNumber.from(0);
    private refreshInterval: any;

    constructor(private tab: MatesTab, private id: number, name: string | undefined) {
        super(".mate-item");
        this.append(
            el(".content",
                el("img", { src: `https://storage.googleapis.com/dsc-mate/336/dscMate-${id}.png`, alt: `mate-${id}` }),
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
                                    if ((await MixContract.allowance(owner, MatesPoolContract.address)).lt(fee)) {
                                        await MixContract.approve(MatesPoolContract.address, constants.MaxUint256);
                                        setTimeout(async () => {
                                            await MatesPoolContract.claim([this.id]);
                                        }, 2000);
                                    } else {
                                        await MatesPoolContract.claim([this.id]);
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
        const claimable = await MatesPoolContract.claimableOf(this.id);
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
