import { DomNode, el } from "skydapp-browser";
import BiasContract from "../../contracts/nft/BiasContract";

export default class StageBmcsItem extends DomNode {

    private checkbox: DomNode<HTMLInputElement>;
    private dancingDisplay: DomNode;

    private imageDisplay: DomNode<HTMLImageElement>;

    constructor(public id: number, public mix: number, public name: string, public isDancing: boolean) {
        super(".stage-bmcs-item");
        this.append(
            this.dancingDisplay = el(".dancing-container"),
            this.imageDisplay = el("img", { src: "", alt: "mate-mock" }),
            el(".checkbox-container",
                this.checkbox = el("input", { type: "checkbox", id: `mate${id}` }, {
                    change: () => {
                        this.fireEvent(this.checkbox.domElement.checked === true ? "selected" : "deselected");
                    },
                }),
                el("label", { for: `BMCS${id}` }),
                el("p", `#${id} ${name}`),
            ),
        );
        this.init();
    }

    public async init() {
        this.loadImage();
        this.setDanding();
    }

    public async loadImage() {
        const uri = await BiasContract.tokenURI(this.id);
        const metadata = await (await fetch(uri)).json();

        this.imageDisplay.domElement.src = metadata.image;
    }

    public setDanding() {
        if (this.isDancing) {
            this.dancingDisplay.append(
                el("img", { src: "/images/shared/img/stage-background.gif", alt: "daning" }),
                el("p.mix", `${this.mix}`),
            )
        }
    }

    public deselect() {
        this.checkbox.domElement.checked = false;
    }
}
