import { BigNumber, BigNumberish } from "ethers";
import Config from "../../Config";
import Contract from "../Contract";

class MixStakingContract extends Contract {

    constructor() {
        super(Config.contracts.MixStaking, require("./MixStakingContractABI.json"));
    }

    public async stakingBlocks(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("stakingBlocks", nft, id));
    }
}

export default new MixStakingContract();
