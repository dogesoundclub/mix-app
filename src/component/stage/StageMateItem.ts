import { DomNode, el } from "skydapp-browser";


export default class StageMateItem extends DomNode {

    private checkbox: DomNode<HTMLInputElement>;
    private dancingDisplay: DomNode;
    private bar: DomNode | undefined;
    private imageDisplay: DomNode;

    constructor(public id: number, public mix: number, public name: string, public isDancing: boolean) {
        super(".stage-mate-item");
        this.append(
            this.dancingDisplay = el(".dancing-container"),
            isDancing === true ? el(".progress-container", {
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
                el(".title", "MIX 되찾기까지 남은 Block"),
                el("p", "1,296,000"),
            ) : undefined,
            this.imageDisplay = el("img", {
                src: `https://storage.googleapis.com/dsc-mate/336/dscMate-${id}.png`, alt: "mate-mock",
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
            }),
            el(".checkbox-container",
                this.checkbox = el("input", {
                    type: "checkbox", id: `mate${id}`,
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
                el("label", { for: `mate${id}` }),
                el("p", `#${id} ${name}`),
            ),
        );
        this.setDanding();
        this.loadBar();
    }

    public loadBar() {

        this.bar?.style({
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
