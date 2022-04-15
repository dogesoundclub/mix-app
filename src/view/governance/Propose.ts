import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import Confirm from "../../component/shared/dialogue/Confirm";
import Config from "../../Config";
import Wallet from "../../klaytn/Wallet";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class Propose implements View {

    private container: DomNode;

    constructor() {
        Layout.current.title = msg("GOVERNANCE_PROPOSE_TITLE");

        let titleInput: DomNode<HTMLInputElement>;
        let summaryInput: DomNode<HTMLTextAreaElement>;
        let contentInput: DomNode<HTMLTextAreaElement>;
        let noteInput: DomNode<HTMLTextAreaElement>;
        let termCheckbox: DomNode<HTMLInputElement>;
        let nftInput: DomNode<HTMLInputElement>;
        let proposerInput: DomNode<HTMLInputElement>;
        let proposalNftInput: DomNode<HTMLInputElement>;

        let optionTitles: string[] = [];

        Layout.current.content.append(
            this.container = el(".governance-propose-view",
                el("h1", msg("GOVERNANCE_PROPOSE_TITLE")),
                el(".form",
                    el("label",
                        el("span", msg("GOVERNANCE_PROPOSE_TITLE1")),
                        titleInput = el("input", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT1") }),
                    ),
                    el("label",
                        el("span", msg("GOVERNANCE_PROPOSE_TITLE2")),
                        summaryInput = el("textarea", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT2") }),
                    ),
                    el("label",
                        el("span", msg("GOVERNANCE_PROPOSE_TITLE3")),
                        contentInput = el("textarea.content", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT3") }),
                    ),
                    el("label",
                        el("span", msg("GOVERNANCE_PROPOSE_TITLE4")),
                        noteInput = el("textarea", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT4") }),
                    ),
                    el(".nft-container",
                        el("label",
                            el("span", msg("GOVERNANCE_PROPOSE_TITLE5")),
                            proposerInput = el("input", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT5") }),
                        ),
                        el("label",
                            el("span", msg("GOVERNANCE_PROPOSE_TITLE6")),
                            nftInput = el("input", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT6") }),
                        ),
                    ),
                    el("label",
                        el("span", msg("GOVERNANCE_PROPOSE_TITLE7")),
                        proposalNftInput = el("input", { placeholder: msg("GOVERNANCE_PROPOSE_INPUT7") }),
                    ),
                    el(".term",
                        el("label",
                            termCheckbox = el("input", { type: "checkbox" }),
                            el("p", msg("GOVERNANCE_PROPOSE_CHECKBOX")),
                        ),
                    ),
                    el(".controller",
                        el("button", msg("GOVERNANCE_PROPOSE_BUTTON"), {
                            click: () => {
                                if (termCheckbox.domElement.checked === true) {
                                    new Confirm(msg("GOVERNANCE_PROPOSE_POPUP_TITLE"), msg("GOVERNANCE_PROPOSE_POPUP_DESC"), msg("GOVERNANCE_PROPOSE_POPUP_BUTTON"), async () => {
                                        const walletAddress = await Wallet.loadAddress();
                                        if (walletAddress !== undefined) {
                                            const result = await Wallet.signMessage("Governance Proposal");
                                            await fetch(`https://${Config.apiHost}/governance/propose`, {
                                                method: "POST",
                                                body: JSON.stringify({
                                                    title: titleInput.domElement.value,
                                                    summary: summaryInput.domElement.value,
                                                    content: contentInput.domElement.value,
                                                    note: noteInput.domElement.value,
                                                    proposer: walletAddress,
                                                    options: optionTitles,
                                                    signedMessage: result.signedMessage,
                                                    klipAddress: result.klipAddress,
                                                }),
                                            });
                                            ViewUtil.go("/governance");
                                        }
                                    });
                                }
                            },
                        }),
                    ),
                ),
            ),
        );

        this.loadAddress();
        Wallet.on("connect", this.connectHandler);
    }

    private connectHandler = () => {
        this.loadAddress();
    };

    private async loadAddress() {
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {
            //this.proposer.empty().appendText(walletAddress);
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        Wallet.off("connect", this.connectHandler);
        this.container.delete();
    }
}