import { DomNode } from "skydapp-browser";
export default class StageEmateItem extends DomNode {
    id: number;
    mix: number;
    name: string;
    isDancing: boolean;
    private checkbox;
    private dancingDisplay;
    private bar;
    constructor(id: number, mix: number, name: string, isDancing: boolean);
    loadBar(): void;
    setDanding(): void;
    deselect(): void;
}
//# sourceMappingURL=StageEmateItem.d.ts.map