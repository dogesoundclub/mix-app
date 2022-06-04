import { DomNode } from "skydapp-browser";
export default class StageMateItem extends DomNode {
    id: number;
    mix: number;
    name: string;
    isDancing: boolean;
    private checkbox;
    private dancingDisplay;
    constructor(id: number, mix: number, name: string, isDancing: boolean);
    setDanding(): void;
    deselect(): void;
}
//# sourceMappingURL=StageMateItem.d.ts.map