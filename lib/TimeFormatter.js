"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
require("moment/min/locales");
class TimeFormatter {
    constructor() {
        this.lang = "ko";
    }
    setLocale() {
        let acceptableLang = this.lang.toLowerCase();
        if (TimeFormatter.SUPPORTED_LANGS.includes(acceptableLang) !== true) {
            acceptableLang = acceptableLang.substring(0, 2);
            if (TimeFormatter.SUPPORTED_LANGS.includes(acceptableLang) !== true) {
                acceptableLang = "ko";
            }
        }
        moment_1.default.locale(acceptableLang);
    }
    format(time, timePattern) {
        if (typeof time === "string") {
            time = new Date(parseInt(time, 10));
        }
        this.setLocale();
        return (0, moment_1.default)(time).format(timePattern);
    }
    parse(str, timePattern) {
        this.setLocale();
        return (0, moment_1.default)(str, timePattern).toDate();
    }
    fromNow(time) {
        this.setLocale();
        return (0, moment_1.default)(time).fromNow();
    }
    get weekdayStrs() {
        return moment_1.default.weekdaysShort();
    }
    get weekdayFullStrs() {
        return moment_1.default.weekdays();
    }
}
TimeFormatter.SUPPORTED_LANGS = [
    "af",
    "ar-dz",
    "ar-kw",
    "ar-ly",
    "ar-ma",
    "ar-sa",
    "ar-tn",
    "ar",
    "az",
    "be",
    "bg",
    "bm",
    "bn",
    "bo",
    "br",
    "bs",
    "ca",
    "cs",
    "cv",
    "cy",
    "da",
    "de-at",
    "de-ch",
    "de",
    "dv",
    "el",
    "en-au",
    "en-ca",
    "en-gb",
    "en-ie",
    "en-il",
    "en-nz",
    "en-SG",
    "eo",
    "es-do",
    "es-us",
    "es",
    "et",
    "eu",
    "fa",
    "fi",
    "fo",
    "fr-ca",
    "fr-ch",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gom-latn",
    "gu",
    "he",
    "hi",
    "hr",
    "hu",
    "hy-am",
    "id",
    "is",
    "it-ch",
    "it",
    "ja",
    "jv",
    "ka",
    "kk",
    "km",
    "kn",
    "ko",
    "ku",
    "ky",
    "lb",
    "lo",
    "lt",
    "lv",
    "me",
    "mi",
    "mk",
    "ml",
    "mn",
    "mr",
    "ms-my",
    "ms",
    "mt",
    "my",
    "nb",
    "ne",
    "nl-be",
    "nl",
    "nn",
    "pa-in",
    "pl",
    "pt-br",
    "pt",
    "ro",
    "ru",
    "sd",
    "se",
    "si",
    "sk",
    "sl",
    "sq",
    "sr-cyrl",
    "sr",
    "ss",
    "sv",
    "sw",
    "ta",
    "te",
    "tet",
    "tg",
    "th",
    "tl-ph",
    "tlh",
    "tr",
    "tzl",
    "tzm-latn",
    "tzm",
    "ug-cn",
    "uk",
    "ur",
    "uz-latn",
    "uz",
    "vi",
    "x-pseudo",
    "yo",
    "zh-cn",
    "zh-hk",
    "zh-tw",
];
exports.default = new TimeFormatter();
//# sourceMappingURL=TimeFormatter.js.map