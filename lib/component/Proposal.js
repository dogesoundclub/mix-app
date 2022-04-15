"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const Constants_1 = __importDefault(require("../Constants"));
const ViewUtil_1 = __importDefault(require("../view/ViewUtil"));
class Proposal extends skynode_1.DomNode {
  constructor(proposal) {
    super("a.proposal");
    if (proposal.rejected === true) {
      this.addClass("rejected");
    }
    if (proposal.startRevoteTime !== undefined) {
      if (
        proposal.startRevoteTime +
          Constants_1.default.REVOTE_PERIOD -
          Date.now() <
        0
      ) {
        this.addClass("ended");
      } else {
        this.addClass("passed");
      }
    } else if (proposal.passed === true) {
      if (
        proposal.passTime + Constants_1.default.VOTE_PERIOD - Date.now() <
        0
      ) {
        this.addClass("ended");
      } else {
        this.addClass("passed");
      }
    }
    this.append(
      (0, skynode_1.el)("h5", proposal.title),
      (0, skynode_1.el)(
        ".status",
        proposal.rejected == true
          ? "기각"
          : proposal.passed == true
          ? proposal.passTime + Constants_1.default.VOTE_PERIOD - Date.now() < 0
            ? proposal.startRevoteTime === undefined
              ? "투표 종료"
              : proposal.startRevoteTime +
                  Constants_1.default.REVOTE_PERIOD -
                  Date.now() <
                0
              ? "투표 종료"
              : "재투표"
            : "투표중"
          : "검토중"
      )
    );
    this.onDom("click", () => {
      ViewUtil_1.default.go(`/governance/${proposal.id}`);
    });
  }
}
exports.default = Proposal;
//# sourceMappingURL=Proposal.js.map
