import { DomNode, el, Popup } from "skydapp-browser";

export default class Prompt extends Popup {

    public content: DomNode;
    private input: DomNode<HTMLInputElement>;

    constructor(
        title: string,
        message: string,
        confirmTitle: string,
        confirm: (value: string) => void,
    ) {
        super(".popup-background");
        this.append(
            this.content = el(".dialogue.prompt",
                el(".close-container", { click: () => this.delete(), },
                    el("img", { src: "/images/shared/icn/close.svg", alt: "close" }),
                ),
                el("h2", title),
                el("p", message),
                el(".input-container",
                    this.input = el("input"),
                ),
                el(".button-container",
                    el("button.left", "취소", {
                        click: () => this.delete(),
                    }),
                    el("button.right", confirmTitle, {
                        click: () => {
                            confirm(this.input.domElement.value);
                            this.delete();
                        },
                    }),
                ),
            ),
        );
    }
}
