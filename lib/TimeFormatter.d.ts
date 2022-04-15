import "moment/min/locales";
declare class TimeFormatter {
    private static readonly SUPPORTED_LANGS;
    lang: string;
    private setLocale;
    format(time: Date, timePattern: string): string;
    parse(str: string, timePattern: string): Date;
    fromNow(time: Date): string;
    get weekdayStrs(): string[];
    get weekdayFullStrs(): string[];
}
declare const _default: TimeFormatter;
export default _default;
//# sourceMappingURL=TimeFormatter.d.ts.map