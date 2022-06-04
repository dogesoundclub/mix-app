"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const MobileMenu_1 = __importDefault(require("../component/shared/menu/MobileMenu"));
const PCMenu_1 = __importDefault(require("../component/shared/menu/PCMenu"));
const UserInfo_1 = __importDefault(require("../component/shared/menu/UserInfo"));
const ViewUtil_1 = __importDefault(require("./ViewUtil"));
class Layout {
    constructor() {
        Layout.current = this;
        skydapp_browser_1.BodyNode.append((this.container = (0, skydapp_browser_1.el)(".layout", (0, skydapp_browser_1.el)("header", (0, skydapp_browser_1.el)(".nav", (0, skydapp_browser_1.el)("a.menu-button", (0, skydapp_browser_1.el)("img", { src: "/images/shared/icn/menu.svg" }), {
            click: (event, button) => {
                const rect = button.rect;
                new MobileMenu_1.default({ left: 0, top: rect.bottom }).appendTo(skydapp_browser_1.BodyNode);
            },
        }), (0, skydapp_browser_1.el)("a", { click: () => ViewUtil_1.default.go("/") }, (0, skydapp_browser_1.el)(".logo", (0, skydapp_browser_1.el)("img", { src: "/images/shared/logo/mix-text.svg" }))), (0, skydapp_browser_1.el)(".right", new PCMenu_1.default(), new UserInfo_1.default()))), (0, skydapp_browser_1.el)("main", (this.content = (0, skydapp_browser_1.el)(".content"))), (0, skydapp_browser_1.el)("footer", (0, skydapp_browser_1.el)(".sidebar", (0, skydapp_browser_1.el)(".content", (0, skydapp_browser_1.el)(".term", (0, skydapp_browser_1.el)("a", { href: "/terms" }, "서비스이용약관"), (0, skydapp_browser_1.el)("a", "support@ayias.io")), (0, skydapp_browser_1.el)(".social", (0, skydapp_browser_1.el)("a", "링크트리 바로가기", {
            href: "https://linktr.ee/dogesoundclub",
            target: "_blank",
        })))), (0, skydapp_browser_1.el)(".provider", (0, skydapp_browser_1.el)("h6", "DSC LABEL Inc."), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("FOOTER_DESC")), (0, skydapp_browser_1.el)("p", "Copyright @2021 DSCLabel Inc. ALL RIGHTS RESERVED."))))));
    }
    set title(title) {
        document.title = `${title} | Mix`;
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Layout;
//# sourceMappingURL=Layout.js.map