import { BigNumberish } from "@ethersproject/bignumber";
import { constants } from "ethers";
import Config from "../../Config";
import Wallet from "../../klaytn/Wallet";
import KIP7Contract from "../standard/KIP7Contract";

class MixContract extends KIP7Contract {

    constructor() {
        super(Config.contracts.Mix, require("./MixContractABI.json"));
    }

    public async burn(amount: BigNumberish) {
        const owner = await Wallet.loadAddress();
        if (owner !== undefined) {
            if ((await this.allowance(owner, this.address)).lt(amount)) {
                await this.approve(this.address, constants.MaxUint256);
                await new Promise<void>((resolve) => {
                    setTimeout(async () => {
                        await this.runWalletMethod("burn", amount);
                        resolve();
                    }, 2000);
                });
            } else {
                await this.runWalletMethod("burn", amount);
            }
        }
    }
}

export default new MixContract();
