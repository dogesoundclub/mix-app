import { DomNode } from "skydapp-browser";
import EMatesTab from "./EMatesTab";
export default class EMateItem extends DomNode {
    private tab;
    private id;
    private mixAmount;
    private claimable;
    private refreshInterval;
    constructor(tab: EMatesTab, id: number, name: string | undefined);
    private load;
    delete(): void;
}
//# sourceMappingURL=EMateItem.d.ts.map