export function nestObject(obj: string[] | { [key: string]: any }): { [key: string]: any } {
    const res: { [key: string]: any } = {};
    const isArray = Array.isArray(obj);
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        const value = isArray ? 1 : obj[key];
        const fields = (isArray ? obj[key] : key).split('.');
        let plc = res;
        let i = 0;
        for (const field of fields) {
            if (i === fields.length - 1) {
                plc[field] = value;
                break;
            }
            plc[field] = plc[field] || {};
            plc = plc[field];
            i++;
        }
    }

    return res;
}
