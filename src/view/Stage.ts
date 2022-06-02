import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import StageMateItem from "../component/mate/StageMateItem";
import AnimalsPunksV2Tab from "../component/nftmining/ap2/AnimalsPunksV2Tab";
import CasesByKateTab from "../component/nftmining/cbk/CasesByKateTab";
import CryptorusTab from "../component/nftmining/cryptorus/CryptorusTab";
import KLITSTab from "../component/nftmining/klits/KLITSTab";
import PixelCatTab from "../component/nftmining/pixelcat/PixelCatTab";
import Alert from "../component/shared/dialogue/Alert";
import Confirm from "../component/shared/dialogue/Confirm";
import Layout from "./Layout";

export default class Stage implements View {

    private container: DomNode;

    constructor() {
        Layout.current.title = "Stage";
        Layout.current.content.append(
            this.container = el(".stage-view",
                el("section",
                    el("header",
                        el("h1", "MIX 채굴"),
                        el("p", "(v2)"),
                    ),
                    el("p", "아래 NFT를 보유하고 있으면 MIX를 분배받게 됩니다. NFT 홀더들은 쌓여진 MIX를 인출하기 위해 쌓여진 MIX 수량의 10%를 선납해야합니다. 이를 통해 MIX의 유통량이 늘어납니다."),
                    el(".warning", msg("MINING_V1_DESC3")),
                    el(".dancing-mate-container",
                        el("header",
                            el("h6", "춤추고 있는 클럽메이트"),
                            el("p", "(10개)"),
                        ),
                        el(".mate-list",
                            new StageMateItem(1, 300, "Undefined"),
                            new StageMateItem(2, 300, "Undefined"),
                        ),
                        el(".button-container",
                            el("a",
                                el("img", { src: "/images/shared/icn/stage-down.svg", alt: "stage down" }),
                                "STAGE DOWN",
                            ),
                        ),
                    ),
                    el("hr"),
                    el(".resting-mate-container",
                        el("header",
                            el("h6", "춤추고 있는 클럽메이트"),
                            el("p", "10개"),
                        ),
                        el(".mate-list",
                            new StageMateItem(1, 300, "Undefined"),
                            new StageMateItem(2, 300, "Undefined"),
                        ),
                        el(".button-container",
                            el("a", {
                                click: () => {
                                    new Confirm("NFT 활성화하기", "총 XXX mix 스테이킹을 진행합니다.\n스테이킹된 mix는 언제라도 다시 회수할 수 있습니다. 다만 거래시 클레이튼 기본 수수료가 청구될 수 있습니다.", "확인", () => { })
                                }
                            },
                                el("img", { src: "/images/shared/icn/stage-up.svg", alt: "stage up" }),
                                el("p", "STAGE UP"),
                            ),
                        ),
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