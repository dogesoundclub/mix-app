import { DomNode, el } from "skydapp-browser";
import { utils } from "ethers";
import superagent from "superagent";
import CommonUtil from "../../CommonUtil";
import Config from "../../Config";
import MixContract from "../../contracts/mix/MixContract";
import MixEmitterContract from "../../contracts/mix/MixEmitterContract";
import TurntableKIP7ListenersContractV2 from "../../contracts/turntable/TurntableKIP7ListenersContractV2";
import Wallet from "../../klaytn/Wallet";
import Prompt from "../shared/dialogue/Prompt";
import ViewUtil from "../../view/ViewUtil";

export default class LPTokenListenersV2 extends DomNode {

    constructor(
        name: string,
        private contract: TurntableKIP7ListenersContractV2,
        private turntableId: number,
        private poolId: number,
    ) {
        super(".lp-token-listeners");
        this.append(
            el("h4", name),
        );
        this.load();
    }

    private async load() {

        const poolInfo = await MixEmitterContract.poolInfo(this.poolId);
        const tokenPerBlock = poolInfo.allocPoint / 10000 / 2 * 0.7;

        const lpTotalSupply = await this.contract.lpToken.getTotalSupply();
        const totalShares = await this.contract.totalShares();

        const blocksPerYear = 365 * 24 * 60 * 60;

        try {
            const result = await superagent.get("https://api.dogesound.club/mix/price");
            const mixPrice = utils.parseEther(result.text);

            const totalMixInLP = await MixContract.balanceOf(this.contract.lpToken.address);
            const stakingTokenPrice = totalMixInLP.mul(mixPrice).mul(2).div(lpTotalSupply);

            const totalRewardPricePerYear = mixPrice.mul(Math.round((tokenPerBlock) * blocksPerYear));
            const totalStakingTokenInPool = totalShares.mul(stakingTokenPrice).div(utils.parseEther("1"));

            const apr = totalStakingTokenInPool.eq(0) === true ? 0 : totalRewardPricePerYear.mul(10000).div(totalStakingTokenInPool).toNumber() / 100;

            this.append(
                el(".lp-container",
                    el("p", `??? LP: ${CommonUtil.numberWithCommas(utils.formatEther(totalShares))}`),
                    el("hr"),
                    el("p", `?????? APR: +${apr}%`),
                ),
            );
        } catch (e) {
            console.error(e);
            this.append(
                el(".lp-container",
                    el("p", `??? LP: ${CommonUtil.numberWithCommas(utils.formatEther(totalShares))}`),
                    el("hr"),
                    el("p", "?????? APR: ?????? ????????? ??????????????? ??????????????????."),
                ),
            );
        }

        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {
            const share = await this.contract.shares(this.turntableId, walletAddress);
            const lpBalance = await this.contract.lpToken.balanceOf(walletAddress);

            const mixReward = await this.contract.claimableOf(this.turntableId, walletAddress, Config.contracts.Mix);
            const kspReward = await this.contract.claimableOf(this.turntableId, walletAddress, Config.contracts.KSP);
            const punkReward = await this.contract.claimableOf(this.turntableId, walletAddress, Config.contracts.NewKlayPunk);

            this.append(
                el(".my-container",
                    el("p", `?????? ?????? LP: ${CommonUtil.numberWithCommas(utils.formatEther(share))}`),
                    el("hr"),
                    el("p", `?????? ?????? LP: ${CommonUtil.numberWithCommas(utils.formatEther(lpBalance))}`),
                ),

                el(".interest-container",
                    el("p", `?????? MIX: ${CommonUtil.numberWithCommas(utils.formatEther(mixReward))}`),
                    el("hr"),
                    el("p", `?????? KSP: ${CommonUtil.numberWithCommas(utils.formatEther(kspReward))}`),
                    el("hr"),
                    el("p", `?????? PUNK: ${CommonUtil.numberWithCommas(utils.formatEther(punkReward))}`),
                ),

                el("a", "?????? ?????? ?????????", {
                    click: async () => {
                        await this.contract.unlisten(this.turntableId, 0);
                        ViewUtil.waitTransactionAndRefresh();
                    },
                }),

                el("a", "LP ?????? ????????? ??????", {
                    click: () => {
                        new Prompt("LP ?????? ????????? ??????", "??????????????? LP ????????? ?????????????????????????", "????????????", async (amount) => {
                            const lp = utils.parseEther(amount);
                            await this.contract.listen(this.turntableId, lp);
                            ViewUtil.waitTransactionAndRefresh();
                        });
                    },
                }),
                el("a", "LP ?????? ????????? ?????? ??????", {
                    click: () => {
                        new Prompt("LP ?????? ????????? ??????", "??????????????? LP ????????? ?????? ?????????????????????????", "?????? ??????", async (amount) => {
                            const lp = utils.parseEther(amount);
                            await this.contract.unlisten(this.turntableId, lp);
                            ViewUtil.waitTransactionAndRefresh();
                        });
                    },
                }),

                el("a", "MIX ??????", {
                    click: async () => {
                        await this.contract.claim(this.turntableId, Config.contracts.Mix);
                        ViewUtil.waitTransactionAndRefresh();
                    },
                }),

                el("a", "KSP ??????", {
                    click: async () => {
                        await this.contract.claim(this.turntableId, Config.contracts.KSP);
                        ViewUtil.waitTransactionAndRefresh();
                    },
                }),

                el("a", "PUNK ??????", {
                    click: async () => {
                        await this.contract.claim(this.turntableId, Config.contracts.NewKlayPunk);
                        ViewUtil.waitTransactionAndRefresh();
                    },
                }),
            );
        }
    }
}
