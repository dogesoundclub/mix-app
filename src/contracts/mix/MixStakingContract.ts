import { BigNumber, BigNumberish, constants } from "ethers";
import Config from "../../Config";
import Wallet from "../../klaytn/Wallet";
import Contract from "../Contract";
import MixContract from "./MixContract";

class MixStakingContract extends Contract {

    constructor() {
        super(Config.contracts.MixStaking, require("./MixStakingContractABI.json"));
    }

    public async mixNeeds(): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("mixNeeds"));
    }

    public async stakingBlocks(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("stakingBlocks", nft, id));
    }

    public async returnMixTimes(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("returnMixTimes", nft, id));
    }

    public async stakingMix(nfts: string[], ids: BigNumberish[]) {
        const owner = await Wallet.loadAddress();
        if (owner !== undefined) {
            const mixNeeds = (await this.mixNeeds()).mul(nfts.length);
            if ((await MixContract.allowance(owner, this.address)).lt(mixNeeds)) {
                await MixContract.approve(this.address, constants.MaxUint256);
                await new Promise<void>((resolve) => {
                    setTimeout(async () => {
                        await this.runWalletMethod("stakingMix", nfts, ids);
                        resolve();
                    }, 2000);
                });
            } else {
                await this.runWalletMethod("stakingMix", nfts, ids);
            }
        }
    }

    public async withdrawMix(nfts: string[], ids: BigNumberish[]) {
        await this.runWalletMethod("withdrawMix", nfts, ids);
    }
}

export default new MixStakingContract();
