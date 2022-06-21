import { BigNumber, BigNumberish, constants, utils } from "ethers";
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

    public async returnMixTime(): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("returnMixTime"));
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
            const balance = await MixContract.balanceOf(owner);
            if (balance.lt(mixNeeds)) {
                if (confirm(`${String(parseInt(utils.formatEther(mixNeeds), 10))} 믹스가 필요합니다. 믹스를 구매하시겠습니까?`)) {
                    open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                    await new Promise<void>(() => { });
                }
            } else if ((await MixContract.allowance(owner, this.address)).lt(mixNeeds)) {
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

    public async stakingAmounts(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("stakingAmounts", nft, id));
    }
}

export default new MixStakingContract();
