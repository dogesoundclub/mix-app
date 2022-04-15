import { DomNode, el, Popup } from "skydapp-browser";

export default class Confirm extends Popup {

    public content: DomNode;

    constructor(
        title: string,
        message: string,
        confirmTitle: string,
        confirm: () => void,
    ) {
        super(".popup-background");
        this.append(
            this.content = el(".dialogue.confirm",
                el(".close-container", { click: () => this.delete(), },
                    el("img", { src: "/images/shared/icn/close.svg", alt: "close" }),
                ),
                el("h2", title),
                el("p", message),
                el(".button-container",
                    // el("button", "취소", {
                    //     click: () => this.delete(),
                    // }),
                    el("button", confirmTitle, {
                        click: () => {
                            confirm();
                            this.delete();
                        },
                    }),
                ),
            ),
        );
    }
}
