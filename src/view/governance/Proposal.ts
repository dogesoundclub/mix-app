import { DomNode, el, msg } from "skydapp-browser";
import marked from "marked";
import { SkyRouter, View, ViewParams } from "skydapp-common";
import xss from "xss";
import AssetsCalculator from "../../AssetsCalculator";
import CommonUtil from "../../CommonUtil";
import AssetsDisplay from "../../component/AssetsDisplay";
import Alert from "../../component/shared/dialogue/Alert";
import Confirm from "../../component/shared/dialogue/Confirm";
import Prompt from "../../component/shared/dialogue/Prompt";
import Config from "../../Config";
import Constants from "../../Constants";
import Wallet from "../../klaytn/Wallet";
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
        let optionList;

        const revoted = proposal.startRevoteTime !== undefined;

        this.container.append(
            el("h1", proposal.title),
            el(".proposer-container",
                el("span.proposer", msg("GOVERNANCE_PROPOSAL_TITLE1")),
                el("span.address", proposal.proposer)
            ),
            el(".content",
                el("h6", msg("GOVERNANCE_PROPOSAL_TITLE2")),
                revoted === true ?
                    el("p", `${msg("GOVERNANCE_PROPOSAL_TITLE3")}: ${TimeFormatter.fromNow(new Date(proposal.startRevoteTime + Constants.REVOTE_PERIOD))}`) :
                    el("p", `${msg("GOVERNANCE_PROPOSAL_TITLE4")}: ${TimeFormatter.fromNow(new Date(proposal.passTime + Constants.VOTE_PERIOD))}`),
                el("h6", msg("GOVERNANCE_PROPOSAL_TITLE5")),
                el("p", proposal.summary),
                el("hr"),
                el("h6", msg("GOVERNANCE_PROPOSAL_TITLE6")),
                contentDisplay = el("p.markdown-body"),
                el("hr"),
                el("h6", msg("GOVERNANCE_PROPOSAL_TITLE7")),
                noteDisplay = el("p.markdown-body"),
                el("hr"),
            ),
            el(".vote-container",
                el(".assets",
                    el("h2", msg("GOVERNANCE_PROPOSAL_TITLE8")),
                    revoted === true ? new AssetsDisplay(proposal.revoterAssets) : new AssetsDisplay(proposal.voterAssets),
                ),
                el(".options-wrapper",
                    el("header",
                        el("h2", msg("GOVERNANCE_PROPOSAL_TITLE9")),
                        el("p", msg("GOVERNANCE_PROPOSAL_DESC9")),
                    ),
                    el(".options",
                        el(".list",
                            el("header",
                                el(".title", msg("GOVERNANCE_PROPOSAL_TITLE10")),
                                el(".voters", msg("GOVERNANCE_PROPOSAL_TITLE11")),
                                el(".percent", msg("GOVERNANCE_PROPOSAL_TITLE12")),
                                el(".controller", msg("GOVERNANCE_PROPOSAL_TITLE13")),
                            ),
                            optionList = el("ul"),
                        ),
                        revoted === true ? undefined : el(".caption-container",),
                        revoted === true || proposal.passed !== true ? undefined : el("button", msg("GOVERNANCE_PROPOSAL_BUTTON1"), {
                            click: () => {
                                new Prompt(msg("GOVERNANCE_PROPOSAL_PROMPT_TITLE1"), msg("GOVERNANCE_PROPOSAL_PROMPT_DEC1"), msg("GOVERNANCE_PROPOSAL_PROMPT_BUTTON1"), async (optionTitle) => {
                                    if (await Wallet.connected() !== true) {
                                        await Wallet.connect();
                                    }
                                    const walletAddress = await Wallet.loadAddress();
                                    if (walletAddress !== undefined) {
                                        const signResult = await Wallet.signMessage("Add Governance Proposal Option");
                                        const result = await fetch(`https://${Config.apiHost}/governance/addoption`, {
                                            method: "POST",
                                            body: JSON.stringify({
                                                proposalId,
                                                option: optionTitle,
                                                voter: walletAddress,
                                                signedMessage: signResult.signedMessage,
                                                klipAddress: signResult.klipAddress,
                                            }),
                                        });
                                        if (result.ok === true) {
                                            SkyRouter.refresh();
                                        } else {
                                            new Alert(msg("GOVERNANCE_PROPOSAL_ALERT_TITLE1"), msg("GOVERNANCE_PROPOSAL_ALERT_DESC1"));
                                        }
                                    }
                                });
                            },
                        }),
                    ),
                ),
            ),
        );

        const walletAddress = await Wallet.loadAddress();

        if (revoted === true) {
            if (proposal.options.length > 2) {
                const newOptions = [...proposal.options];
                newOptions.sort((a: any, b: any) => AssetsCalculator.calculatePercent(proposal.voterAssets, b.voterAssets) - AssetsCalculator.calculatePercent(proposal.voterAssets, a.voterAssets));

                for (const [index, option] of newOptions.entries()) {
                    if (index < 2) {
                        optionList.append(el("li",
                            el(".title", option.title),
                            el(".voters", String(option.revoters === undefined ? 0 : option.revoters.length)),
                            el(".percent-container",
                                el(".percent", `${CommonUtil.numberWithCommas(String(AssetsCalculator.calculatePercent(proposal.revoterAssets, option.revoterAssets)))}%`)),
                            el(".controller",
                                proposal.passed !== true ? undefined : (
                                    option.revoters?.includes(walletAddress) === true ? el(".voted", msg("GOVERNANCE_PROPOSAL_BUTTON2")) : el("button", msg("GOVERNANCE_PROPOSAL_BUTTON3"), {
                                        click: () => {
                                            new Confirm(msg("GOVERNANCE_PROPOSAL_CONFIRM_TITLE1"), `\"${option.title}\" ${msg("GOVERNANCE_PROPOSAL_CONFIRM_DESC1")}`, msg("GOVERNANCE_PROPOSAL_CONFIRM_BUTTON1"), async () => {
                                                if (await Wallet.connected() !== true) {
                                                    await Wallet.connect();
                                                }
                                                const walletAddress = await Wallet.loadAddress();
                                                if (walletAddress !== undefined) {
                                                    const signResult = await Wallet.signMessage("Vote Governance Proposal");
                                                    const result = await fetch(`https://${Config.apiHost}/governance/revote`, {
                                                        method: "POST",
                                                        body: JSON.stringify({
                                                            proposalId,
                                                            optionIndex: proposal.options.indexOf(option),
                                                            voter: walletAddress,
                                                            signedMessage: signResult.signedMessage,
                                                            klipAddress: signResult.klipAddress,
                                                        }),
                                                    });
                                                    if (result.ok === true) {
                                                        SkyRouter.refresh();
                                                    } else {
                                                        new Alert(msg("GOVERNANCE_PROPOSAL_ALERT_TITLE1"), msg("GOVERNANCE_PROPOSAL_ALERT_DESC1"));
                                                    }
                                                }
                                            });
                                        },
                                    })
                                ),
                            ),
                        ));
                    }
                }
            }
        }

        else {
            for (const [optionIndex, option] of proposal.options.entries()) {
                optionList.append(el("li",
                    el(".title", option.title),
                    el(".voters", String(option.voters.length)),
                    el(".percent-container", el("img.mobile-percent", { src: "/images/icon/balance.svg" }),
                        el(".percent", `${CommonUtil.numberWithCommas(String(AssetsCalculator.calculatePercent(proposal.voterAssets, option.voterAssets)))}%`)),
                    el(".controller",
                        proposal.passed !== true ? undefined : (
                            option.voters.includes(walletAddress) === true ? el(".voted", msg("GOVERNANCE_PROPOSAL_BUTTON2")) : el("button", msg("GOVERNANCE_PROPOSAL_BUTTON3"), {
                                click: () => {
                                    new Confirm(msg("GOVERNANCE_PROPOSAL_CONFIRM_TITLE1"), `\"${option.title}\" ${msg("GOVERNANCE_PROPOSAL_CONFIRM_DESC1")}`, msg("GOVERNANCE_PROPOSAL_CONFIRM_BUTTON1"), async () => {
                                        if (await Wallet.connected() !== true) {
                                            await Wallet.connect();
                                        }
                                        const walletAddress = await Wallet.loadAddress();
                                        if (walletAddress !== undefined) {
                                            const signResult = await Wallet.signMessage("Vote Governance Proposal");
                                            const result = await fetch(`https://${Config.apiHost}/governance/vote`, {
                                                method: "POST",
                                                body: JSON.stringify({
                                                    proposalId,
                                                    optionIndex,
                                                    voter: walletAddress,
                                                    signedMessage: signResult.signedMessage,
                                                    klipAddress: signResult.klipAddress,
                                                }),
                                            });
                                            if (result.ok === true) {
                                                SkyRouter.refresh();
                                            } else {
                                                new Alert(msg("GOVERNANCE_PROPOSAL_ALERT_TITLE1"), msg("GOVERNANCE_PROPOSAL_ALERT_DESC1"));
                                            }
                                        }
                                    });
                                },
                            })
                        ),
                    ),
                ));
            }
        }

        contentDisplay.domElement.innerHTML = xss(marked(proposal.content));
        noteDisplay.domElement.innerHTML = xss(marked(proposal.note));

        if (proposal.rejected === true) {
            this.container.append(el("p.reject-reason", proposal.rejectReason));
        }

        else if (proposal.passed !== true) {
            this.container.append(el("p.review", msg("GOVERNANCE_PROPOSAL_WARNING_DESC1")));

            const walletAddress = await Wallet.loadAddress();
            if (walletAddress === Config.admin) {
                this.container.append(el(".controller",
                    el("button", msg("GOVERNANCE_PROPOSAL_BUTTON4"), {
                        click: async () => {
                            const result = await Wallet.signMessage("Pass Governance Proposal");
                            await fetch(`https://${Config.apiHost}/governance/passproposal`, {
                                method: "POST",
                                body: JSON.stringify({
                                    proposalId,
                                    signedMessage: result.signedMessage,
                                    klipAddress: result.klipAddress,
                                }),
                            });
                            SkyRouter.refresh();
                        },
                    }),
                    el("button", msg("GOVERNANCE_PROPOSAL_BUTTON5"), {
                        click: async () => {
                            new Prompt(msg("GOVERNANCE_PROPOSAL_PROMPT_TITLE2"), msg("GOVERNANCE_PROPOSAL_PROMPT_DEC2"), msg("GOVERNANCE_PROPOSAL_PROMPT_BUTTON2"), async (rejectReason) => {
                                const result = await Wallet.signMessage("Reject Governance Proposal");
                                await fetch(`https://${Config.apiHost}/governance/rejectproposal`, {
                                    method: "POST",
                                    body: JSON.stringify({
                                        proposalId,
                                        rejectReason,
                                        signedMessage: result.signedMessage,
                                        klipAddress: result.klipAddress,
                                    }),
                                });
                                SkyRouter.refresh();
                            });
                        },
                    }),
                ));
            }
        }

        else if (proposal.passTime! + Constants.VOTE_PERIOD - Date.now() < 0 && proposal.startRevoteTime === undefined) {

            const walletAddress = await Wallet.loadAddress();
            if (walletAddress === Config.admin) {
                this.container.append(el(".controller",
                    el("button", msg("GOVERNANCE_PROPOSAL_BUTTON6"), {
                        click: async () => {
                            const result = await Wallet.signMessage("Start Revote Governance Proposal");
                            await fetch(`https://${Config.apiHost}/governance/startrevote`, {
                                method: "POST",
                                body: JSON.stringify({
                                    proposalId,
                                    signedMessage: result.signedMessage,
                                    klipAddress: result.klipAddress,
                                }),
                            });
                            SkyRouter.refresh();
                        },
                    }),
                ));
            }
        }
    }

    public changeParams(params: ViewParams, uri: string): void {
        this.load(params.proposalId);
    }

    public close(): void {
        this.container.delete();
    }
}