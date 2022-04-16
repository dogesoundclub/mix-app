"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const MatesTab_1 = __importDefault(require("../component/nftmining/mates/MatesTab"));
const Layout_1 = __importDefault(require("./Layout"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
const EMatesTab_1 = __importDefault(require("../component/nftmining/emates/EMatesTab"));
const BMCSTab_1 = __importDefault(require("../component/nftmining/bmcs/BMCSTab"));
class Mining {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("MINING_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".mining-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("MINING_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("MINING_DESC1")), (0, skydapp_browser_1.el)(".warning", (0, skydapp_browser_1.msg)("MINING_DESC2")), (0, skydapp_browser_1.el)(".tabs", (0, skydapp_browser_1.el)("a", "DSC Mates", {
            click: () => {
                this.tabContainer.empty().append(new MatesTab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "DSC E-Mates", {
            click: () => {
                this.tabContainer.empty().append(new EMatesTab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "DSC BMCS", {
            click: () => {
                this.tabContainer.empty().append(new BMCSTab_1.default());
            },
        }), (0, skydapp_browser_1.el)("a", "V1", {
            click: () => {
                ViewUtil_1.default.go("mining/v1");
            },
        })), this.tabContainer = (0, skydapp_browser_1.el)(".tab-container", new MatesTab_1.default()))));
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Mining;
//# sourceMappingURL=Mining.js.map