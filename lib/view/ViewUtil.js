"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp-common_1 = require("skydapp-common");
class ViewUtil {
    go(uri) {
        skydapp-common_1.skydapp-common.go(uri);
        window.scrollTo(0, 0);
    }
    waitTransactionAndRefresh() {
        setTimeout(() => skydapp-common_1.skydapp-common.refresh(), 2000);
    }
}
exports.default = new ViewUtil();
//# sourceMappingURL=ViewUtil.js.map