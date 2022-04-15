import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import Proposal from "../../component/Proposal";
import Alert from "../../component/shared/dialogue/Alert";
import Config from "../../Config";
import Layout from "../Layout";

export default class Governance implements View {

    private container: DomNode;
    private proposalList: DomNode;

    constructor() {
        Layout.current.title = msg("GOVERNANCE_TITLE");
        Layout.current.content.append(
            this.container = el(".governance-view",
                el("section",
                    el("h1", msg("GOVERNANCE_TITLE")),
                    el("p", msg("GOVERNANCE_DESC1")),
                    el(".top-nav", el("button", msg("GOVERNANCE_BUTTON"), {
                        click: () => new Alert(msg("GOVERNANCE_ALERT")),
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