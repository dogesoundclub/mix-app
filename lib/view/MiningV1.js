"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const AnimalsPunksV2Tab_1 = __importDefault(require("../component/nftmining/ap2/AnimalsPunksV2Tab"));
const CasesByKateTab_1 = __importDefault(require("../component/nftmining/cbk/CasesByKateTab"));
const CryptorusTab_1 = __importDefault(require("../component/nftmining/cryptorus/CryptorusTab"));
const KLITSTab_1 = __importDefault(require("../component/nftmining/klits/KLITSTab"));
const PixelCatTab_1 = __importDefault(require("../component/nftmining/pixelcat/PixelCatTab"));
const Layout_1 = __importDefault(require("./Layout"));
class MiningV1 {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("MINING_V1_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".mining-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("MINING_V1_TITLE")), (0, skydapp_browser_1.el)("p.time", (0, skydapp_browser_1.msg)("MINING_V1_DESC1")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("MINING_V1_DESC2")), (0, skydapp_browser_1.el)(".warning", (0, skydapp_browser_1.msg)("MINING_V1_DESC3")), (0, skydapp_browser_1.el)(".tabs", (0, skydapp_browser_1.el)("a", "Cases by Kate", {
            click: () => {
                this.tabContainer.empty().append(new CasesByKateTab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "Animals Punks V2", {
            click: () => {
                this.tabContainer.empty().append(new AnimalsPunksV2Tab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "Pixel Cat", {
            click: () => {
                this.tabContainer.empty().append(new PixelCatTab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "KLITS", {
            click: () => {
                this.tabContainer.empty().append(new KLITSTab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "Cryptorus Land", {
            click: () => {
                this.tabContainer.empty().append(new CryptorusTab_1.default());
            },
        })), this.tabContainer = (0, skydapp_browser_1.el)(".tab-container", new CasesByKateTab_1.default()))));
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = MiningV1;
//# sourceMappingURL=MiningV1.js.map