import { DomNode, el } from "skydapp-browser";
import BiasContract from "../../contracts/nft/BiasContract";

export default class StageBmcsItem extends DomNode {

    private checkbox: DomNode<HTMLInputElement>;
    private dancingDisplay: DomNode;
    private bar: DomNode;
    private imageDisplay: DomNode<HTMLImageElement>;

    constructor(public id: number, public mix: number, public name: string, public isDancing: boolean) {
        super(".stage-bmcs-item");
        this.append(
            this.dancingDisplay = el(".dancing-container"),
            el(".progress-container",
                {
                    click: () => {
                        if (this.checkbox.domElement.checked) {
                            this.imageDisplay.style({
                                border: "none"
                            });
                            this.checkbox.domElement.checked = false;
                        } else {
                            this.imageDisplay.style({
                                border: "5px solid red"
                            });
                            this.checkbox.domElement.checked = true;
                        }
                    },
                },
                el(".progress",
                    this.bar = el(".bar"),
                ),
                el(".title", "MIX 수령까지 남은 Block"),
                el("p", "1,296,000"),
            ),
            this.imageDisplay = el("img", { src: "", alt: "mate-mock" }),
            el(".checkbox-container",
                this.checkbox = el("input", { type: "checkbox", id: `mate${id}` }, {
                    change: () => {
                        this.fireEvent(this.checkbox.domElement.checked === true ? "selected" : "deselected");
                        if (this.checkbox.domElement.checked) {
                            this.imageDisplay.style({
                                border: "5px solid red"
                            });
                        } else {
                            this.imageDisplay.style({
                                border: "none"
                            });
                        }
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
        this.loadBar();
    }

    public loadBar() {
        this.bar.style({
            width: `${100}%`,
        });
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
