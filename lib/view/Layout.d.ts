import { DomNode } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
export default class Layout implements View {
    static current: Layout;
    private container;
    content: DomNode;
    constructor();
    set title(title: string);
    changeParams(params: ViewParams, uri: string): void;
    close(): void;
}
//# sourceMappingURL=Layout.d.ts.map