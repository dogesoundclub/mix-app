import Config from "../../Config";
import Contract from "../Contract";

class MixStakingContract extends Contract {

    constructor() {
        super(Config.contracts.MixStaking, require("./MixStakingContractABI.json"));
    }
}

export default new MixStakingContract();
