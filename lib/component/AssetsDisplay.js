"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const Utils_1 = __importDefault(require("../Utils"));
class AssetsDisplay extends skydapp_browser_1.DomNode {
    constructor(assets) {
        super(".assets-display");
        if (assets === undefined) {
            this.appendText("자산을 계산중입니다.");
        }
        else {
            this.append((0, skydapp_browser_1.el)(".asset.mix", (0, skydapp_browser_1.el)("h6", "MIX"), (0, skydapp_browser_1.el)("span", ethers_1.utils.formatEther(assets.mix))), (0, skydapp_browser_1.el)(".asset.mixset", (0, skydapp_browser_1.el)("h6", "Mixset"), (0, skydapp_browser_1.el)("span", ethers_1.utils.formatEther(assets.mixset))), (0, skydapp_browser_1.el)(".asset.turntable-volume", (0, skydapp_browser_1.el)("h6", "턴테이블 총 볼륨"), (0, skydapp_browser_1.el)("span", String(assets.turntableVolume))), (0, skydapp_browser_1.el)(".asset.mates", (0, skydapp_browser_1.el)("h6", "DSC Mates 개수"), (0, skydapp_browser_1.el)("span", String(assets.mates))), (0, skydapp_browser_1.el)(".asset.cases", (0, skydapp_browser_1.el)("h6", "Cases by Kate 개수"), (0, skydapp_browser_1.el)("span", String(assets.cases))), (0, skydapp_browser_1.el)(".asset.apunks", (0, skydapp_browser_1.el)("h6", "Animals Punks V2 개수"), (0, skydapp_browser_1.el)("span", String(assets.apunks))), (0, skydapp_browser_1.el)(".asset.pixelcats", (0, skydapp_browser_1.el)("h6", "Pixel Cats 개수"), (0, skydapp_browser_1.el)("span", String(assets.pixelcats))), (0, skydapp_browser_1.el)(".asset.klits", (0, skydapp_browser_1.el)("h6", "KLITS 개수"), (0, skydapp_browser_1.el)("span", String(Utils_1.default.undefinedToZero(assets.klits)))), (0, skydapp_browser_1.el)(".asset.cryptorus", (0, skydapp_browser_1.el)("h6", "Cryptorus Land 개수"), (0, skydapp_browser_1.el)("span", String(Utils_1.default.undefinedToZero(assets.cryptorus)))), (0, skydapp_browser_1.el)(".asset.klaylp", (0, skydapp_browser_1.el)("h6", "Klay-MIX LP 토큰 총 수량"), (0, skydapp_browser_1.el)("span", ethers_1.utils.formatEther(assets.klaylp))), (0, skydapp_browser_1.el)(".asset.ksplp", (0, skydapp_browser_1.el)("h6", "KSP-MIX LP 토큰 총 수량"), (0, skydapp_browser_1.el)("span", ethers_1.utils.formatEther(assets.ksplp))), (0, skydapp_browser_1.el)(".asset.devfunds", (0, skydapp_browser_1.el)("h6", "Dev Team"), (0, skydapp_browser_1.el)("span", ethers_1.utils.formatEther(assets.devfunds))));
        }
    }
}
exports.default = AssetsDisplay;
//# sourceMappingURL=AssetsDisplay.js.map