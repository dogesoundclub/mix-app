import { DomNode } from "skydapp-browser";
import Stage from "../../view/Stage";
export default class StageEmateItem extends DomNode {
    id: number;
    mix: number;
    name: string;
    private currentBlock;
    isDancing: boolean;
    private checkbox;
    private dancingDisplay;
    private bar;
    private remains;
    private imageDisplay;
    constructor(stage: Stage, id: number, mix: number, name: string, currentBlock: number, isDancing: boolean);
    stakingBlock: number;
    returnMixTimes: number;
    loadBar(): Promise<void>;
    setDancing(): void;
    deselect(): void;
}
//# sourceMappingURL=StageEmateItem.d.ts.map