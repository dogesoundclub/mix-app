import { DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";
import Proposal from "../../component/Proposal";
import Alert from "../../component/shared/dialogue/Alert";
import Config from "../../Config";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class Governance implements View {

    private container: DomNode;
    private proposalList: DomNode;

    constructor() {
        Layout.current.title = "거버넌스";
        Layout.current.content.append(
            this.container = el(".governance-view",
                el("section",
                    el("h1", "MIX 거버넌스"),
                    el("p", "MIX를 위한 제안을 적극 환영합니다"),
                    el(".top-nav", el("button", "제안 생성", {
                        click: () => new Alert("MIX 백서 v2 실행이 완료될 때 까지 거버넌스 제안 생성이 불가능합니다."),
                    })),
                    this.proposalList = el(".proposal-list"),
                ),
            )
        );
        this.load();
    }

    public async load() {
        const result = await fetch(`https://${Config.apiHost}/governance/proposals`);
        const proposals = await result.json();
        for (const proposal of proposals) {
            this.proposalList.append(new Proposal(proposal));
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}