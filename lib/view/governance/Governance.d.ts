import { View, ViewParams } from "skydapp-common";
export default class Governance implements View {
    private container;
    private proposalList;
    constructor();
    load(): Promise<void>;
    changeParams(params: ViewParams, uri: string): void;
    close(): void;
}
//# sourceMappingURL=Governance.d.ts.map