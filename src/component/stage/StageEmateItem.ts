import { DomNode, el } from "skydapp-browser";


export default class StageEmateItem extends DomNode {

    private checkbox: DomNode<HTMLInputElement>;
    private dancingDisplay: DomNode;
    private bar: DomNode;

    constructor(public id: number, public mix: number, public name: string, public isDancing: boolean) {
        super(".stage-emate-item");
        this.append(
            this.dancingDisplay = el(".dancing-container"),
            el(".progress-container",
                el(".progress",
                    this.bar = el(".bar"),
                ),
                el(".title", "MIX 되찾기까지 남은 Block"),
                el("p", "1,296,000"),
            ),
            el("img", { src: `https://storage.googleapis.com/emates/klaytn/Emates-${id}.png`, alt: "mate-mock" }),
            el(".checkbox-container",
                this.checkbox = el("input", { type: "checkbox", id: `mate${id}` }, {
                    change: () => {
                        this.fireEvent(this.checkbox.domElement.checked === true ? "selected" : "deselected");
                    },
                }),
                el("label", { for: `mate${id}` }),
                el("p", `#${id} ${name}`),
            ),
        );
        this.setDanding();
        this.loadBar();
    }

    public loadBar() {
        this.bar.style({
            width: `${100}%`,
        });
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
