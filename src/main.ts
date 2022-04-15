import { BrowserInfo, msg } from "skydapp-browser";
import { SkyRouter } from "skydapp-common";
import superagent from "superagent";
import Wallet from "./klaytn/Wallet";
import Burn from "./view/Burn";
import Governance from "./view/governance/Governance";
import Proposal from "./view/governance/Proposal";
import Propose from "./view/governance/Propose";
import Home from "./view/Home";
import Layout from "./view/Layout";
import Mining from "./view/Mining";
import Booth from "./view/Booth";
import Turntable from "./view/turntable/Turntable";
import TurntableDetail from "./view/turntable/Detail";
import BuyTurntable from "./view/turntable/BuyTurntable";
import Update from "./view/turntable/Update";
import RemoveMates from "./view/turntable/RemoveMates";
import AddMates from "./view/turntable/AddMates";
import MiningMates from "./view/turntable/MiningMates";
import MateHolders from "./view/turntable/MateHolders";
import MiningV1 from "./view/MiningV1";

(async () => {
    msg.language = BrowserInfo.language;
    msg.parseCSV((await superagent.get("/msg.csv")).text);

    SkyRouter.route("**", Layout);
    SkyRouter.route("", Home);

    SkyRouter.route("governance", Governance);
    SkyRouter.route("governance/{proposalId}", Proposal, [
        "governance/propose",
    ]);
    SkyRouter.route("governance/propose", Propose);

    SkyRouter.route("mining", Mining);
    SkyRouter.route("mining/v1", MiningV1);
    SkyRouter.route("burn", Burn);
    SkyRouter.route("booth", Booth);

    SkyRouter.route("turntable", Turntable);
    SkyRouter.route("turntable/buy", BuyTurntable);
    SkyRouter.route("turntable/{id}", TurntableDetail, ["turntable/buy"]);
    SkyRouter.route("turntable/{id}/update", Update);
    SkyRouter.route("turntable/{id}/addmates", AddMates);
    SkyRouter.route("turntable/{id}/removemates", RemoveMates);
    SkyRouter.route("turntable/{id}/miningmates", MiningMates);
    SkyRouter.route("turntable/{id}/mateholders", MateHolders);

    if (sessionStorage.__spa_path) {
        SkyRouter.go(sessionStorage.__spa_path);
        sessionStorage.removeItem("__spa_path");
    }

    if (await Wallet.connected() !== true) {
        await Wallet.connect();
    }
})();
