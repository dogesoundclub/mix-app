import { DomNode, el, msg } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import Confirm from "../../component/shared/dialogue/Confirm";
import TurntableExtrasContract from "../../contracts/turntable/TurntableExtrasContract";
import TurntablesContract from "../../contracts/turntable/TurntablesContract";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class Update implements View {

    private container: DomNode;
    private nameInput: DomNode<HTMLInputElement>;
    private descriptionTextarea: DomNode<HTMLInputElement>;
    private bgmInput: DomNode<HTMLInputElement>;
    private twitterInput: DomNode<HTMLInputElement>;
    private kakaotalkInput: DomNode<HTMLInputElement>;

    constructor(params: ViewParams) {
        const turntableId = parseInt(params.id as string, 10);
        Layout.current.title = msg("TURNTABLE_UPDATE_TITLE");
        Layout.current.content.append(this.container = el(".update-turntable-view",
            el("h1", msg("TURNTABLE_UPDATE_TITLE")),
            el("a.back-button", msg("TURNTABLE_UPDATE_BACK_BUTTON"), {
                click: () => ViewUtil.go(`/turntable/${turntableId}`),
            }),
            el(".form",
                el("label",
                    el("h4", msg("TURNTABLE_UPDATE_TITLE1")),
                    this.nameInput = el("input", { placeholder: msg("TURNTABLE_UPDATE_INPUT1") }),
                ),
                el("label",
                    el("h4", msg("TURNTABLE_UPDATE_TITLE2")),
                    this.descriptionTextarea = el("textarea", { placeholder: msg("TURNTABLE_UPDATE_INPUT2") }),
                ),
                el("label",
                    el("h4", msg("TURNTABLE_UPDATE_TITLE3")),
                    this.bgmInput = el("input", { placeholder: msg("TURNTABLE_UPDATE_INPUT3") }),
                ),
                el("label",
                    el("h4", msg("TURNTABLE_UPDATE_TITLE4")),
                    this.twitterInput = el("input", { type: "url", placeholder: msg("TURNTABLE_UPDATE_INPUT4") }),
                ),
                el("label",
                    el("h4", msg("TURNTABLE_UPDATE_TITLE5")),
                    this.kakaotalkInput = el("input", { type: "url", placeholder: msg("TURNTABLE_UPDATE_INPUT5") }),
                ),
                el("button.save-button", msg("TURNTABLE_UPDATE_BUTTON1"), {
                    click: async () => {
                        const extra = {
                            name: this.nameInput.domElement.value,
                            description: this.descriptionTextarea.domElement.value,
                            bgm: this.bgmInput.domElement.value,
                            twitter: this.twitterInput.domElement.value,
                            kakaotalk: this.kakaotalkInput.domElement.value,
                        };
                        await TurntableExtrasContract.set(turntableId, JSON.stringify(extra));
                        setTimeout(() => ViewUtil.go(`/turntable/${turntableId}`), 2000);
                    },
                }),
                el("button.destroy-button", msg("TURNTABLE_UPDATE_BUTTON2"), {
                    click: () => {
                        new Confirm(msg("TURNTABLE_UPDATE_CONFIRM_TITLE"), msg("TURNTABLE_UPDATE_CONFIRM_DESC"), msg("TURNTABLE_UPDATE_CONFIRM_BUTTON"), async () => {
                            await TurntablesContract.destroy(turntableId);
                            setTimeout(() => ViewUtil.go("/turntable"), 2000);
                        });
                    },
                }),
            ),
        ));
        this.load(turntableId);
    }

    private async load(turntableId: number) {
        const extra = await TurntableExtrasContract.extras(turntableId);
        if (extra.trim() !== "") {
            let data: any = {};
            try { data = JSON.parse(extra); } catch (e) { console.error(e); }

            this.nameInput.domElement.value = data.name === undefined ? "" : data.name;
            this.descriptionTextarea.domElement.value = data.description === undefined ? "" : data.description;
            this.bgmInput.domElement.value = data.bgm === undefined ? "" : data.bgm;
            this.kakaotalkInput.domElement.value = data.kakaotalk === undefined ? "" : data.kakaotalk;
            this.twitterInput.domElement.value = data.twitter === undefined ? "" : data.twitter;
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}
