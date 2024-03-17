import { ethers, BigNumber } from "ethers";

class Klaytn {

    private provider = new ethers.providers.JsonRpcProvider("https://public-en-cypress.klaytn.net");

    public createContract(address: string, abi: any) {
        return new ethers.Contract(address, abi, this.provider);
    }

    public async balanceOf(address: string): Promise<BigNumber> {
        const balance = await this.provider.getBalance(address);
        return BigNumber.from(balance.toString());
    }

    public async loadBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }
}

export default new Klaytn();
