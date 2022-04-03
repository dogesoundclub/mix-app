import { DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";
import MatesTab from "../component/nftmining/mates/MatesTab";
import AnimalsPunksV2Tab from "../component/nftmining/ap2/AnimalsPunksV2Tab";
import CasesByKateTab from "../component/nftmining/cbk/CasesByKateTab";
import PixelCatTab from "../component/nftmining/pixelcat/PixelCatTab";
import KLITSTab from "../component/nftmining/klits/KLITSTab";
import Layout from "./Layout";
import CryptorusTab from "../component/nftmining/cryptorus/CryptorusTab";

export default class Mining implements View {

    private container: DomNode;
    private tabContainer: DomNode;

    constructor() {
        Layout.current.title = "NFT 채굴";
        Layout.current.content.append(
            this.container = el(".mining-view",
                el("h1", "MIX 채굴"),
                el("p", "아래 NFT를 보유하고 있으면 MIX를 분배받게 됩니다. NFT 홀더들은 쌓여진 MIX를 인출하기 위해 쌓여진 MIX 수량의 10%를 선납해야합니다. 이를 통해 MIX의 유통량이 늘어납니다."),
                el(".warning", "- MIX 받기에는 2번의 트랜잭션이 발생합니다. 한번은 토큰 사용 허락을 위한것이며, 다른 하나는 실제로 받기 위한 것입니다."),
                el(".tabs",
                    el("a", "DSC Mates", {
                        click: () => {
                            this.tabContainer.empty().append(new MatesTab());
                        },
                    }),
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
                    new MatesTab(),
                ),
            )
        );
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}