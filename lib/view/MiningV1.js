"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("skydapp-browser");
const AnimalsPunksV2Tab_1 = __importDefault(
  require("../component/nftmining/ap2/AnimalsPunksV2Tab")
);
const CasesByKateTab_1 = __importDefault(
  require("../component/nftmining/cbk/CasesByKateTab")
);
const CryptorusTab_1 = __importDefault(
  require("../component/nftmining/cryptorus/CryptorusTab")
);
const KLITSTab_1 = __importDefault(
  require("../component/nftmining/klits/KLITSTab")
);
const PixelCatTab_1 = __importDefault(
  require("../component/nftmining/pixelcat/PixelCatTab")
);
const Layout_1 = __importDefault(require("./Layout"));
class MiningV1 {
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
            (0, skynode_1.el)("a", "Cases by Kate", {
              click: () => {
                this.tabContainer
                  .empty()
                  .append(new CasesByKateTab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "Animals Punks V2", {
              click: () => {
                this.tabContainer
                  .empty()
                  .append(new AnimalsPunksV2Tab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "Pixel Cat", {
              click: () => {
                this.tabContainer.empty().append(new PixelCatTab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "KLITS", {
              click: () => {
                this.tabContainer.empty().append(new KLITSTab_1.default());
              },
            }),
            (0, skynode_1.el)("a", "Cryptorus Land", {
              click: () => {
                this.tabContainer.empty().append(new CryptorusTab_1.default());
              },
            })
          ),
          (this.tabContainer = (0, skynode_1.el)(
            ".tab-container",
            new CasesByKateTab_1.default()
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
exports.default = MiningV1;
//# sourceMappingURL=MiningV1.js.map
