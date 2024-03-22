import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";
import { EventContainer } from "skydapp-common";
import Config from "../Config";
import ExtWallet from "../klaytn/ExtWallet";
import Klaytn from "../klaytn/Klaytn";
import Klip from "../klaytn/Klip";
import Wallet from "../klaytn/Wallet";
import ConnectWalletPopup from "../component/shared/ConnectWalletPopup";

export default abstract class Contract extends EventContainer {

    private walletContract: any | undefined;
    protected contract: any;

    constructor(public address: string, private abi: any) {
        super();
        // 컨트랙트 객체 생성 시 로깅을 추가합니다.
        this.contract = Klaytn.createContract(address, abi);
        console.log(`Contract created with address: ${address}`, this.contract);
        if (!this.contract) {
            console.error("Contract creation failed.");
        }
    }

    private findMethodABI(name: string) {
        return this.abi.filter((abi: any) => abi.name === name && abi.type === "function")[0];
    }

    public async loadExtWalletContract() {
        if (await ExtWallet.loadChainId() !== Config.chainId) {
            this.fireEvent("wrongNetwork");
            console.error("Wrong Network");
        } else {
            if (await ExtWallet.connected() !== true) {
                await ExtWallet.connect();
            }
            if (this.walletContract === undefined) {
                this.walletContract = ExtWallet.createContract(this.address, this.abi);
                console.log(`ExtWallet Contract created with address: ${this.address}`, this.walletContract);
            }
            return this.walletContract;
        }
    }

    protected async runMethod(methodName: string, ...params: any[]) {
        console.log(`Calling contract method: ${methodName}`, params);
        try {
            // ethers.js의 컨트랙트 메소드 호출 방식으로 변경
            const method = this.contract[methodName];
            if (method === undefined) {
                console.error(`Method ${methodName} not found in contract`);
                return;
            }
            const result = await method(...params);
            console.log(`Method call result: ${methodName}`, result);
            return result;
        } catch (error) {
            console.error(`Error calling contract method: ${methodName}`, error);
            throw error;
        }
    }
    

    private async runWalletMethodWithGas(methodName: string, gas: number, ...params: any[]) {
        if (ExtWallet.installed === true) {
            const from = await Wallet.loadAddress();
            const contract = await this.loadExtWalletContract();
            await contract?.methods[methodName](...params).send({ from, gas });
        } else if (Klip.connected === true) {
            await Klip.runContractMethod(this.address, this.findMethodABI(methodName), params);
        } else {
            return new Promise<void>((resolve) => new ConnectWalletPopup(resolve));
        }
    }

    protected async runWalletMethod(methodName: string, ...params: any[]) {
        return this.runWalletMethodWithGas(methodName, 1500000, ...params);
    }

    protected async runWalletMethodWithLargeGas(methodName: string, ...params: any[]) {
        return this.runWalletMethodWithGas(methodName, 20000000, ...params);
    }

    protected async runWalletMethodWithValue(value: BigNumber, methodName: string, ...params: any[]) {
        if (ExtWallet.installed === true) {
            const from = await Wallet.loadAddress();
            const contract = await this.loadExtWalletContract();
            await contract?.methods[methodName](...params).send({ from, gas: 1500000, value });
        } else if (Klip.connected === true) {
            await Klip.runContractMethod(this.address, this.findMethodABI(methodName), params, utils.formatEther(value));
        } else {
            return new Promise<void>((resolve) => new ConnectWalletPopup(resolve));
        }
    }
}
