import { BigNumber } from "@ethersproject/bignumber";
import { View, ViewParams } from "skydapp-common";
export default class MiningMates implements View {
    private container;
    private mates;
    private totalMix;
    private totalMixDisplay;
    private list;
    constructor(params: ViewParams);
    private load;
    changeMix(mix: BigNumber): void;
    changeParams(params: ViewParams, uri: string): void;
    close(): void;
}
//# sourceMappingURL=MiningMates.d.ts.map