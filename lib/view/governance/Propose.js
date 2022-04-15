"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const Confirm_1 = __importDefault(
  require("../../component/shared/dialogue/Confirm")
);
const Config_1 = __importDefault(require("../../Config"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const Layout_1 = __importDefault(require("../Layout"));
const ViewUtil_1 = __importDefault(require("../ViewUtil"));
class Propose {
  constructor() {
    this.connectHandler = () => {
      this.loadAddress();
    };
    Layout_1.default.current.title = "제안하기";
    let titleInput;
    let summaryInput;
    let contentInput;
    let noteInput;
    let termCheckbox;
    let nftInput;
    let proposerInput;
    let proposalNftInput;
    let optionTitles = [];
    Layout_1.default.current.content.append(
      (this.container = (0, skynode_1.el)(
        ".governance-propose-view",
        (0, skynode_1.el)("h1", "제안하기"),
        (0, skynode_1.el)(
          ".form",
          (0, skynode_1.el)(
            "label",
            (0, skynode_1.el)("span", "제목"),
            (titleInput = (0, skynode_1.el)("input", {
              placeholder: "제안 제목을 입력하세요.",
            }))
          ),
          (0, skynode_1.el)(
            "label",
            (0, skynode_1.el)("span", "요약"),
            (summaryInput = (0, skynode_1.el)("textarea", {
              placeholder: "제안의 핵심적인 부분만 적어주세요.",
            }))
          ),
          (0, skynode_1.el)(
            "label",
            (0, skynode_1.el)("span", "본문"),
            (contentInput = (0, skynode_1.el)("textarea.content", {
              placeholder: "제안을 설명해주세요.",
            }))
          ),
          (0, skynode_1.el)(
            "label",
            (0, skynode_1.el)("span", "비고"),
            (noteInput = (0, skynode_1.el)("textarea", {
              placeholder: "비고를 적어주세요.",
            }))
          ),
          (0, skynode_1.el)(
            ".nft-container",
            (0, skynode_1.el)(
              "label",
              (0, skynode_1.el)("span", "제안자"),
              (proposerInput = (0, skynode_1.el)("input", {
                placeholder: "제안자를 적어주세요.",
              }))
            ),
            (0, skynode_1.el)(
              "label",
              (0, skynode_1.el)("span", "NFT 이름"),
              (nftInput = (0, skynode_1.el)("input", {
                placeholder: "NFT이름을 적어주세요.",
              }))
            )
          ),
          (0, skynode_1.el)(
            "label",
            (0, skynode_1.el)("span", "제안NFT"),
            (proposalNftInput = (0, skynode_1.el)("input", {
              placeholder: "제안 NFT를 적어주세요.",
            }))
          ),
          (0, skynode_1.el)(
            ".term",
            (0, skynode_1.el)(
              "label",
              (termCheckbox = (0, skynode_1.el)("input", { type: "checkbox" })),
              (0, skynode_1.el)(
                "p",
                "NFT 프로젝트들 중에 MIX 분배 풀에 들어오고싶은 NFT 프로젝트는 언제든 거버넌스에 제안할 수 있습니다. 제안을 위해서는 vMIX 0.1%를 보유하고 있어야 하며, 1,000 MIX가 소모됩니다. 제안을 통과하기 위한 최소 참여 기준은 vMIX 30% 이상입니다."
              )
            )
          ),
          (0, skynode_1.el)(
            ".controller",
            (0, skynode_1.el)("button", "생성하기", {
              click: () => {
                if (termCheckbox.domElement.checked === true) {
                  new Confirm_1.default(
                    "제안하기",
                    "제안을 등록하시겠습니까? 제안 후에는 내용을 수정할 수 없사오니 다시 한 번 확인해주시기 바랍니다.",
                    "제안 등록",
                    async () => {
                      const walletAddress =
                        await Wallet_1.default.loadAddress();
                      if (walletAddress !== undefined) {
                        const result = await Wallet_1.default.signMessage(
                          "Governance Proposal"
                        );
                        await fetch(
                          `https://${Config_1.default.apiHost}/governance/propose`,
                          {
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
                          }
                        );
                        ViewUtil_1.default.go("/governance");
                      }
                    }
                  );
                }
              },
            })
          )
        )
      ))
    );
    this.loadAddress();
    Wallet_1.default.on("connect", this.connectHandler);
  }
  async loadAddress() {
    const walletAddress = await Wallet_1.default.loadAddress();
    if (walletAddress !== undefined) {
    }
  }
  changeParams(params, uri) {}
  close() {
    Wallet_1.default.off("connect", this.connectHandler);
    this.container.delete();
  }
}
exports.default = Propose;
//# sourceMappingURL=Propose.js.map
