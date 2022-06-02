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
                    el("p", "보유하고 있는 캐릭터를 클럽 스테이지 위로 올려 춤을 추게 하거나, 스테이지 아래에서 쉬게 할 수 있습니다. 무대 위로 올라간 캐릭터는 인싸가 되어 도지사운드클럽에서 진행하는 모든 거버넌스에서 기존보다 2배의 보팅 파워를 얻게 됩니다.\n\n도지사운드클럽의 커뮤니티 토큰인 MIX를 일정 기간 예치해야 캐릭터를 스테이지에 올릴 수 있습니다. 예치에 필요한 MIX의 양은 전체 믹스의 발행량, 락업되어있는 믹스의 양, 발행된 도지사운드클럽의 PFP 개수를 통해 계산됩니다. 예치 기간은 현재 1개월입니다. 예치 기간은 DSC 거버넌스를 통해 변경될 수 있습니다. 예치한 시점에서 정해진 예치 기간이 끝나면 믹스를 돌려받을 수 있습니다."),
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
                            el("a", {
                                click: () => {
                                    new Confirm("클럽 무대에서 내려 쉬게 하기", "예치한 믹스를 돌려받고 무대 아래에서 쉬게 합니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?", "확인", () => { })
                                }
                            },
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
                                    new Confirm("클럽 무대 위로 올리기", "총 XXX 믹스를 스테이킹하고 캐릭터를 클럽 위로 올립니다. 일정 수수료가 청구될 수 있습니다. 그래도 진행하시겠습니까?", "확인", () => { })
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