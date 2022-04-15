"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const MatesTab_1 = __importDefault(
  require("../component/nftmining/mates/MatesTab")
);
const Layout_1 = __importDefault(require("./Layout"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
const EMatesTab_1 = __importDefault(
  require("../component/nftmining/emates/EMatesTab")
);
const BMCSTab_1 = __importDefault(
  require("../component/nftmining/bmcs/BMCSTab")
);
class Mining {
  constructor() {
    Layout_1.default.current.title = "NFT 채굴";
    Layout_1.default.current.content.append(
      (this.container = (0, skynode_1.el)(
        ".mining-view",
        (0, skynode_1.el)(
          "section",
          (0, skynode_1.el)("h1", "MIX 채굴"),
          (0, skynode_1.el)(
            "p",
            "아래 NFT를 보유하고 있으면 MIX를 분배받게 됩니다. NFT 홀더들은 쌓여진 MIX를 인출하기 위해 쌓여진 MIX 수량의 10%를 선납해야합니다. 이를 통해 MIX의 유통량이 늘어납니다."
          ),
          (0, skynode_1.el)(
            ".warning",
            "- MIX 받기에는 2번의 트랜잭션이 발생합니다. 한번은 토큰 사용 허락을 위한것이며, 다른 하나는 실제로 받기 위한 것입니다."
          ),
          (0, skynode_1.el)(
            ".tabs",
            (0, skynode_1.el)("a", "DSC Mates", {
              click: () => {
                this.tabContainer.empty().append(new MatesTab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "DSC E-Mates", {
              click: () => {
                this.tabContainer.empty().append(new EMatesTab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "DSC BMCS", {
              click: () => {
                this.tabContainer.empty().append(new BMCSTab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "V1", {
              click: () => {
                ViewUtil_1.default.go("mining/v1");
              },
            })
          ),
          (this.tabContainer = (0, skynode_1.el)(
            ".tab-container",
            new MatesTab_1.default()
          ))
        )
      ))
    );
  }
  changeParams(params, uri) {}
  close() {
    this.container.delete();
  }
}
exports.default = Mining;
//# sourceMappingURL=Mining.js.map
