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
                src: `https://storage.googleapis.com/dsc-mate/336/dscMate-${id}.png`,
                alt: "mate-mock",
                click: () => this.handleImageClick(stage, id, isDancing)
            })),
            el(".checkbox-container",
                (this.checkbox = el("input", {
                    type: "checkbox",
                    id: `mate${id}`,
                })),
                el("label", { for: `mate${id}` }, `#${id}`)
            )
        );
        if (isDancing) {
            this.appendProgressContainer(stage, id, isDancing);
        }
        this.setDancing();
        this.loadBar();
    }

    private handleImageClick(stage: Stage, id: number, isDancing: boolean) {
        // Implement your image click handling logic here
    }

    private appendProgressContainer(stage: Stage, id: number, isDancing: boolean) {
        // Implement your progress container appending logic here
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
