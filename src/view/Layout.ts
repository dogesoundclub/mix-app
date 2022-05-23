import { BodyNode, DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import MobileMenu from "../component/shared/menu/MobileMenu";
import PCMenu from "../component/shared/menu/PCMenu";
import UserInfo from "../component/shared/menu/UserInfo";
import ViewUtil from "./ViewUtil";

export default class Layout implements View {

    public static current: Layout;
    private container: DomNode;
    public content: DomNode;

    constructor() {
        Layout.current = this;
        BodyNode.append(
            (this.container = el(".layout",
                el("header",
                    el(".nav",
                        el("a.menu-button", el("img", { src: "/images/shared/icn/menu.svg" }), {
                            click: (event, button) => {
                                const rect = button.rect;
                                new MobileMenu({ left: 0, top: rect.bottom }).appendTo(BodyNode);
                            },
                        }),
                        el("a", { click: () => ViewUtil.go("/") },
                            el(".logo",
                                el("img", { src: "/images/shared/logo/mix-text.svg" }),
                            ),
                        ),
                        el(".right",
                            new PCMenu(),
                            new UserInfo(),
                        ),
                    )),
                el("main", (this.content = el(".content"))),
                el("footer",
                    el(".sidebar",
                        el(".content",
                            el(".term",
                                el("a", { href: "/terms" }, "서비스이용약관"),
                                el("a", "support@ayias.io"),
                                // el("a", "개인정보처리방침"),
                                // el("a", "회사소개"),
                            ),
                            el(".social",
                                el("a", "링크트리 바로가기", {
                                    href: "https://linktr.ee/dogesoundclub",
                                    target: "_blank",
                                }),
                            ),
                        ),
                    ),
                    el(".provider",
                        el("h6", "DSC LABEL Inc."),
                        el("p", msg("FOOTER_DESC")),
                        el("p", "Copyright @2021 DSCLabel Inc. ALL RIGHTS RESERVED.")
                    ),
                ),
            ))
        );
    }

    public set title(title: string) {
        document.title = `${title} | Mix`;
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}