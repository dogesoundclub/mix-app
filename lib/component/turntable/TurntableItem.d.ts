import { DomNode } from "skydapp-browser";
import { TurntableInfo } from "../../contracts/turntable/TurntablesContract";
export default class TurntableItem extends DomNode {
    private id;
    private nameDisplay;
    private gradeDisplay;
    private claimableDisplay;
    constructor(id: number, currentBlock: number, info: TurntableInfo, showMix?: boolean);
    private loadInfo;
    private loadClaimable;
}
//# sourceMappingURL=TurntableItem.d.ts.map