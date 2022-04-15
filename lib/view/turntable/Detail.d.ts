import { View, ViewParams } from "skyrouter";
export default class Detail implements View {
    private container;
    private title;
    private socailDisplay;
    private infoDisplay;
    private imgDisplay;
    private controller;
    private controller2;
    private mateRewardInfo;
    private listeningMateList;
    constructor(params: ViewParams);
    private loadInfo;
    private loadListeningMates;
    changeParams(params: ViewParams, uri: string): void;
    close(): void;
}
//# sourceMappingURL=Detail.d.ts.map