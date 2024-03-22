import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import { utils } from "ethers";
import superagent from "superagent";
import CommonUtil from "../CommonUtil";
import BurnPoolContract from "../contracts/mix/BurnPoolContract";
import MixEmitterContract from "../contracts/mix/MixEmitterContract";
import Layout from "./Layout";
import MixContract from "../contracts/mix/MixContract";

export default class Home implements View {
  private container: DomNode;
  // private priceDisplay: DomNode;
  // private poolDisplay: DomNode;
  // private burnableDisplay: DomNode;

  constructor() {
    Layout.current.title = msg("HOME_TITLE");
    Layout.current.content.append(
      (this.container = el(
        ".home-view",
        el(
          "header",
          el(
            ".overview-container",
            // el(
            //   ".content",
            //   el("h3", msg("HOME_OVERVIEW_TITLE1")),
            //   (this.priceDisplay = el("p", "...원"))
            // ),
            // el("hr"),
            // el(
            //   ".content",
            //   el("h3", msg("HOME_OVERVIEW_TITLE2")),
            //   (this.poolDisplay = el("p", "...MIX"))
            // )
            // el("hr"),
            // el(
            //   ".content",
            //   el("h3", msg("HOME_OVERVIEW_TITLE3")),
            //   (this.burnableDisplay = el("p", "...MIX"))
            // )
          ),
          el(
            ".desc-container",
            el("img", { src: "/images/shared/logo/mix.svg", alt: "mix logo" }),
            el("h1", msg("HOME_TITLE")),
            el("p", msg("HOME_DESC1")),
            el(
              ".button-container",
              el("a", msg("HOME_BUY_MIX_BUTTON"), {
                href: "https://klayswap.com/exchange/swap",
                target: "_blank",
              }),
              el("a.outline", msg("HOME_WHITEPAPER_BUTTON"))
            ),
            el("a.add-mix", msg("HOME_ADD_MIX_BUTTON"))
          ),
          el(
            ".scroll-container",
            el("img", { src: "/images/shared/img/scroll.svg", alt: "scroll" })
          )
        ),
        el(
          "article",
          el(
            ".pool-container",
            el("h2", msg("HOME_POOL_TITLE")),
            el(
              "section",
              el(
                ".info-card",
                el("h3", msg("HOME_POOL_TITLE1")),
                el("p", msg("HOME_POOL_DESC1"))
              ),
              el(
                ".info-card",
                el("h3", msg("HOME_POOL_TITLE2")),
                el("p", msg("HOME_POOL_DESC2"))
              ),
              el(
                ".info-card",
                el("h3", msg("HOME_POOL_TITLE3")),
                el("p", msg("HOME_POOL_DESC3"))
              ),
              el(
                ".info-card",
                el("h3", msg("HOME_POOL_TITLE4")),
                el("p", msg("HOME_POOL_DESC4"))
              )
            )
          )
        )
      ))
    );
    // this.loadPrice();
  }

  // private async loadPrice() {
  //   const result = await superagent.get("https://api.dogesound.club/mix/price");
  //   if (this.container.deleted !== true) {
  //     this.priceDisplay
  //       .empty()
  //       .appendText(`${CommonUtil.numberWithCommas(result.text)} 원`);
  //   }

  //   const pid = await BurnPoolContract.getPoolId();
  //   const burnable = await MixEmitterContract.pendingMix(pid);
  //   const totalSupply = await MixContract.totalSupply();

  //   if (this.container.deleted !== true) {
  //     // this.burnableDisplay
  //     //   .empty()
  //     //   .appendText(
  //     //     `${CommonUtil.numberWithCommas(utils.formatEther(burnable))} MIX`
  //     //   );
  //     this.poolDisplay
  //       .empty()
  //       .appendText(
  //         `${CommonUtil.numberWithCommas(utils.formatEther(totalSupply))} MIX`
  //       );
  //   }
  // }

  public changeParams(params: ViewParams, uri: string): void {}

  public close(): void {
    this.container.delete();
  }
}
