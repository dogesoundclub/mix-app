import { utils } from "ethers";
import { DomNode, el } from "skydapp-browser";
import CommonUtil from "../../CommonUtil";
import MixStakingContract from "../../contracts/mix/MixStakingContract";
import MateContract from "../../contracts/nft/MateContract";
import Stage from "../../view/Stage";
import Alert from "../shared/dialogue/Alert";

export default class StageMateItem extends DomNode {
  private checkbox: DomNode<HTMLInputElement>;
  private dancingDisplay: DomNode;
  private bar: DomNode | undefined;
  private remains: DomNode | undefined;
  private imageDisplay: DomNode;

  constructor(
    stage: Stage,
    public id: number,
    public name: string,
    private currentBlock: number,
    public isDancing: boolean
  ) {
    super(".stage-mate-item");
    this.append(
      (this.dancingDisplay = el(".dancing-container")),
      isDancing === true
        ? el(
            ".progress-container",
            {
              click: () => {
                if (isDancing === true) {
                  const percent =
                    ((this.currentBlock - this.stakingBlock) /
                      this.returnMixTimes) *
                    100;
                  if (percent < 100) {
                    new Alert(
                      "해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.\n전 아직 춤추고 싶어요!"
                    );
                    return;
                  }
                }
                if (this.checkbox.domElement.checked) {
                  this.imageDisplay.style({
                    border: "none",
                  });
                  this.checkbox.domElement.checked = false;
                  if (isDancing === true) {
                    stage.deselectStaking(MateContract.address, id);
                  } else {
                    stage.deselectUnstaking(MateContract.address, id);
                  }
                } else {
                  this.imageDisplay.style({
                    border: "5px solid red",
                  });
                  this.checkbox.domElement.checked = true;
                  if (isDancing === true) {
                    stage.selectStaking(MateContract.address, id);
                  } else {
                    stage.selectUnstaking(MateContract.address, id);
                  }
                }
              },
            },
            el(".progress", (this.bar = el(".bar"))),
            el(".title", "MIX 되찾기까지 남은 Block"),
            (this.remains = el("p", ""))
          )
        : undefined,
      (this.imageDisplay = el("img", {
        src: `https://storage.googleapis.com/dsc-mate/336/dscMate-${id}.png`,
        alt: "mate-mock",
        click: () => {
          if (isDancing === true) {
            const percent =
              ((this.currentBlock - this.stakingBlock) / this.returnMixTimes) *
              100;
            if (percent < 100) {
              new Alert(
                "해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.\n전 아직 춤추고 싶어요!"
              );
              return;
            }
          }
          if (this.checkbox.domElement.checked) {
            this.imageDisplay.style({
              border: "none",
            });
            this.checkbox.domElement.checked = false;
            if (isDancing === true) {
              stage.deselectStaking(MateContract.address, id);
            } else {
              stage.deselectUnstaking(MateContract.address, id);
            }
          } else {
            this.imageDisplay.style({
              border: "5px solid red",
            });
            this.checkbox.domElement.checked = true;
            if (isDancing === true) {
              stage.selectStaking(MateContract.address, id);
            } else {
              stage.selectUnstaking(MateContract.address, id);
            }
          }
        },
      })),
      el(
        ".checkbox-container",
        (this.checkbox = el("input", {
          type: "checkbox",
          id: `mate${id}`,
          change: () => {
            if (isDancing === true) {
              const percent =
                ((this.currentBlock - this.stakingBlock) /
                  this.returnMixTimes) *
                100;
              if (percent < 100) {
                new Alert(
                  "해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.\n전 아직 춤추고 싶어요!"
                );
                this.checkbox.domElement.checked =
                  !this.checkbox.domElement.checked;
                return;
              }
            }
            this.fireEvent(
              this.checkbox.domElement.checked === true
                ? "selected"
                : "deselected"
            );
            if (this.checkbox.domElement.checked) {
              this.imageDisplay.style({
                border: "5px solid red",
              });
              if (isDancing === true) {
                stage.selectStaking(MateContract.address, id);
              } else {
                stage.selectUnstaking(MateContract.address, id);
              }
            } else {
              this.imageDisplay.style({
                border: "none",
              });
              if (isDancing === true) {
                stage.deselectStaking(MateContract.address, id);
              } else {
                stage.deselectUnstaking(MateContract.address, id);
              }
            }
          },
        })),
        el("label", { for: `mate${id}` }),
        el("p", `#${id} ${name}`)
      )
    );
    this.setDanding();
    this.loadBar();
  }

  public stakingBlock: number = 0;
  public returnMixTimes: number = 0;

  public async loadBar() {
    this.stakingBlock = (
      await MixStakingContract.stakingBlocks(MateContract.address, this.id)
    ).toNumber();
    this.returnMixTimes = (
      await MixStakingContract.returnMixTimes(MateContract.address, this.id)
    ).toNumber();

    const percent =
      ((this.currentBlock - this.stakingBlock) / this.returnMixTimes) * 100;
    this.bar?.style({ width: `${percent > 100 ? 100 : percent}%` });
    this.remains
      ?.empty()
      .appendText(
        CommonUtil.numberWithCommas(
          String(this.stakingBlock + this.returnMixTimes - this.currentBlock)
        )
      );
  }

  public async setDanding() {
    if (this.isDancing) {
      const mix = utils.formatEther(
        await MixStakingContract.stakingAmounts(MateContract.address, this.id)
      );
      this.dancingDisplay.append(
        el("img", {
          src: "/images/shared/img/stage-background.gif",
          alt: "daning",
        }),
        el("p.mix", `${parseFloat(mix).toFixed(1)}`)
      );
    }
  }

  public deselect() {
    this.checkbox.domElement.checked = false;
  }
}
