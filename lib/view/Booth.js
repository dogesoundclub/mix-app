"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const Loading_1 = __importDefault(
  require("../component/shared/loading/Loading")
);
const BoothContract_1 = __importDefault(
  require("../contracts/mix/BoothContract")
);
const MixContract_1 = __importDefault(require("../contracts/mix/MixContract"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const Layout_1 = __importDefault(require("./Layout"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
class Booth {
  constructor() {
    Layout_1.default.current.title = "MIX 스테이킹";
    Layout_1.default.current.content.append(
      (this.container = (0, skynode_1.el)(
        ".booth-view",
        (0, skynode_1.el)(
          "section",
          (0, skynode_1.el)(
            "section",
            (0, skynode_1.el)(
              ".content",
              (0, skynode_1.el)(".title", "1 MIXSET"),
              (this.priceDisplay = (0, skynode_1.el)(
                "span",
                new Loading_1.default()
              )),
              (0, skynode_1.el)("span", " MIX")
            ),
            (0, skynode_1.el)(
              ".grid-container",
              (0, skynode_1.el)(
                ".content",
                (0, skynode_1.el)(".title", "지난 24시간 동안의 APR"),
                (this.aprDisplay = (0, skynode_1.el)(
                  "span.bold",
                  new Loading_1.default()
                )),
                (0, skynode_1.el)("span", " %")
              ),
              (0, skynode_1.el)(
                ".content",
                (0, skynode_1.el)(".title", "예치된 총 MIX"),
                (this.totalBalanceDisplay = (0, skynode_1.el)(
                  "span.bold",
                  new Loading_1.default()
                )),
                (0, skynode_1.el)("span", " MIX")
              ),
              (0, skynode_1.el)(
                ".content",
                (0, skynode_1.el)(".title", "지난 24시간 동안 소각된 MIX"),
                (this.burn24Display = (0, skynode_1.el)(
                  "span.bold",
                  new Loading_1.default()
                )),
                (0, skynode_1.el)("span", " MIX")
              ),
              (0, skynode_1.el)(
                ".content",
                (0, skynode_1.el)(".title", "지난 24시간 동안 분배된 MIX"),
                (this.reward24Display = (0, skynode_1.el)(
                  "span.bold",
                  new Loading_1.default()
                )),
                (0, skynode_1.el)("span", " MIX")
              )
            )
          ),
          (0, skynode_1.el)("hr"),
          (0, skynode_1.el)(
            "section.staking",
            (0, skynode_1.el)("h2", "MIX 스테이킹"),
            (0, skynode_1.el)(
              "p",
              "MIX가 소각될 때 마다 소각량의 0.3%가 부스에 대한 지분에 따라 분배됩니다."
            ),
            (0, skynode_1.el)(
              ".form",
              (this.stakeInput = (0, skynode_1.el)("input", {
                placeholder: "예치할 액수를 넣어주세요.",
              })),
              (0, skynode_1.el)("button", "예치하기", {
                click: async () => {
                  await BoothContract_1.default.stake(
                    ethers_1.utils.parseEther(this.stakeInput.domElement.value)
                  );
                  ViewUtil_1.default.waitTransactionAndRefresh();
                },
              }),
              (0, skynode_1.el)(
                ".container",
                (0, skynode_1.el)(
                  ".caption",
                  (0, skynode_1.el)("label", "MIX: "),
                  (this.balanceDisplay = (0, skynode_1.el)(
                    "span",
                    new Loading_1.default()
                  ))
                ),
                (0, skynode_1.el)("button.max-btn", "최대 수량", {
                  click: async () => {
                    const walletAddress = await Wallet_1.default.loadAddress();
                    if (walletAddress !== undefined) {
                      const balance = await MixContract_1.default.balanceOf(
                        walletAddress
                      );
                      this.stakeInput.domElement.value =
                        ethers_1.utils.formatEther(balance);
                    }
                  },
                })
              )
            ),
            (0, skynode_1.el)(
              ".warning",
              "예치 시에는 2번의 트랜잭션이 발생합니다. 한번은 토큰 사용 허락을 위한 것이며, 다른 하나는 실제 예치를 위한 것입니다."
            ),
            (0, skynode_1.el)("h2", "MIX 스테이킹 해제"),
            (0, skynode_1.el)(
              ".form",
              (this.unstakeInput = (0, skynode_1.el)("input", {
                placeholder: "예치할 액수를 넣어주세요.",
              })),
              (0, skynode_1.el)("button", "해제하기", {
                click: async () => {
                  await BoothContract_1.default.unstake(
                    ethers_1.utils.parseEther(
                      this.unstakeInput.domElement.value
                    )
                  );
                  ViewUtil_1.default.waitTransactionAndRefresh();
                },
              }),
              (0, skynode_1.el)(
                ".container",
                (0, skynode_1.el)(
                  ".caption",
                  (0, skynode_1.el)("label", "MIXSET: "),
                  (this.mixsetDisplay = (0, skynode_1.el)(
                    "span",
                    new Loading_1.default()
                  ))
                ),
                (0, skynode_1.el)("button.max-btn", "최대 수량", {
                  click: async () => {
                    const walletAddress = await Wallet_1.default.loadAddress();
                    if (walletAddress !== undefined) {
                      const staked = await BoothContract_1.default.balanceOf(
                        walletAddress
                      );
                      this.unstakeInput.domElement.value =
                        ethers_1.utils.formatEther(staked);
                    }
                  },
                })
              )
            )
          )
        )
      ))
    );
    this.loadInfo();
    this.loadBalance();
  }
  async loadInfo() {
    const totalMix = await MixContract_1.default.balanceOf(
      BoothContract_1.default.address
    );
    const totalMixset = await BoothContract_1.default.getTotalSupply();
    if (totalMixset.eq(0)) {
      this.priceDisplay.empty().appendText("1");
    } else {
      this.priceDisplay
        .empty()
        .appendText(
          CommonUtil_1.default.numberWithCommas(
            ethers_1.utils.formatEther(
              totalMix
                .mul(ethers_1.BigNumber.from("1000000000000000000"))
                .div(totalMixset)
            ),
            5
          )
        );
    }
    if (totalMix.eq(0)) {
      this.aprDisplay.empty().appendText("0");
      this.totalBalanceDisplay.empty().appendText("0");
      this.burn24Display.empty().appendText("0");
      this.reward24Display.empty().appendText("0");
    } else {
      const currentBlock = await Klaytn_1.default.loadBlockNumber();
      const transferEvents = await MixContract_1.default.getTransferEvents(
        BoothContract_1.default.address,
        currentBlock - 86400,
        currentBlock
      );
      let total24 = ethers_1.BigNumber.from(0);
      for (const event of transferEvents) {
        total24 = total24.add(event.returnValues[2]);
      }
      const stakeEvents = await BoothContract_1.default.getStakeEvents(
        currentBlock - 86400,
        currentBlock
      );
      for (const event of stakeEvents) {
        total24 = total24.sub(event.returnValues[1]);
      }
      const apr = total24.mul(3650000).div(totalMix).toNumber() / 100;
      this.aprDisplay
        .empty()
        .appendText(CommonUtil_1.default.numberWithCommas(apr.toString()));
      this.totalBalanceDisplay
        .empty()
        .appendText(
          CommonUtil_1.default.numberWithCommas(
            ethers_1.utils.formatEther(totalMix)
          )
        );
      this.burn24Display
        .empty()
        .appendText(
          CommonUtil_1.default.numberWithCommas(
            ethers_1.utils.formatEther(total24.mul(1000).div(3))
          )
        );
      this.reward24Display
        .empty()
        .appendText(
          CommonUtil_1.default.numberWithCommas(
            ethers_1.utils.formatEther(total24)
          )
        );
    }
  }
  async loadBalance() {
    if ((await Wallet_1.default.connected()) !== true) {
      await Wallet_1.default.connect();
    }
    const walletAddress = await Wallet_1.default.loadAddress();
    if (walletAddress !== undefined) {
      const balance = await MixContract_1.default.balanceOf(walletAddress);
      this.balanceDisplay
        .empty()
        .appendText(
          CommonUtil_1.default.numberWithCommas(
            ethers_1.utils.formatEther(balance)
          )
        );
      const mixset = await BoothContract_1.default.balanceOf(walletAddress);
      this.mixsetDisplay
        .empty()
        .appendText(
          CommonUtil_1.default.numberWithCommas(
            ethers_1.utils.formatEther(mixset)
          )
        );
    }
  }
  changeParams(params, uri) {}
  close() {
    this.container.delete();
  }
}
exports.default = Booth;
//# sourceMappingURL=Booth.js.map
