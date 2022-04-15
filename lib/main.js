"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp-common_1 = require("skydapp-common");
const Wallet_1 = __importDefault(require("./klaytn/Wallet"));
const Burn_1 = __importDefault(require("./view/Burn"));
const Governance_1 = __importDefault(require("./view/governance/Governance"));
const Proposal_1 = __importDefault(require("./view/governance/Proposal"));
const Propose_1 = __importDefault(require("./view/governance/Propose"));
const Home_1 = __importDefault(require("./view/Home"));
const Layout_1 = __importDefault(require("./view/Layout"));
const Mining_1 = __importDefault(require("./view/Mining"));
const Booth_1 = __importDefault(require("./view/Booth"));
const Turntable_1 = __importDefault(require("./view/turntable/Turntable"));
const Detail_1 = __importDefault(require("./view/turntable/Detail"));
const BuyTurntable_1 = __importDefault(require("./view/turntable/BuyTurntable"));
const Update_1 = __importDefault(require("./view/turntable/Update"));
const RemoveMates_1 = __importDefault(require("./view/turntable/RemoveMates"));
const AddMates_1 = __importDefault(require("./view/turntable/AddMates"));
const MiningMates_1 = __importDefault(require("./view/turntable/MiningMates"));
const MateHolders_1 = __importDefault(require("./view/turntable/MateHolders"));
const MiningV1_1 = __importDefault(require("./view/MiningV1"));
(async () => {
    skydapp-common_1.skydapp-common.route("**", Layout_1.default);
    skydapp-common_1.skydapp-common.route("", Home_1.default);
    skydapp-common_1.skydapp-common.route("governance", Governance_1.default);
    skydapp-common_1.skydapp-common.route("governance/{proposalId}", Proposal_1.default, [
        "governance/propose",
    ]);
    skydapp-common_1.skydapp-common.route("governance/propose", Propose_1.default);
    skydapp-common_1.skydapp-common.route("mining", Mining_1.default);
    skydapp-common_1.skydapp-common.route("mining/v1", MiningV1_1.default);
    skydapp-common_1.skydapp-common.route("burn", Burn_1.default);
    skydapp-common_1.skydapp-common.route("booth", Booth_1.default);
    skydapp-common_1.skydapp-common.route("turntable", Turntable_1.default);
    skydapp-common_1.skydapp-common.route("turntable/buy", BuyTurntable_1.default);
    skydapp-common_1.skydapp-common.route("turntable/{id}", Detail_1.default, ["turntable/buy"]);
    skydapp-common_1.skydapp-common.route("turntable/{id}/update", Update_1.default);
    skydapp-common_1.skydapp-common.route("turntable/{id}/addmates", AddMates_1.default);
    skydapp-common_1.skydapp-common.route("turntable/{id}/removemates", RemoveMates_1.default);
    skydapp-common_1.skydapp-common.route("turntable/{id}/miningmates", MiningMates_1.default);
    skydapp-common_1.skydapp-common.route("turntable/{id}/mateholders", MateHolders_1.default);
    if (sessionStorage.__spa_path) {
        skydapp-common_1.skydapp-common.go(sessionStorage.__spa_path);
        sessionStorage.removeItem("__spa_path");
    }
    if (await Wallet_1.default.connected() !== true) {
        await Wallet_1.default.connect();
    }
})();
//# sourceMappingURL=main.js.map