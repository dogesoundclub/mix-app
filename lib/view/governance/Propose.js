"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const Confirm_1 = __importDefault(require("../../component/shared/dialogue/Confirm"));
const Config_1 = __importDefault(require("../../Config"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const Layout_1 = __importDefault(require("../Layout"));
const ViewUtil_1 = __importDefault(require("../ViewUtil"));
class Propose {
    constructor() {
        this.connectHandler = () => {
            this.loadAddress();
        };
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE");
        let titleInput;
        let summaryInput;
        let contentInput;
        let noteInput;
        let termCheckbox;
        let nftInput;
        let proposerInput;
        let proposalNftInput;
        let optionTitles = [];
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".governance-propose-view", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE")), (0, skydapp_browser_1.el)(".form", (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE1")), titleInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT1") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE2")), summaryInput = (0, skydapp_browser_1.el)("textarea", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT2") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE3")), contentInput = (0, skydapp_browser_1.el)("textarea.content", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT3") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE4")), noteInput = (0, skydapp_browser_1.el)("textarea", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT4") })), (0, skydapp_browser_1.el)(".nft-container", (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE5")), proposerInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT5") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE6")), nftInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT6") }))), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("span", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_TITLE7")), proposalNftInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_INPUT7") })), (0, skydapp_browser_1.el)(".term", (0, skydapp_browser_1.el)("label", termCheckbox = (0, skydapp_browser_1.el)("input", { type: "checkbox" }), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_CHECKBOX")))), (0, skydapp_browser_1.el)(".controller", (0, skydapp_browser_1.el)("button", (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_BUTTON"), {
            click: () => {
                if (termCheckbox.domElement.checked === true) {
                    new Confirm_1.default((0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_POPUP_TITLE"), (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_POPUP_DESC"), (0, skydapp_browser_1.msg)("GOVERNANCE_PROPOSE_POPUP_BUTTON"), async () => {
                        const walletAddress = await Wallet_1.default.loadAddress();
                        if (walletAddress !== undefined) {
                            const result = await Wallet_1.default.signMessage("Governance Proposal");
                            await fetch(`https://${Config_1.default.apiHost}/governance/propose`, {
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
                            ViewUtil_1.default.go("/governance");
                        }
                    });
                }
            },
        })))));
        this.loadAddress();
        Wallet_1.default.on("connect", this.connectHandler);
    }
    async loadAddress() {
        const walletAddress = await Wallet_1.default.loadAddress();
        if (walletAddress !== undefined) {
        }
    }
    changeParams(params, uri) { }
    close() {
        Wallet_1.default.off("connect", this.connectHandler);
        this.container.delete();
    }
}
exports.default = Propose;
//# sourceMappingURL=Propose.js.map