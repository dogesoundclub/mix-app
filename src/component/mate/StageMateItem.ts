import { DomNode, el } from "skydapp-browser";


export default class StageMateItem extends DomNode {

    private checkbox: DomNode<HTMLInputElement>;

    constructor(public id: number, public mix: number, public name: string) {
        super(".stage-mate-item");
        this.append(
            el("p.mix", `${mix}`),
            el("img", { src: `https://storage.googleapis.com/dsc-mate/336/dscMate-${id}.png`, alt: "mate-mock" }),
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
    }

    public deselect() {
        this.checkbox.domElement.checked = false;
    }
}
