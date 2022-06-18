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
    private stageUpCount;
    private stageDownCount;
    private stageUpButton;
    private stageDownButton;
    private mixNeedsDisplay;
    private returnMixTimeDisplay;
    private selectedStakings;
    private selectedUnstakings;
    constructor();
    changeParams(params: ViewParams, uri: string): void;
    selectStaking(address: string, id: number): void;
    deselectStaking(address: string, id: number): void;
    selectUnstaking(address: string, id: number): void;
    deselectUnstaking(address: string, id: number): void;
    private loadInfos;
    private loadClubmates;
    close(): void;
}
//# sourceMappingURL=Stage.d.ts.map