import { DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";
import { utils } from "ethers";
import superagent from "superagent";
import CommonUtil from "../CommonUtil";
import BurnPoolContract from "../contracts/mix/BurnPoolContract";
import MixEmitterContract from "../contracts/mix/MixEmitterContract";
import MixContract from "../contracts/mix/MixContract";
import Wallet from "../klaytn/Wallet";
import Loading from "../component/shared/loading/Loading";
import Layout from "./Layout";
import ViewUtil from "./ViewUtil";

export default class Home implements View {

    private container: DomNode;
    private priceDisplay: DomNode;
    private poolDisplay: DomNode;
    private burnableDisplay: DomNode;

    constructor() {
        Layout.current.title = "NFT 프로젝트 허브를 위한 토큰";
        Layout.current.content.append(
            (this.container = el(".home-view",
                el("header",
                    el(".overview-container",
                        el(".content",
                            el("h3", "1믹스 가격"),
                            this.priceDisplay = el("p", "...원"),
                        ),
                        el("hr"),
                        el(".content",
                            el("h3", "1믹스 발행량"),
                            this.poolDisplay = el("p", "...MIX"),
                        ),
                        el("hr"),
                        el(".content",
                            el("h3", "믹스 소각풀"),
                            this.burnableDisplay = el("p", "...MIX"),
                        ),
                    ),
                    el(".desc-container",
                        el("img", { src: "/images/shared/logo/mix.svg", alt: "mix logo" }),
                        el("h1", "NFT 프로젝트 허브를 위한 토큰"),
                        el("p", "MIX는 NFT 프로젝트들의 허브를 위한 토큰입니다.\nDSC 사이트의 전 범위에서 사용되며, Klayswap에서 유동성 공급 및 거래에 사용될 예정입니다.\n또한 MIX를 활용한 기능을 추가하기로 약속한 파트너 프로젝트의 서비스에서도 사용될 예정입니다."),
                        el(".button-container",
                            el("a", "믹스 구매하기"),
                            el("a.outline", "백서 보기"),
                        ),
                        el("a.add-mix", "MIX 지갑에 추가하기"),
                    ),
                    el(".scroll-container",
                        el("img", { src: "/images/shared/img/scroll.svg", alt: "scroll" }),
                    ),
                ),
                el("article",
                    el(".pool-container",
                        el("h2", "풀 정보"),
                        el("section",
                            el(".info-card",
                                el("h3", "메이트 풀"),
                                el("p", "메이트 홀더들은 DSC 커뮤니티의 가장 적극적인 사용자들로, 메이트를 보유하고 있으면 MIX를 분배받게 됩니다. 메이트 홀더들은 쌓여진 MIX를 인출하기 위해 쌓여진 MIX 수량의 10%를 선납해야합니다. 이를 통해 MIX의 유통량이 늘어납니다."),
                            ),
                            el(".info-card",
                                el("h3", "파트너 풀"),
                                el("p", "파트너 풀은 MIX 커뮤니티와 파트너십을 맺은 프로젝트들에 할당되는 풀입니다. 해당 프로젝트들은 MIX를 활용하는 기능들을 지속적으로 추가할 예정입니다. 인출 방식은 메이트와 동일합니다."),
                            ),
                            el(".info-card",
                                el("h3", "Klayswap 유동성 풀"),
                                el("p", "Klayswap의 유동성 풀에 발행량 중 일부를 할당합니다. 이를 통해 Klayswap 내 MIX 풀의 APR을 상승시켜, MIX 토큰이 더 큰 유동성을 갖도록 만듭니다. 풀은 Klay-MIX LP 및 KSP-MIX LP, 두 가지가 있습니다."),
                            ),
                            el(".info-card",
                                el("h3", "Dev Fund"),
                                el("p", "개발 펀드는 개발 및 마케팅 등 MIX의 활용처를 늘리고 주어진 목표를 달성하는 책임을 이행할 수 있도록 합니다."),
                            ),
                        ),
                    ),
                ),
            )),
        );
        this.loadPrice();
    }

    private async loadPrice() {
        const result = await superagent.get("https://api.dogesound.club/mix/price");
        if (this.container.deleted !== true) {
            this.priceDisplay.empty().appendText(`${CommonUtil.numberWithCommas(result.text)}원`);
        }

        const pid = await BurnPoolContract.getPoolId();
        const burnable = await MixEmitterContract.pendingMix(pid);
        if (this.container.deleted !== true) {
            this.burnableDisplay.empty().appendText(CommonUtil.numberWithCommas(utils.formatEther(burnable)));
            this.poolDisplay.empty().appendText("...");
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}