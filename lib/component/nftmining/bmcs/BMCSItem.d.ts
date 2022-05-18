import { DomNode } from "skydapp-browser";
import BMCSTab from "./BMCSTab";
export default class BMCSItem extends DomNode {
    private tab;
    private id;
    private mixAmount;
    private claimable;
    private image;
    private refreshInterval;
    constructor(tab: BMCSTab, id: number, name: string | undefined);
    private load;
    delete(): void;
}
//# sourceMappingURL=BMCSItem.d.ts.map