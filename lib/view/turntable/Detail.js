"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../../CommonUtil"));
const MateList_1 = __importDefault(require("../../component/mate/MateList"));
const Config_1 = __importDefault(require("../../Config"));
const MixEmitterContract_1 = __importDefault(
  require("../../contracts/mix/MixEmitterContract")
);
const MatesListenersContract_1 = __importDefault(
  require("../../contracts/turntable/MatesListenersContract")
);
const TurntableExtrasContract_1 = __importDefault(
  require("../../contracts/turntable/TurntableExtrasContract")
);
const TurntablesContract_1 = __importDefault(
  require("../../contracts/turntable/TurntablesContract")
);
const Klaytn_1 = __importDefault(require("../../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const turntables_json_1 = __importDefault(require("../../turntables.json"));
const Prompt_1 = __importDefault(
  require("../../component/shared/dialogue/Prompt")
);
const Layout_1 = __importDefault(require("../Layout"));
const ViewUtil_1 = __importDefault(require("../ViewUtil"));
const LPTokenListenersV2_1 = __importDefault(
  require("../../component/turntable/LPTokenListenersV2")
);
const KlayMIXListenersContractV2_1 = __importDefault(
  require("../../contracts/turntable/KlayMIXListenersContractV2")
);
const KSPMIXListenersContractV2_1 = __importDefault(
  require("../../contracts/turntable/KSPMIXListenersContractV2")
);
class Detail {
  constructor(params) {
    const turntableId = parseInt(params.id, 10);
    Layout_1.default.current.title = `턴테이블 #${turntableId}`;
    Layout_1.default.current.content.append(
      (this.container = (0, skynode_1.el)(
        ".turntable-detail-view",
        (0, skynode_1.el)(
          "section",
          (0, skynode_1.el)(
            "header",
            (this.imgDisplay = (0, skynode_1.el)("img")),
            (0, skynode_1.el)(
              "section",
              (this.socailDisplay = (0, skynode_1.el)(".social-container")),
              (this.title = (0, skynode_1.el)(
                "h1",
                `턴테이블 #${turntableId}`
              )),
              (this.infoDisplay = (0, skynode_1.el)(".info"))
            )
          ),
          (0, skynode_1.el)("hr"),
          (this.controller = (0, skynode_1.el)(".controller")),
          (this.controller2 = (0, skynode_1.el)(".controller2")),
          (0, skynode_1.el)(
            "section",
            (0, skynode_1.el)("h2", "리스닝 메이트"),
            (0, skynode_1.el)("button", "MIX 수령받기", {
              click: () =>
                ViewUtil_1.default.go(`/turntable/${turntableId}/miningmates`),
            }),
            (this.mateRewardInfo = (0, skynode_1.el)(".mate-reward-info")),
            (this.listeningMateList = new MateList_1.default(false, false))
          ),
          (0, skynode_1.el)(
            ".controller",
            (0, skynode_1.el)("button.add-mates-button", "메이트 등록", {
              click: () =>
                ViewUtil_1.default.go(`/turntable/${turntableId}/addmates`),
            }),
            (0, skynode_1.el)("button.remove-mates-button", "메이트 제외", {
              click: () =>
                ViewUtil_1.default.go(`/turntable/${turntableId}/removemates`),
            })
          ),
          (0, skynode_1.el)("a.mate-holders-button", "메이트 홀더 지갑 보기", {
            click: () =>
              ViewUtil_1.default.go(`/turntable/${turntableId}/mateholders`),
          }),
          (0, skynode_1.el)("hr"),
          (0, skynode_1.el)(
            "section",
            (0, skynode_1.el)("h2", "리스닝 LP 토큰"),
            (0, skynode_1.el)(
              "p.warning",
              "LP 토큰을 리스너로 등록할 수 있습니다. 리스너로 등록된 동안에는 Klayswap 에어드롭 풀로부터 MIX를 분배받을 수 없습니다. 따라서 반드시 Klayswap 에어드롭 풀과 수익률을 비교하시기 바랍니다."
            ),
            (0, skynode_1.el)(
              ".listeners",
              new LPTokenListenersV2_1.default(
                "Klay-MIX Listeners V2",
                KlayMIXListenersContractV2_1.default,
                turntableId,
                14
              ),
              new LPTokenListenersV2_1.default(
                "KSP-MIX Listeners V2",
                KSPMIXListenersContractV2_1.default,
                turntableId,
                15
              )
            )
          )
        )
      ))
    );
    this.loadInfo(turntableId);
    this.loadListeningMates(turntableId);
  }
  async loadInfo(turntableId) {
    const currentBlock = await Klaytn_1.default.loadBlockNumber();
    const walletAddress = await Wallet_1.default.loadAddress();
    const turntable = await TurntablesContract_1.default.turntables(
      turntableId
    );
    if (turntable.owner === ethers_1.constants.AddressZero) {
      this.infoDisplay.empty().appendText("폐쇄된 턴테이블입니다.");
    } else {
      const lifetime = turntable.endBlock - currentBlock;
      const claimable = await TurntablesContract_1.default.claimableOf(
        turntableId
      );
      const extra = await TurntableExtrasContract_1.default.extras(turntableId);
      let data = {};
      try {
        data = JSON.parse(extra);
      } catch (e) {
        console.error(e);
      }
      if (data.name !== undefined) {
        Layout_1.default.current.title = data.name;
        this.title.empty().appendText(data.name);
      }
      const turntableType = turntables_json_1.default[turntable.typeId];
      this.imgDisplay.domElement.src = turntableType.img;
      this.infoDisplay
        .empty()
        .append(
          (0, skynode_1.el)(
            ".volume",
            `Volume: ${CommonUtil_1.default.numberWithCommas(
              String(turntableType.volume)
            )}`
          )
        );
      if (data.bgm !== undefined) {
        let bgm = data.bgm;
        const v = bgm.indexOf("?v=");
        if (v !== -1) {
          bgm = `https://www.youtube.com/embed/${bgm.substring(v + 3)}`;
        } else if (bgm.indexOf("https://youtu.be/") === 0) {
          bgm = `https://www.youtube.com/embed/${bgm.substring(17)}`;
        }
        this.infoDisplay.append();
      }
      if (data.description !== undefined) {
        this.infoDisplay.append((0, skynode_1.el)("p", data.description));
      }
      if (data.kakaotalk !== undefined) {
        this.socailDisplay.append(
          (0, skynode_1.el)(
            ".social",
            (0, skynode_1.el)(
              "a",
              (0, skynode_1.el)("img", { src: "/images/shared/icn/kakao.svg" }),
              { href: data.kakaotalk, target: "_blank" }
            )
          )
        );
      }
      if (data.twitter !== undefined) {
        this.socailDisplay.append(
          (0, skynode_1.el)(
            ".social",
            (0, skynode_1.el)(
              "a",
              (0, skynode_1.el)("img", {
                src: "/images/shared/icn/twitter.svg",
              }),
              {
                href:
                  data.twitter[0] === "@"
                    ? `https://twitter.com/${data.twitter.substring(1)}`
                    : data.twitter,
                target: "_blank",
              }
            )
          )
        );
      }
      this.infoDisplay.append(
        (0, skynode_1.el)(".owner", `소유자: ${turntable.owner}`),
        turntable.owner !== walletAddress
          ? undefined
          : (0, skynode_1.el)(
              ".mix",
              `- 쌓인 MIX: ${CommonUtil_1.default.numberWithCommas(
                ethers_1.utils.formatEther(claimable),
                5
              )}`
            ),
        (0, skynode_1.el)(
          ".lifetime",
          `Lifetime: ${CommonUtil_1.default.numberWithCommas(
            String(lifetime < 0 ? 0 : lifetime)
          )} Blocks`
        )
      );
      if (turntable.owner === walletAddress) {
        this.controller.empty().append(
          (0, skynode_1.el)("button.charge-button", "충전하기", {
            click: () => {
              new Prompt_1.default(
                "충전하기",
                "얼마만큼의 MIX를 충전하시겠습니까? 배터리 충전 가격은 턴테이블의 가격의 1/5와 비례하며, 턴테이블의 가격과 같은 액수의 MIX로 배터리를 충전하면 턴테이블 수명의 5배의 수명이 더해집니다.",
                "충전하기",
                async (amount) => {
                  const mix = ethers_1.utils.parseEther(amount);
                  await TurntablesContract_1.default.charge(turntableId, mix);
                  ViewUtil_1.default.waitTransactionAndRefresh();
                }
              );
            },
          }),
          (0, skynode_1.el)("button.update-button", "수정하기", {
            click: () =>
              ViewUtil_1.default.go(`/turntable/${turntableId}/update`),
          })
        );
        this.controller2
          .empty()
          .append(
            (0, skynode_1.el)("button.claim-button", "MIX 수령", {
              click: () => TurntablesContract_1.default.claim([turntableId]),
            })
          );
      }
    }
  }
  async loadListeningMates(turntableId) {
    const poolInfo = await MixEmitterContract_1.default.poolInfo(
      Config_1.default.isTestnet === true ? 4 : 9
    );
    const tokenPerDay = (poolInfo.allocPoint / 10000 / 2) * 86400 * 0.7;
    const totalShares = (
      await MatesListenersContract_1.default.totalShares()
    ).toNumber();
    this.mateRewardInfo
      .empty()
      .append(
        (0, skynode_1.el)(
          "p",
          `메이트 1개당 하루에 받는 MIX 수량: ${CommonUtil_1.default.numberWithCommas(
            String(tokenPerDay / totalShares)
          )}`
        )
      );
    const mateBalance = (
      await MatesListenersContract_1.default.listenerCount(turntableId)
    ).toNumber();
    const mates = [];
    const promises = [];
    for (let i = 0; i < mateBalance; i += 1) {
      const promise = async (index) => {
        const mateId = (
          await MatesListenersContract_1.default.listeners(turntableId, index)
        ).toNumber();
        mates.push(mateId);
      };
      promises.push(promise(i));
    }
    await Promise.all(promises);
    this.listeningMateList.load(mates);
  }
  changeParams(params, uri) {}
  close() {
    this.container.delete();
  }
}
exports.default = Detail;
//# sourceMappingURL=Detail.js.map
