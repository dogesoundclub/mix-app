import { DomNode, el } from "@hanul/skynode";
import marked from "marked";
import xss from "xss";
import { View, ViewParams } from "skyrouter";
import Config from "../../Config";
import Constants from "../../Constants";
import TimeFormatter from "../../TimeFormatter";
import Layout from "../Layout";

export default class Proposal implements View {

    private container: DomNode;

    constructor(params: ViewParams) {
        Layout.current.content.append(
            this.container = el(".governance-proposal-view"),
        );
        this.load(params.proposalId);
    }

    private async load(proposalId: string) {

        const result = await fetch(`https://${Config.apiHost}/governance/proposal/${proposalId}`);
        const proposal = await result.json();
        Layout.current.title = proposal.title;

        let contentDisplay;
        let noteDisplay;

        const revoted = proposal.startRevoteTime !== undefined;

        this.container.append(
            el("h1", proposal.title),
            el(".content",
                el("h6", "기간"),
                revoted === true ?
                    el("p", `재투표 종료: ${TimeFormatter.fromNow(new Date(proposal.startRevoteTime + Constants.REVOTE_PERIOD))}`) :
                    el("p", `투표 종료: ${TimeFormatter.fromNow(new Date(proposal.passTime + Constants.VOTE_PERIOD))}`),
                el("h6", "요약"),
                el("p", proposal.summary),
                el("h6", "본문"),
                contentDisplay = el("p.markdown-body"),
                el("h6", "비고"),
                noteDisplay = el("p.markdown-body"),
                el("h6", "제안자"),
                el("p", proposal.proposer),
            ),
        );

        contentDisplay.domElement.innerHTML = xss(marked(proposal.content));
        noteDisplay.domElement.innerHTML = xss(marked(proposal.note));
    }

    public changeParams(params: ViewParams, uri: string): void {
        this.load(params.proposalId);
    }

    public close(): void {
        this.container.delete();
    }
}