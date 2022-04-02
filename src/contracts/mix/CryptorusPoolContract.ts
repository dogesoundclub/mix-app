import Config from "../../Config";
import KIP17DividendContract from "./KIP17DividendContract";

class CryptorusPoolContract extends KIP17DividendContract {

    constructor() {
        super(Config.contracts.CryptorusPool);
    }
}

export default new CryptorusPoolContract();
