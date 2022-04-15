import { DomNode, el } from "@hanul/skynode";
import { SkyRouter, View, ViewParams } from "skyrouter";
import SkyUtil from "skyutil";
import Confirm from "../../component/shared/dialogue/Confirm";
import Prompt from "../../component/shared/dialogue/Prompt";
import Config from "../../Config";
import Wallet from "../../klaytn/Wallet";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class Propose implements View {

    private container: DomNode;

    constructor() {
        Layout.current.title = "제안하기";

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
                el("h1", "제안하기"),
                el(".form",
                    el("label",
                        el("span", "제목"),
                        titleInput = el("input", { placeholder: "제안 제목을 입력하세요." }),
                    ),
                    el("label",
                        el("span", "요약"),
                        summaryInput = el("textarea", { placeholder: "제안의 핵심적인 부분만 적어주세요." }),
                    ),
                    el("label",
                        el("span", "본문"),
                        contentInput = el("textarea.content", { placeholder: "제안을 설명해주세요." }),
                    ),
                    el("label",
                        el("span", "비고"),
                        noteInput = el("textarea", { placeholder: "비고를 적어주세요." }),
                    ),
                    el(".nft-container",
                        el("label",
                            el("span", "제안자"),
                            proposerInput = el("input", { placeholder: "제안자를 적어주세요." }),
                        ),
                        el("label",
                            el("span", "NFT 이름"),
                            nftInput = el("input", { placeholder: "NFT이름을 적어주세요." }),
                        ),
                    ),
                    el("label",
                        el("span", "제안NFT"),
                        proposalNftInput = el("input", { placeholder: "제안 NFT를 적어주세요." }),
                    ),
                    el(".term",
                        el("label",
                            termCheckbox = el("input", { type: "checkbox" }),
                            el("p", "NFT 프로젝트들 중에 MIX 분배 풀에 들어오고싶은 NFT 프로젝트는 언제든 거버넌스에 제안할 수 있습니다. 제안을 위해서는 vMIX 0.1%를 보유하고 있어야 하며, 1,000 MIX가 소모됩니다. 제안을 통과하기 위한 최소 참여 기준은 vMIX 30% 이상입니다."),
                        ),
                    ),
                    el(".controller",
                        el("button", "생성하기", {
                            click: () => {
                                if (termCheckbox.domElement.checked === true) {
                                    new Confirm("제안하기", "제안을 등록하시겠습니까? 제안 후에는 내용을 수정할 수 없사오니 다시 한 번 확인해주시기 바랍니다.", "제안 등록", async () => {
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