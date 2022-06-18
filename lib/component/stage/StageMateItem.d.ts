import { DomNode } from "skydapp-browser";
import Stage from "../../view/Stage";
export default class StageMateItem extends DomNode {
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
    setDanding(): void;
    deselect(): void;
}
//# sourceMappingURL=StageMateItem.d.ts.map