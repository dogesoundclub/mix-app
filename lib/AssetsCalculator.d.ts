export interface TotalAssets {
    mix: string;
    mixset: string;
    devfunds: string;
    klaylp: string;
    ksplp: string;
    turntableVolume: number;
    mates: number;
    cases: number;
    apunks: number;
    pixelcats: number;
    klits: number;
    cryptorus: number;
}
declare class AssetsCalculator {
    private mixsetToMix;
    private poolInfo;
    init(): Promise<void>;
    calculatePercent(total: TotalAssets | undefined, assets: TotalAssets | undefined): number;
}
declare const _default: AssetsCalculator;
export default _default;
//# sourceMappingURL=AssetsCalculator.d.ts.map