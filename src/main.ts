import { SkyRouter } from "skyrouter";
import Wallet from "./klaytn/Wallet";
import Burn from "./view/Burn";
import Governance from "./view/governance/Governance";
import Proposal from "./view/governance/Proposal";
import Propose from "./view/governance/Propose";
import Home from "./view/Home";
import Layout from "./view/Layout";
import Mining from "./view/Mining";

(async () => {

    SkyRouter.route("**", Layout);
    SkyRouter.route("", Home);

    SkyRouter.route("governance", Governance);
    SkyRouter.route("governance/{proposalId}", Proposal, [
        "governance/propose",
    ]);
    SkyRouter.route("governance/propose", Propose);

    SkyRouter.route("mining", Mining);
    SkyRouter.route("burn", Burn);

    if (sessionStorage.__spa_path) {
        SkyRouter.go(sessionStorage.__spa_path);
        sessionStorage.removeItem("__spa_path");
    }

    if (await Wallet.connected() !== true) {
        await Wallet.connect();
    }
})();