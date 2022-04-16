"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_browser_1 = require("skydapp-browser");
const Confirm_1 = __importDefault(require("../../component/shared/dialogue/Confirm"));
const TurntableExtrasContract_1 = __importDefault(require("../../contracts/turntable/TurntableExtrasContract"));
const TurntablesContract_1 = __importDefault(require("../../contracts/turntable/TurntablesContract"));
const Layout_1 = __importDefault(require("../Layout"));
const ViewUtil_1 = __importDefault(require("../ViewUtil"));
class Update {
    constructor(params) {
        const turntableId = parseInt(params.id, 10);
        Layout_1.default.current.title = (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE");
        Layout_1.default.current.content.append(this.container = (0, skydapp_browser_1.el)(".update-turntable-view", (0, skydapp_browser_1.el)("h1", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE")), (0, skydapp_browser_1.el)("a.back-button", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_BACK_BUTTON"), {
            click: () => ViewUtil_1.default.go(`/turntable/${turntableId}`),
        }), (0, skydapp_browser_1.el)(".form", (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("h4", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE1")), this.nameInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_INPUT1") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("h4", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE2")), this.descriptionTextarea = (0, skydapp_browser_1.el)("textarea", { placeholder: (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_INPUT2") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("h4", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE3")), this.bgmInput = (0, skydapp_browser_1.el)("input", { placeholder: (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_INPUT3") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("h4", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE4")), this.twitterInput = (0, skydapp_browser_1.el)("input", { type: "url", placeholder: (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_INPUT4") })), (0, skydapp_browser_1.el)("label", (0, skydapp_browser_1.el)("h4", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_TITLE5")), this.kakaotalkInput = (0, skydapp_browser_1.el)("input", { type: "url", placeholder: (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_INPUT5") })), (0, skydapp_browser_1.el)("button.save-button", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_BUTTON1"), {
            click: async () => {
                const extra = {
                    name: this.nameInput.domElement.value,
                    description: this.descriptionTextarea.domElement.value,
                    bgm: this.bgmInput.domElement.value,
                    twitter: this.twitterInput.domElement.value,
                    kakaotalk: this.kakaotalkInput.domElement.value,
                };
                await TurntableExtrasContract_1.default.set(turntableId, JSON.stringify(extra));
                setTimeout(() => ViewUtil_1.default.go(`/turntable/${turntableId}`), 2000);
            },
        }), (0, skydapp_browser_1.el)("button.destroy-button", (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_BUTTON2"), {
            click: () => {
                new Confirm_1.default((0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_CONFIRM_TITLE"), (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_CONFIRM_DESC"), (0, skydapp_browser_1.msg)("TURNTABLE_UPDATE_CONFIRM_BUTTON"), async () => {
                    await TurntablesContract_1.default.destroy(turntableId);
                    setTimeout(() => ViewUtil_1.default.go("/turntable"), 2000);
                });
            },
        }))));
        this.load(turntableId);
    }
    async load(turntableId) {
        const extra = await TurntableExtrasContract_1.default.extras(turntableId);
        if (extra.trim() !== "") {
            let data = {};
            try {
                data = JSON.parse(extra);
            }
            catch (e) {
                console.error(e);
            }
            this.nameInput.domElement.value = data.name === undefined ? "" : data.name;
            this.descriptionTextarea.domElement.value = data.description === undefined ? "" : data.description;
            this.bgmInput.domElement.value = data.bgm === undefined ? "" : data.bgm;
            this.kakaotalkInput.domElement.value = data.kakaotalk === undefined ? "" : data.kakaotalk;
            this.twitterInput.domElement.value = data.twitter === undefined ? "" : data.twitter;
        }
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Update;
//# sourceMappingURL=Update.js.map