class Utils {

    public undefinedToZero(numb: number | undefined) {
        if (numb === undefined) {
            return 0;
        } else {
            return numb;
        }
    }
}

export default new Utils();
