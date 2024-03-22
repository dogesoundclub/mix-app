import { DomNode } from "skydapp-browser";
import Stage from "../../view/Stage";
export default class StageBmcsItem extends DomNode {
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
    init(): Promise<void>;
    stakingBlock: number;
    returnMixTimes: number;
    loadBar(): Promise<void>;
    loadImage(): Promise<void>;
    setDancing(): void;
    deselect(): void;
}
//# sourceMappingURL=StageBmcsItem.d.ts.map