import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import BuyTurntableItem from "../../component/turntable/BuyTurntableItem";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class BuyTurntable implements View {

    private container: DomNode;

    constructor() {
        Layout.current.title = msg("TURNTABLE_BUY_TITLE");
        Layout.current.content.append(this.container = el(".buy-turntable-view",
            el(".content",
                el("h1", msg("TURNTABLE_BUY_TITLE")),
                el("p", msg("TURNTABLE_BUY_DESC1")),
                el("p", msg("TURNTABLE_BUY_DESC2")),
            ),
            el("p.warning",
                el(".text-wrap",
                    msg("TURNTABLE_BUY_DESC3"),
                    "\n",
                    el("b", msg("TURNTABLE_BUY_DESC4"), { style: { fontWeight: "bold" } }),
                )
            ),
            el(".turntable-list",
                new BuyTurntableItem(0),
                new BuyTurntableItem(1),
                new BuyTurntableItem(2),
                new BuyTurntableItem(3),
                new BuyTurntableItem(5),
            ),
        ));
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}
