"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const marked_1 = __importDefault(require("marked"));
const skydapp-common_1 = require("skydapp-common");
const xss_1 = __importDefault(require("xss"));
const AssetsCalculator_1 = __importDefault(require("../../AssetsCalculator"));
const CommonUtil_1 = __importDefault(require("../../CommonUtil"));
const AssetsDisplay_1 = __importDefault(
  require("../../component/AssetsDisplay")
);
const Alert_1 = __importDefault(
  require("../../component/shared/dialogue/Alert")
);
const Confirm_1 = __importDefault(
  require("../../component/shared/dialogue/Confirm")
);
const Prompt_1 = __importDefault(
  require("../../component/shared/dialogue/Prompt")
);
const Config_1 = __importDefault(require("../../Config"));
const Constants_1 = __importDefault(require("../../Constants"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const TimeFormatter_1 = __importDefault(require("../../TimeFormatter"));
const Layout_1 = __importDefault(require("../Layout"));
class Proposal {
  constructor(params) {
    Layout_1.default.current.content.append(
      (this.container = (0, skynode_1.el)(".governance-proposal-view"))
    );
    this.load(params.proposalId);
  }
  async load(proposalId) {
    const result = await fetch(
      `https://${Config_1.default.apiHost}/governance/proposal/${proposalId}`
    );
    const proposal = await result.json();
    Layout_1.default.current.title = proposal.title;
    let contentDisplay;
    let noteDisplay;
    let optionList;
    const revoted = proposal.startRevoteTime !== undefined;
    this.container.append(
      (0, skynode_1.el)("h1", proposal.title),
      (0, skynode_1.el)(
        ".proposer-container",
        (0, skynode_1.el)("span.proposer", "제안자"),
        (0, skynode_1.el)("span.address", proposal.proposer)
      ),
      (0, skynode_1.el)(
        ".content",
        (0, skynode_1.el)("h6", "기간"),
        revoted === true
          ? (0, skynode_1.el)(
              "p",
              `재투표 종료: ${TimeFormatter_1.default.fromNow(
                new Date(
                  proposal.startRevoteTime + Constants_1.default.REVOTE_PERIOD
                )
              )}`
            )
          : (0, skynode_1.el)(
              "p",
              `투표 종료: ${TimeFormatter_1.default.fromNow(
                new Date(proposal.passTime + Constants_1.default.VOTE_PERIOD)
              )}`
            ),
        (0, skynode_1.el)("h6", "요약"),
        (0, skynode_1.el)("p", proposal.summary),
        (0, skynode_1.el)("hr"),
        (0, skynode_1.el)("h6", "본문"),
        (contentDisplay = (0, skynode_1.el)("p.markdown-body")),
        (0, skynode_1.el)("hr"),
        (0, skynode_1.el)("h6", "비고"),
        (noteDisplay = (0, skynode_1.el)("p.markdown-body")),
        (0, skynode_1.el)("hr")
      ),
      (0, skynode_1.el)(
        ".vote-container",
        (0, skynode_1.el)(
          ".assets",
          (0, skynode_1.el)("h2", "총 투표자산"),
          revoted === true
            ? new AssetsDisplay_1.default(proposal.revoterAssets)
            : new AssetsDisplay_1.default(proposal.voterAssets)
        ),
        (0, skynode_1.el)(
          ".options-wrapper",
          (0, skynode_1.el)(
            "header",
            (0, skynode_1.el)("h2", "투표 목록"),
            (0, skynode_1.el)(
              "p",
              "후보들 중에 마음에 드는 후보가 없는 경우 다른 후보를 등록할 수 있습니다."
            )
          ),
          (0, skynode_1.el)(
            ".options",
            (0, skynode_1.el)(
              ".list",
              (0, skynode_1.el)(
                "header",
                (0, skynode_1.el)(".title", "후보"),
                (0, skynode_1.el)(".voters", "투표자"),
                (0, skynode_1.el)(".percent", "가중치"),
                (0, skynode_1.el)(".controller", "투표하기")
              ),
              (optionList = (0, skynode_1.el)("ul"))
            ),
            revoted === true
              ? undefined
              : (0, skynode_1.el)(".caption-container"),
            revoted === true || proposal.passed !== true
              ? undefined
              : (0, skynode_1.el)("button", "후보 추가", {
                  click: () => {
                    new Prompt_1.default(
                      "후보 추가",
                      "선택지로 추가할 후보를 입력해주시기 바랍니다. 후보를 추가하면 추가한 당사자는 해당 후보로 자동으로 투표합니다.",
                      "추가하기",
                      async (optionTitle) => {
                        if ((await Wallet_1.default.connected()) !== true) {
                          await Wallet_1.default.connect();
                        }
                        const walletAddress =
                          await Wallet_1.default.loadAddress();
                        if (walletAddress !== undefined) {
                          const signResult = await Wallet_1.default.signMessage(
                            "Add Governance Proposal Option"
                          );
                          const result = await fetch(
                            `https://${Config_1.default.apiHost}/governance/addoption`,
                            {
                              method: "POST",
                              body: JSON.stringify({
                                proposalId,
                                option: optionTitle,
                                voter: walletAddress,
                                signedMessage: signResult.signedMessage,
                                klipAddress: signResult.klipAddress,
                              }),
                            }
                          );
                          if (result.ok === true) {
                            skydapp-common_1.skydapp-common.refresh();
                          } else {
                            new Alert_1.default("실패", "투표에 실패했습니다.");
                          }
                        }
                      }
                    );
                  },
                })
          )
        )
      )
    );
    const walletAddress = await Wallet_1.default.loadAddress();
    if (revoted === true) {
      if (proposal.options.length > 2) {
        const newOptions = [...proposal.options];
        newOptions.sort(
          (a, b) =>
            AssetsCalculator_1.default.calculatePercent(
              proposal.voterAssets,
              b.voterAssets
            ) -
            AssetsCalculator_1.default.calculatePercent(
              proposal.voterAssets,
              a.voterAssets
            )
        );
        for (const [index, option] of newOptions.entries()) {
          if (index < 2) {
            optionList.append(
              (0, skynode_1.el)(
                "li",
                (0, skynode_1.el)(".title", option.title),
                (0, skynode_1.el)(
                  ".voters",
                  String(
                    option.revoters === undefined ? 0 : option.revoters.length
                  )
                ),
                (0, skynode_1.el)(
                  ".percent-container",
                  (0, skynode_1.el)(
                    ".percent",
                    `${CommonUtil_1.default.numberWithCommas(
                      String(
                        AssetsCalculator_1.default.calculatePercent(
                          proposal.revoterAssets,
                          option.revoterAssets
                        )
                      )
                    )}%`
                  )
                ),
                (0, skynode_1.el)(
                  ".controller",
                  proposal.passed !== true
                    ? undefined
                    : option.revoters?.includes(walletAddress) === true
                    ? (0, skynode_1.el)(".voted", "투표함")
                    : (0, skynode_1.el)("button", "투표하기", {
                        click: () => {
                          new Confirm_1.default(
                            "투표하기",
                            `\"${option.title}\" 후보에 투표하시겠습니까? 투표후 다른 후보에 재투표가 가능하며, 투표 취소는 불가능합니다.`,
                            "투표하기",
                            async () => {
                              if (
                                (await Wallet_1.default.connected()) !== true
                              ) {
                                await Wallet_1.default.connect();
                              }
                              const walletAddress =
                                await Wallet_1.default.loadAddress();
                              if (walletAddress !== undefined) {
                                const signResult =
                                  await Wallet_1.default.signMessage(
                                    "Vote Governance Proposal"
                                  );
                                const result = await fetch(
                                  `https://${Config_1.default.apiHost}/governance/revote`,
                                  {
                                    method: "POST",
                                    body: JSON.stringify({
                                      proposalId,
                                      optionIndex:
                                        proposal.options.indexOf(option),
                                      voter: walletAddress,
                                      signedMessage: signResult.signedMessage,
                                      klipAddress: signResult.klipAddress,
                                    }),
                                  }
                                );
                                if (result.ok === true) {
                                  skydapp-common_1.skydapp-common.refresh();
                                } else {
                                  new Alert_1.default(
                                    "실패",
                                    "투표에 실패했습니다."
                                  );
                                }
                              }
                            }
                          );
                        },
                      })
                )
              )
            );
          }
        }
      }
    } else {
      for (const [optionIndex, option] of proposal.options.entries()) {
        optionList.append(
          (0, skynode_1.el)(
            "li",
            (0, skynode_1.el)(".title", option.title),
            (0, skynode_1.el)(".voters", String(option.voters.length)),
            (0, skynode_1.el)(
              ".percent-container",
              (0, skynode_1.el)("img.mobile-percent", {
                src: "/images/icon/balance.svg",
              }),
              (0, skynode_1.el)(
                ".percent",
                `${CommonUtil_1.default.numberWithCommas(
                  String(
                    AssetsCalculator_1.default.calculatePercent(
                      proposal.voterAssets,
                      option.voterAssets
                    )
                  )
                )}%`
              )
            ),
            (0, skynode_1.el)(
              ".controller",
              proposal.passed !== true
                ? undefined
                : option.voters.includes(walletAddress) === true
                ? (0, skynode_1.el)(".voted", "투표함")
                : (0, skynode_1.el)("button", "투표하기", {
                    click: () => {
                      new Confirm_1.default(
                        "투표하기",
                        `\"${option.title}\" 후보에 투표하시겠습니까? 투표후 다른 후보에 재투표가 가능하며, 투표 취소는 불가능합니다.`,
                        "투표하기",
                        async () => {
                          if ((await Wallet_1.default.connected()) !== true) {
                            await Wallet_1.default.connect();
                          }
                          const walletAddress =
                            await Wallet_1.default.loadAddress();
                          if (walletAddress !== undefined) {
                            const signResult =
                              await Wallet_1.default.signMessage(
                                "Vote Governance Proposal"
                              );
                            const result = await fetch(
                              `https://${Config_1.default.apiHost}/governance/vote`,
                              {
                                method: "POST",
                                body: JSON.stringify({
                                  proposalId,
                                  optionIndex,
                                  voter: walletAddress,
                                  signedMessage: signResult.signedMessage,
                                  klipAddress: signResult.klipAddress,
                                }),
                              }
                            );
                            if (result.ok === true) {
                              skydapp-common_1.skydapp-common.refresh();
                            } else {
                              new Alert_1.default(
                                "실패",
                                "투표에 실패했습니다."
                              );
                            }
                          }
                        }
                      );
                    },
                  })
            )
          )
        );
      }
    }
    contentDisplay.domElement.innerHTML = (0, xss_1.default)(
      (0, marked_1.default)(proposal.content)
    );
    noteDisplay.domElement.innerHTML = (0, xss_1.default)(
      (0, marked_1.default)(proposal.note)
    );
    if (proposal.rejected === true) {
      this.container.append(
        (0, skynode_1.el)("p.reject-reason", proposal.rejectReason)
      );
    } else if (proposal.passed !== true) {
      this.container.append(
        (0, skynode_1.el)(
          "p.review",
          "검토중인 제안입니다. 검토가 완료되면 투표를 진행하실 수 있습니다."
        )
      );
      const walletAddress = await Wallet_1.default.loadAddress();
      if (walletAddress === Config_1.default.admin) {
        this.container.append(
          (0, skynode_1.el)(
            ".controller",
            (0, skynode_1.el)("button", "통과", {
              click: async () => {
                const result = await Wallet_1.default.signMessage(
                  "Pass Governance Proposal"
                );
                await fetch(
                  `https://${Config_1.default.apiHost}/governance/passproposal`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      proposalId,
                      signedMessage: result.signedMessage,
                      klipAddress: result.klipAddress,
                    }),
                  }
                );
                skydapp-common_1.skydapp-common.refresh();
              },
            }),
            (0, skynode_1.el)("button", "기각", {
              click: async () => {
                new Prompt_1.default(
                  "기각",
                  "기각 사유 입력",
                  "기각",
                  async (rejectReason) => {
                    const result = await Wallet_1.default.signMessage(
                      "Reject Governance Proposal"
                    );
                    await fetch(
                      `https://${Config_1.default.apiHost}/governance/rejectproposal`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          proposalId,
                          rejectReason,
                          signedMessage: result.signedMessage,
                          klipAddress: result.klipAddress,
                        }),
                      }
                    );
                    skydapp-common_1.skydapp-common.refresh();
                  }
                );
              },
            })
          )
        );
      }
    } else if (
      proposal.passTime + Constants_1.default.VOTE_PERIOD - Date.now() < 0 &&
      proposal.startRevoteTime === undefined
    ) {
      const walletAddress = await Wallet_1.default.loadAddress();
      if (walletAddress === Config_1.default.admin) {
        this.container.append(
          (0, skynode_1.el)(
            ".controller",
            (0, skynode_1.el)("button", "재투표 진행", {
              click: async () => {
                const result = await Wallet_1.default.signMessage(
                  "Start Revote Governance Proposal"
                );
                await fetch(
                  `https://${Config_1.default.apiHost}/governance/startrevote`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      proposalId,
                      signedMessage: result.signedMessage,
                      klipAddress: result.klipAddress,
                    }),
                  }
                );
                skydapp-common_1.skydapp-common.refresh();
              },
            })
          )
        );
      }
    }
  }
  changeParams(params, uri) {
    this.load(params.proposalId);
  }
  close() {
    this.container.delete();
  }
}
exports.default = Proposal;
//# sourceMappingURL=Proposal.js.map
