import { BigNumber, BigNumberish } from "ethers";
import Contract from "../Contract";
declare class MixStakingContract extends Contract {
    constructor();
    mixNeeds(): Promise<BigNumber>;
    returnMixTime(): Promise<BigNumber>;
    stakingBlocks(nft: string, id: BigNumberish): Promise<BigNumber>;
    returnMixTimes(nft: string, id: BigNumberish): Promise<BigNumber>;
    stakingMix(nfts: string[], ids: BigNumberish[]): Promise<void>;
    withdrawMix(nfts: string[], ids: BigNumberish[]): Promise<void>;
}
declare const _default: MixStakingContract;
export default _default;
//# sourceMappingURL=MixStakingContract.d.ts.map