import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import MatesTab from "../component/nftmining/mates/MatesTab"
import Layout from "./Layout";
import ViewUtil from "./ViewUtil";
import EMatesTab from "../component/nftmining/emates/EMatesTab";
import BMCSTab from "../component/nftmining/bmcs/BMCSTab";

export default class Mining implements View {

    private container: DomNode;
    private tabContainer: DomNode;

    constructor() {
        Layout.current.title = msg("MINING_TITLE");
        Layout.current.content.append(
            this.container = el(".mining-view",
                el("section",
                    el("h1", msg("MINING_TITLE")),
                    el("p", msg("MINING_DESC1")),
                    el(".warning", msg("MINING_DESC2")),
                    el(".tabs",
                        el("a", "DSC Mates", {
                            click: () => {
                                this.tabContainer.empty().append(new MatesTab());
                            },
                        }),
                        el("a", "DSC E-Mates", {
                            click: () => {
                                this.tabContainer.empty().append(new EMatesTab());
                            },
                        }),
                        el("a", "DSC BMCS", {
                            click: () => {
                                this.tabContainer.empty().append(new BMCSTab());
                            },
                        }),
                        el("a", "V1", {
                            click: () => {
                                ViewUtil.go("mining/v1");
                            },
                        }),
                    ),
                    this.tabContainer = el(".tab-container",
                        new MatesTab(),
                    ),
                ),
            )
        );
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}