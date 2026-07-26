export function formatDate(value) {
    if (!value) return "";

    const text = String(value);
    const dateMatch = text.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) return dateMatch[1];

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return text;

    return date.toISOString().slice(0, 10);
}
