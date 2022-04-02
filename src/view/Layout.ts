import { BodyNode, DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";
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
                        el("a", { click: () => ViewUtil.go("/") },
                            el(".logo",
                                el("img", { src: "/images/shared/logo/mix-text.svg" }),
                            ),
                        ),
                        el(".right",
                            new PCMenu(),
                            new UserInfo(),
                            el("a.menu-button", el("i.fas.fa-bars"), {
                                click: (event, button) => {
                                    const rect = button.rect;
                                    new MobileMenu({ left: rect.right - 170, top: rect.bottom }).appendTo(BodyNode);
                                },
                            })
                        ),
                    )),
                el("main", (this.content = el(".content"))),
                el("footer",
                    el(".sidebar",
                        el(".content",
                            el(".term",
                                // el("a", "서비스이용약관"),
                                // el("span", "|"),
                                // el("a", "개인정보처리방침"),
                                // el("span", "|"),
                                // el("a", "회사소개"),
                            ),
                            el(".social",
                                el("img", { src: "/images/shared/icn/linktree.svg" }),
                                el("a", "링크트리 바로가기", {
                                    href: "https://linktr.ee/dogesoundclub",
                                    target: "_blank",
                                }),
                            ),
                        ),
                    ),
                    el(".provider",
                        el("p", "주식회사 디에스씨레이블 | 대표이사 :권태홍 | 사업자번호 :838-86-02498 | 개인정보보호책임자:권태홍\n주소: 대전광역시 유성구 대학로 82, 5층 505호 | mix-works@ayias.io",),
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