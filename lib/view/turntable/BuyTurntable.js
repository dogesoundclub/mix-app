"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const BuyTurntableItem_1 = __importDefault(require("../../component/turntable/BuyTurntableItem"));
const Layout_1 = __importDefault(require("../Layout"));
class BuyTurntable {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("TURNTABLE_BUY_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".buy-turntable-view", (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("TURNTABLE_BUY_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("TURNTABLE_BUY_DESC1")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("TURNTABLE_BUY_DESC2"))), (0, skydapp_browser_1.el)("p.warning", (0, skydapp_browser_1.el)(".text-wrap", (0, skydapp_browser_1.msg)("TURNTABLE_BUY_DESC3"), "\n", (0, skydapp_browser_1.el)("b", (0, skydapp_browser_1.msg)("TURNTABLE_BUY_DESC4"), { style: { fontWeight: "bold" } }))), (0, skydapp_browser_1.el)(".turntable-list", new BuyTurntableItem_1.default(0), new BuyTurntableItem_1.default(1), new BuyTurntableItem_1.default(2), new BuyTurntableItem_1.default(3), new BuyTurntableItem_1.default(5))));
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = BuyTurntable;
//# sourceMappingURL=BuyTurntable.js.map