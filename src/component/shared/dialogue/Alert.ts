import { DomNode, el, Popup } from "@hanul/skynode";

export default class Alert extends Popup {

    public content: DomNode;

    constructor(
        message: string,
        confirmTitle?: string,
    ) {
        super(".popup-background");
        this.append(
            this.content = el(".dialogue.alert",
                el(".close-container", { click: () => this.delete(), },
                    el("img", { src: "/images/shared/icn/close.svg", alt: "close" }),
                ),
                el("p", message),
                el(".button-container",
                    el("button", confirmTitle === undefined ? "확인" : confirmTitle, {
                        click: () => this.delete(),
                    }),
                ),
            ),
        );
    }
}
