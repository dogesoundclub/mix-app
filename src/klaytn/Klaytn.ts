import { ethers } from "ethers";

class Klaytn {

    private provider = new ethers.JsonRpcProvider("https://public-en-cypress.klaytn.net");

    public createContract(address: string, abi: any) {
        return new ethers.Contract(address, abi, this.provider);
    }

    public async balanceOf(address: string): Promise<BigInt> {
        const balance = await this.provider.getBalance(address);
        // Converts the returned BigNumber to a string, then to a BigInt
        return BigInt(balance.toString());
    }

    public async loadBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }
}

export default new Klaytn();
