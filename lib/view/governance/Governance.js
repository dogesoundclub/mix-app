"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const Proposal_1 = __importDefault(require("../../component/Proposal"));
const Alert_1 = __importDefault(require("../../component/shared/dialogue/Alert"));
const Config_1 = __importDefault(require("../../Config"));
const Layout_1 = __importDefault(require("../Layout"));
class Governance {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("GOVERNANCE_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".governance-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("GOVERNANCE_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("GOVERNANCE_DESC1")), (0, skydapp_browser_1.el)(".top-nav", (0, skydapp_browser_1.el)("button", (0, skydapp_browser_1.msg)("GOVERNANCE_BUTTON"), {
            click: () => new Alert_1.default((0, skydapp_browser_1.msg)("GOVERNANCE_ALERT")),
        })), this.proposalList = (0, skydapp_browser_1.el)(".proposal-list"))));
        this.load();
    }
    async load() {
        const result = await fetch(`https://${Config_1.default.apiHost}/governance/proposals`);
        const proposals = await result.json();
        for (const proposal of proposals) {
            this.proposalList.append(new Proposal_1.default(proposal));
        }
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Governance;
//# sourceMappingURL=Governance.js.map