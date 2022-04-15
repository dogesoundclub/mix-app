import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import AnimalsPunksV2Tab from "../component/nftmining/ap2/AnimalsPunksV2Tab";
import CasesByKateTab from "../component/nftmining/cbk/CasesByKateTab";
import CryptorusTab from "../component/nftmining/cryptorus/CryptorusTab";
import KLITSTab from "../component/nftmining/klits/KLITSTab";
import PixelCatTab from "../component/nftmining/pixelcat/PixelCatTab";
import Layout from "./Layout";

export default class MiningV1 implements View {

    private container: DomNode;
    private tabContainer: DomNode;

    constructor() {
        Layout.current.title = msg("MINING_V1_TITLE");
        Layout.current.content.append(
            this.container = el(".mining-view",
                el("section",
                    el("h1", msg("MINING_V1_TITLE")),
                    el("p.time", msg("MINING_V1_DESC1")),
                    el("p", msg("MINING_V1_DESC2")),
                    el(".warning", msg("MINING_V1_DESC3")),
                    el(".tabs",
                        el("a", "Cases by Kate", {
                            click: () => {
                                this.tabContainer.empty().append(new CasesByKateTab());
                            },
                        }),
                        el("a", "Animals Punks V2", {
                            click: () => {
                                this.tabContainer.empty().append(new AnimalsPunksV2Tab());
                            },
                        }),
                        el("a", "Pixel Cat", {
                            click: () => {
                                this.tabContainer.empty().append(new PixelCatTab());
                            },
                        }),
                        el("a", "KLITS", {
                            click: () => {
                                this.tabContainer.empty().append(new KLITSTab());
                            },
                        }),
                        el("a", "Cryptorus Land", {
                            click: () => {
                                this.tabContainer.empty().append(new CryptorusTab());
                            },
                        }),
                    ),
                    this.tabContainer = el(".tab-container",
                        new CasesByKateTab(),
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