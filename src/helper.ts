
export function transformSelect(select: string[]): {[key: string]: any} {
    const res = {};
    for (const field of select) {
        let plc = res;
        let i = 0;
        const fields = field.split('.');
        for (const key of fields) {
            if (i === fields.length-1) {
                plc[key] = 1;
                break;
            }
            plc[key] = plc[key] || {};
            plc = plc[key];
            i++;
        }
    }
    return res;
}
