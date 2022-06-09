import { BigNumber, BigNumberish } from "ethers";
import Contract from "../Contract";
declare class MixStakingContract extends Contract {
    constructor();
    stakingBlocks(nft: string, id: BigNumberish): Promise<BigNumber>;
}
declare const _default: MixStakingContract;
export default _default;
//# sourceMappingURL=MixStakingContract.d.ts.map