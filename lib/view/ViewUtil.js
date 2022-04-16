"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skydapp_common_1 = require("skydapp-common");
class ViewUtil {
    go(uri) {
        skydapp_common_1.SkyRouter.go(uri);
        window.scrollTo(0, 0);
    }
    waitTransactionAndRefresh() {
        setTimeout(() => skydapp_common_1.SkyRouter.refresh(), 2000);
    }
}
exports.default = new ViewUtil();
//# sourceMappingURL=ViewUtil.js.map