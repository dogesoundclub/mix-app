import moment from "moment";
import "moment/min/locales";

class TimeFormatter {

    private static readonly SUPPORTED_LANGS = [
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

    // 기본 언어는 한국어
    public lang = "ko";

    private setLocale() {
        let acceptableLang = this.lang.toLowerCase();
        if (TimeFormatter.SUPPORTED_LANGS.includes(acceptableLang) !== true) {
            acceptableLang = acceptableLang.substring(0, 2);
            if (TimeFormatter.SUPPORTED_LANGS.includes(acceptableLang) !== true) {
                acceptableLang = "ko";
            }
        }
        moment.locale(acceptableLang);
    }

    public format(time: Date, timePattern: string) {
        if (typeof time === "string") {
            time = new Date(parseInt(time, 10));
        }
        this.setLocale();
        return moment(time).format(timePattern);
    }

    public parse(str: string, timePattern: string) {
        this.setLocale();
        return moment(str, timePattern).toDate();
    }

    public fromNow(time: Date) {
        this.setLocale();
        return moment(time).fromNow();
    }

    public get weekdayStrs() {
        return moment.weekdaysShort();
    }

    public get weekdayFullStrs() {
        return moment.weekdays();
    }
}

export default new TimeFormatter();
