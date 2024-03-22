import { ethers, BigNumber } from "ethers";

class Klaytn {
    // Klaytn RPC 서버의 URL을 변수로 저장합니다.
    private rpcUrl = "https://klaytn-pokt.nodies.app";
    // private rpcUrl = "https://public-en-cypress.klaytn.net";
    
    // private provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    private provider = new ethers.providers.JsonRpcProvider('/api');
    
    constructor() {
        // 네트워크 연결 상태를 확인합니다.
        this.checkNetworkConnection();
    }

    private async checkNetworkConnection() {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            console.log(`Successfully connected to Klaytn network. Current block number: ${blockNumber}`);
        } catch (error) {
            console.error(`Failed to connect to Klaytn network at ${this.rpcUrl}. Error:`, error);
        }
    }

    public createContract(address: string, abi: any) {
        // 컨트랙트 생성 전에 provider가 정상적으로 설정되었는지 확인합니다.
        if (!this.provider) {
            console.error("Ethers provider is not initialized.");
            return undefined;
        }

        // 컨트랙트 생성을 시도하고 결과를 로그로 남깁니다.
        try {
            const contract = new ethers.Contract(address, abi, this.provider);
            console.log(`Contract initialized at address: ${address}`);
            return contract;
        } catch (error) {
            console.error(`Failed to create contract at ${address}. Error:`, error);
            return undefined;
        }
    }

    public async balanceOf(address: string): Promise<BigNumber> {
        try {
            const balance = await this.provider.getBalance(address);
            console.log(`Balance of address ${address}:`, balance.toString());
            return BigNumber.from(balance.toString());
        } catch (error) {
            console.error(`Failed to get balance of address ${address}. Error:`, error);
            return BigNumber.from(0);
        }
    }

    public async loadBlockNumber(): Promise<number> {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            console.log(`Current block number: ${blockNumber}`);
            return blockNumber;
        } catch (error) {
            console.error("Failed to load the current block number. Error:", error);
            return 0;
        }
    }
}

export default new Klaytn();
