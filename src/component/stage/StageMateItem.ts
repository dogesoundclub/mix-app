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
            (this.imageDisplay = el("img", {
                src: `https://api.dogesound.club/mate/images/dscMate-${id}.png`,
                alt: "mate-mock",
                click: () => this.handleImageClick(stage, id, isDancing)
            })),
            el(".checkbox-container",
                el(".checkbox-label-container",
                    (this.checkbox = el("input", {
                        type: "checkbox",
                        id: `mate${id}`,
                    })),
                    el("label", { for: `mate${id}` }),
                    el("span", `#${id}`) // 메이트 번호를 `span`으로 변경
                )
            )
        );
        if (isDancing) {
            this.appendProgressContainer(stage, id, isDancing);
        }
        this.setDancing();
        this.loadBar();
    }
    

    private handleImageClick(stage: Stage, id: number, isDancing: boolean) {
      // 먼저, 춤추는 상태일 때만 진행률을 계산합니다.
      if (isDancing) {
          const percent = ((this.currentBlock - this.stakingBlock) / this.returnMixTimes) * 100;
          // 진행률이 100% 미만이면 Alert를 표시하고 함수를 종료합니다.
          if (percent < 100) {
              new Alert("해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.\n전 아직 춤추고 싶어요!");
              return;
          }
      }
  
      // 체크박스 상태를 토글합니다.
      const isChecked = this.checkbox.domElement.checked;
      this.checkbox.domElement.checked = !isChecked;
      this.imageDisplay.style({
          border: !isChecked ? "5px solid red" : "none",
      });
  
      // 춤추고 있거나 춤추고 있지 않은 상태에 따라 스테이지의 select 또는 deselect 메서드를 호출합니다.
      if (!isChecked) {
          if (isDancing) {
              stage.selectStaking(MateContract.address, id);
          } else {
              stage.selectUnstaking(MateContract.address, id);
          }
      } else {
          if (isDancing) {
              stage.deselectStaking(MateContract.address, id);
          } else {
              stage.deselectUnstaking(MateContract.address, id);
          }
      }
  }  

  private appendProgressContainer(stage: Stage, id: number, isDancing: boolean) {
    if (!isDancing) {
        return; // 춤추지 않는 경우, 이 함수에서는 아무 작업도 수행하지 않습니다.
    }

    // 진행률 컨테이너를 추가합니다. 클릭 이벤트 핸들러도 설정합니다.
    const progressContainer = el(".progress-container", {
        click: async () => {
            const percent = ((this.currentBlock - this.stakingBlock) / this.returnMixTimes) * 100;
            if (percent < 100) {
                new Alert("해당 클럽메이트의 믹스는 아직 되찾을 수 없습니다.\n전 아직 춤추고 싶어요!");
                return;
            }
            // 체크박스 상태를 토글합니다.
            this.checkbox.domElement.checked = !this.checkbox.domElement.checked;
            // 선택된 상태에 따라 이미지 스타일을 조정합니다.
            this.imageDisplay.style({ border: this.checkbox.domElement.checked ? "5px solid red" : "none" });
            // 선택 또는 선택 해제 동작을 수행합니다.
            if (this.checkbox.domElement.checked) {
                stage.selectStaking(MateContract.address, id);
            } else {
                stage.deselectStaking(MateContract.address, id);
            }
        }
    }, 
    el(".progress-title", "MIX 되찾기까지 남은 Block"),
    el(".progress", (this.bar = el(".bar"))),
    (this.remains = el(".progress-remains", ""))
    );

    // 생성한 진행률 컨테이너를 DOM 노드에 추가합니다.
    this.append(progressContainer);
}

    public stakingBlock: number = 0;
    public returnMixTimes: number = 0;

    public async loadBar() {
        this.stakingBlock = (await MixStakingContract.stakingBlocks(MateContract.address, this.id)).toNumber();
        this.returnMixTimes = (await MixStakingContract.returnMixTimes(MateContract.address, this.id)).toNumber();

        const percent = ((this.currentBlock - this.stakingBlock) / this.returnMixTimes) * 100;
        this.bar?.style({ width: `${percent > 100 ? 100 : percent}%` });
        this.remains?.empty().appendText(CommonUtil.numberWithCommas(String(this.stakingBlock + this.returnMixTimes - this.currentBlock)));
    }

    public async setDancing() {
        if (this.isDancing) {
            const mix = utils.formatEther(await MixStakingContract.stakingAmounts(MateContract.address, this.id));
            this.dancingDisplay.append(
                el("img", {
                    src: "/images/shared/img/stage-background.gif",
                    alt: "dancing",
                }),
                el("p.mix", `${parseFloat(mix).toFixed(1)} MIX`)
            );
        }
    }

    public deselect() {
        this.checkbox.domElement.checked = false;
        this.imageDisplay.style({ border: "none" });
    }
}
