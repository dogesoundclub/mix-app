"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const Proposal_1 = __importDefault(require("../../component/Proposal"));
const Alert_1 = __importDefault(
  require("../../component/shared/dialogue/Alert")
);
const Config_1 = __importDefault(require("../../Config"));
const Layout_1 = __importDefault(require("../Layout"));
class Governance {
  constructor() {
    Layout_1.default.current.title = "거버넌스";
    Layout_1.default.current.content.append(
      (this.container = (0, skynode_1.el)(
        ".governance-view",
        (0, skynode_1.el)(
          "section",
          (0, skynode_1.el)("h1", "MIX 거버넌스"),
          (0, skynode_1.el)("p", "MIX를 위한 제안을 적극 환영합니다"),
          (0, skynode_1.el)(
            ".top-nav",
            (0, skynode_1.el)("button", "제안 생성", {
              click: () =>
                new Alert_1.default(
                  "MIX 백서 v2 실행이 완료될 때 까지 거버넌스 제안 생성이 불가능합니다."
                ),
            })
          ),
          (this.proposalList = (0, skynode_1.el)(".proposal-list"))
        )
      ))
    );
    this.load();
  }
  async load() {
    const result = await fetch(
      `https://${Config_1.default.apiHost}/governance/proposals`
    );
    const proposals = await result.json();
    for (const proposal of proposals) {
      this.proposalList.append(new Proposal_1.default(proposal));
    }
  }
  changeParams(params, uri) {}
  close() {
    this.container.delete();
  }
}
exports.default = Governance;
//# sourceMappingURL=Governance.js.map
