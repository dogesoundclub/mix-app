import { View, ViewParams } from "skydapp-common";
export default class Stage implements View {
    private stakingMates;
    private stakingEmates;
    private stakingBmcss;
    private unstakingMates;
    private unstakingEmates;
    private unstakingBmcss;
    private container;
    private onStageMates;
    private offStageMates;
    constructor();
    changeParams(params: ViewParams, uri: string): void;
    private load;
    close(): void;
}
//# sourceMappingURL=Stage.d.ts.map