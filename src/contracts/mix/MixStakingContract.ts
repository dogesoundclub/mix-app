import { BigNumber, BigNumberish, constants, utils } from "ethers";
import Config from "../../Config";
import Wallet from "../../klaytn/Wallet";
import Contract from "../Contract";
import MixContract from "./MixContract";

class MixStakingContract extends Contract {

    constructor() {
        // Config 파일과 ABI를 검증합니다. (스마트 컨트랙트 ABI와 주소 검증)
        console.log("Initializing MixStakingContract with address:", Config.contracts.MixStaking);
        super(Config.contracts.MixStaking, require("./MixStakingContractABI.json"));
    }

    public async mixNeeds(): Promise<BigNumber> {
        // 비동기 호출 결과를 로그로 남깁니다. (디버깅 로그 추가)
        const result = await this.runMethod("mixNeeds");
        console.log("mixNeeds result:", result);
        return BigNumber.from(result);
    }

    public async returnMixTime(): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("returnMixTime"));
    }

    public async stakingBlocks(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("stakingBlocks", nft, id));
    }

    public async returnMixTimes(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("returnMixTimes", nft, id));
    }

    public async stakingMix(nfts: string[], ids: BigNumberish[]) {
        const owner = await Wallet.loadAddress();
        // 주소가 로드되지 않았을 경우의 처리를 추가합니다. (초기화 검사 추가)
        if (!owner) {
            console.error("Wallet address is not loaded.");
            return;
        }

        try {
            const mixNeeds = (await this.mixNeeds()).mul(nfts.length);
            const balance = await MixContract.balanceOf(owner);
            if (balance.lt(mixNeeds)) {
                if (confirm(`${String(parseInt(utils.formatEther(mixNeeds), 10))} 믹스가 필요합니다. 믹스를 구매하시겠습니까?`)) {
                    open("https://klayswap.com/exchange/swap?input=0x0000000000000000000000000000000000000000&output=0xdd483a970a7a7fef2b223c3510fac852799a88bf");
                    await new Promise<void>(() => { /* 대기 로직 */ });
                }
            } else if ((await MixContract.allowance(owner, this.address)).lt(mixNeeds)) {
                await MixContract.approve(this.address, constants.MaxUint256);
                await new Promise<void>((resolve) => {
                    setTimeout(async () => {
                        await this.runWalletMethod("stakingMix", nfts, ids);
                        resolve();
                    }, 2000);
                });
            } else {
                await this.runWalletMethod("stakingMix", nfts, ids);
            }
        } catch (error) {
            // 비동기 호출 중 발생한 에러를 처리합니다. (비동기 처리 확인)
            console.error("Error in stakingMix:", error);
        }
    }

    public async withdrawMix(nfts: string[], ids: BigNumberish[]) {
        await this.runWalletMethod("withdrawMix", nfts, ids);
    }

    public async stakingAmounts(nft: string, id: BigNumberish): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("stakingAmounts", nft, id));
    }
}

export default new MixStakingContract();
