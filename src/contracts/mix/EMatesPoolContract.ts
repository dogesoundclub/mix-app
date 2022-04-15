import Config from "../../Config";
import KIP17DividendContract from "./KIP17DividendContract";

class EMatesPoolContract extends KIP17DividendContract {

    constructor() {
        super(Config.contracts.EMatesPool, require("./MatesPoolContractABI.json"));
    }
}

export default new EMatesPoolContract();
