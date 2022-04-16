"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../../CommonUtil"));
const TurntableItem_1 = __importDefault(require("../../component/turntable/TurntableItem"));
const MateContract_1 = __importDefault(require("../../contracts/nft/MateContract"));
const KlayMIXListenersContract_1 = __importDefault(require("../../contracts/turntable/KlayMIXListenersContract"));
const KSPMIXListenersContract_1 = __importDefault(require("../../contracts/turntable/KSPMIXListenersContract"));
const MatesListenersContract_1 = __importDefault(require("../../contracts/turntable/MatesListenersContract"));
const TurntablesContract_1 = __importDefault(require("../../contracts/turntable/TurntablesContract"));
const Klaytn_1 = __importDefault(require("../../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const Layout_1 = __importDefault(require("../Layout"));
class Turntable {
    constructor() {
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("TURNTABLE_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".turntable-view", (0, skydapp_browser_1.el)("section", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("TURNTABLE_TITLE")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("TURNTABLE_DESC")), (0, skydapp_browser_1.el)(".my-turntable", (0, skydapp_browser_1.el)("h2", (0, skydapp_browser_1.msg)("TURNTABLE_TITLE1")), this.myTurntableList = (0, skydapp_browser_1.el)(".turntable-list")), (0, skydapp_browser_1.el)(".listening-turntable", (0, skydapp_browser_1.el)("h2", (0, skydapp_browser_1.msg)("TURNTABLE_TITLE2")), (0, skydapp_browser_1.el)("p", (0, skydapp_browser_1.msg)("TURNTABLE_DESC2")), this.listeningTurntableList = (0, skydapp_browser_1.el)(".turntable-list")), (0, skydapp_browser_1.el)(".all-turntable", (0, skydapp_browser_1.el)("h2", (0, skydapp_browser_1.msg)("TURNTABLE_TITLE3")), this.totalVolumeDisplay = (0, skydapp_browser_1.el)("p"), this.totalTurntableList = (0, skydapp_browser_1.el)(".turntable-list")))));
        this.loadTotalVolume();
        this.loadTurntables();
    }
    async loadTotalVolume() {
        const totalVolume = await TurntablesContract_1.default.totalVolume();
        this.totalVolumeDisplay.empty().appendText(`${(0, skydapp_browser_1.msg)("총 볼륨")}: ${CommonUtil_1.default.numberWithCommas(totalVolume.toString())}`);
    }
    async loadTurntables() {
        const count = (await TurntablesContract_1.default.turntableLength()).toNumber();
        const walletAddress = await Wallet_1.default.loadAddress();
        const currentBlock = await Klaytn_1.default.loadBlockNumber();
        const matesTurntableIds = [];
        if (walletAddress !== undefined) {
            const balance = (await MateContract_1.default.balanceOf(walletAddress)).toNumber();
            const promises = [];
            for (let i = 0; i < balance; i += 1) {
                const promise = async (index) => {
                    const mateId = await MateContract_1.default.tokenOfOwnerByIndex(walletAddress, index);
                    if (await MatesListenersContract_1.default.listening(mateId)) {
                        matesTurntableIds.push((await MatesListenersContract_1.default.listeningTo(mateId)).toNumber());
                    }
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);
        }
        const promises = [];
        for (let i = 0; i < count; i += 1) {
            const promise = async (id) => {
                try {
                    const turntable = await TurntablesContract_1.default.turntables(id);
                    if (this.container.deleted !== true) {
                        if (matesTurntableIds.includes(id) === true || (walletAddress !== undefined && ((await KlayMIXListenersContract_1.default.shares(id, walletAddress)).gt(0) ||
                            (await KSPMIXListenersContract_1.default.shares(id, walletAddress)).gt(0)))) {
                            new TurntableItem_1.default(id, currentBlock, turntable).appendTo(this.listeningTurntableList);
                        }
                        if (turntable.owner !== ethers_1.constants.AddressZero) {
                            if (turntable.owner === walletAddress) {
                                new TurntableItem_1.default(id, currentBlock, turntable, true).appendTo(this.myTurntableList);
                            }
                            new TurntableItem_1.default(id, currentBlock, turntable).appendTo(this.totalTurntableList);
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            };
            promises.push(promise(i));
        }
        await Promise.all(promises);
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Turntable;
//# sourceMappingURL=Turntable.js.map