import { BigNumber, utils } from "ethers";
import SkyUtil from "skyutil";
import BoothContract from "./contracts/mix/BoothContract";
import MixContract from "./contracts/mix/MixContract";
import MixEmitterContract from "./contracts/mix/MixEmitterContract";
import pools from "./pools.json";
import Utils from "./Utils";

export interface TotalAssets {

    mix: string,
    mixset: string,
    devfunds: string,
    klaylp: string,
    ksplp: string,

    turntableVolume: number,
    mates: number,
    cases: number,
    apunks: number,
    pixelcats: number,
    klits: number,
    cryptorus: number,
}

class AssetsCalculator {

    private mixsetToMix = 1;
    private poolInfo: {
        [address: string]: number
    } = {};

    public async init() {

        const totalMix = await MixContract.balanceOf(BoothContract.address);
        const totalMixset = await BoothContract.getTotalSupply();
        const mixsetToMix = utils.formatEther(totalMix.mul(BigNumber.from("1000000000000000000")).div(totalMixset));
        this.mixsetToMix = parseFloat(mixsetToMix);

        const poolCount = (await MixEmitterContract.poolCount()).toNumber();
        await SkyUtil.repeatResultAsync(poolCount, async (pid) => {
            const poolInfo = await MixEmitterContract.poolInfo(pid);
            this.poolInfo[poolInfo.to] = poolInfo.allocPoint;
        });
    }

    public calculatePercent(total: TotalAssets | undefined, assets: TotalAssets | undefined): number {
        let percent = 0;
        if (total !== undefined && assets !== undefined) {

            const totalMixPercent = (
                parseFloat(utils.formatEther(total.mix)) +
                parseFloat(utils.formatEther(total.mixset)) * this.mixsetToMix
            );
            const mixPercent = totalMixPercent === 0 ? 0 : (
                parseFloat(utils.formatEther(assets.mix)) +
                parseFloat(utils.formatEther(assets.mixset)) * this.mixsetToMix
            ) / totalMixPercent;
            percent += mixPercent / 2;

            let poolPercent = 0;
            let totalPoolPercent = 0;

            for (const [address, percent] of Object.entries(this.poolInfo)) {
                const pool = (pools as any)[address];
                if (pool !== undefined) {
                    if (pool.name === "Dev Fund") {
                        if (total.devfunds !== "0") {
                            poolPercent += parseFloat(utils.formatEther(assets.devfunds)) / parseFloat(utils.formatEther(total.devfunds)) * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Mates") {
                        if (total.mates !== 0) {
                            poolPercent += assets.mates / total.mates * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Klay-MIX LP") {
                        if (total.klaylp !== "0") {
                            poolPercent += parseFloat(utils.formatEther(assets.klaylp)) / parseFloat(utils.formatEther(total.klaylp)) * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "KSP-MIX LP") {
                        if (total.ksplp !== "0") {
                            poolPercent += parseFloat(utils.formatEther(assets.ksplp)) / parseFloat(utils.formatEther(total.ksplp)) * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Cases by Kate") {
                        if (total.cases !== 0) {
                            poolPercent += assets.cases / total.cases * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Animals Punks V2") {
                        if (total.apunks !== 0) {
                            poolPercent += assets.apunks / total.apunks * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Turntables") {
                        if (total.turntableVolume !== 0) {
                            poolPercent += assets.turntableVolume / total.turntableVolume * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Pixel Cat") {
                        if (total.pixelcats !== 0) {
                            poolPercent += assets.pixelcats / total.pixelcats * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "KLITS") {
                        if (Utils.undefinedToZero(total.klits) !== 0) {
                            poolPercent += Utils.undefinedToZero(assets.klits) / Utils.undefinedToZero(total.klits) * percent;
                            totalPoolPercent += percent;
                        }
                    } else if (pool.name === "Cryptorus") {
                        if (Utils.undefinedToZero(total.cryptorus) !== 0) {
                            poolPercent += Utils.undefinedToZero(assets.cryptorus) / Utils.undefinedToZero(total.cryptorus) * percent;
                            totalPoolPercent += percent;
                        }
                    }
                }
            }

            percent += poolPercent / totalPoolPercent / 2;
        }
        return percent * 100;
    }
}

export default new AssetsCalculator();
