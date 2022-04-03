import { DomNode, el } from "@hanul/skynode";
import { BigNumber, constants, utils } from "ethers";
import CommonUtil from "../../../CommonUtil";
import MixContract from "../../../contracts/mix/MixContract";
import CryptorusPoolContract from "../../../contracts/mix/CryptorusPoolContract";
import CryptorusContract from "../../../contracts/nft/CryptorusContract";
import Wallet from "../../../klaytn/Wallet";
import KlubsLoader from "../../../KlubsLoader";
import Confirm from "../../shared/dialogue/Confirm";
import CryptorusTab from "./CryptorusTab";

export default class CryptorusItem extends DomNode {

    private cryptorus: DomNode<HTMLImageElement>;
    private mixAmount: DomNode;
    private claimable: BigNumber = BigNumber.from(0);
    private refreshInterval: any;

    constructor(private tab: CryptorusTab, private id: number) {
        super(".cryptorus-item");
        this.append(
            el(".content",
                this.cryptorus = el("img", { alt: `cryptorus-${id}` }),
                el(".info",
                    el("h5", "쌓인 MIX"),
                    this.mixAmount = el(".amount", "Loading..."),
                ),
                el(".controller",
                    el("button.claim-button", "받기", {
                        click: async () => {
                            if (await Wallet.connected() !== true) {
                                await Wallet.connect();
                            }
                            const owner = await Wallet.loadAddress();
                            if (owner !== undefined) {
                                const balance = await MixContract.balanceOf(owner);
                                const fee = this.claimable.div(9);
                                if (balance.lt(fee)) {
                                    new Confirm("믹스 구매", "NFT로부터 MIX를 수령받기 위해서는 수령받을 MIX의 10%의 MIX를 선납해야 합니다.", "구매", () => {
                                        open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                                    });
                                } else {
                                    if ((await MixContract.allowance(owner, CryptorusPoolContract.address)).lt(fee)) {
                                        await MixContract.approve(CryptorusPoolContract.address, constants.MaxUint256);
                                        setTimeout(async () => {
                                            await CryptorusPoolContract.claim([this.id]);
                                        }, 2000);
                                    } else {
                                        await CryptorusPoolContract.claim([this.id]);
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
        const metadata = await KlubsLoader.loadMetadata(CryptorusContract.address, this.id);
        this.cryptorus.domElement.src = `${metadata.image}`;
    }

    private async load() {
        const claimable = await CryptorusPoolContract.claimableOf(this.id);
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
