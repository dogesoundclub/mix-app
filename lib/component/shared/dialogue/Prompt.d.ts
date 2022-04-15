import { DomNode, Popup } from "skydapp-browser";
export default class Prompt extends Popup {
    content: DomNode;
    private input;
    constructor(title: string, message: string, confirmTitle: string, confirm: (value: string) => void);
}
//# sourceMappingURL=Prompt.d.ts.map