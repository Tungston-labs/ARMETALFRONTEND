
const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const toDisplayDate = (d, m, y) => {
    const month = MONTHS[Number(m) - 1];
    return month ? `${String(Number(d)).padStart(2, "0")} ${month} ${y}` : "";
};

export const formatDate = (value) => {
    if (!value) return "";

    if (value instanceof Date) {
        return Number.isNaN(value.getTime())
            ? ""
            : toDisplayDate(value.getDate(), value.getMonth() + 1, value.getFullYear());
    }

    const str = String(value).trim();
    let m = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) return toDisplayDate(m[3], m[2], m[1]);

    m = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (m) return toDisplayDate(m[1], m[2], m[3]);

    const parsed = new Date(str);
    if (!Number.isNaN(parsed.getTime())) {
        return toDisplayDate(parsed.getDate(), parsed.getMonth() + 1, parsed.getFullYear());
    }

    return str;
};