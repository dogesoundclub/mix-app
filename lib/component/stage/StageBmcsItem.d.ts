import { DomNode } from "skydapp-browser";
export default class StageBmcsItem extends DomNode {
    id: number;
    mix: number;
    name: string;
    isDancing: boolean;
    private checkbox;
    private dancingDisplay;
    private bar;
    private imageDisplay;
    constructor(id: number, mix: number, name: string, isDancing: boolean);
    init(): Promise<void>;
    loadBar(): void;
    loadImage(): Promise<void>;
    setDanding(): void;
    deselect(): void;
}
//# sourceMappingURL=StageBmcsItem.d.ts.map