const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute",60]
]

export function formatRelativeTime(iso: string): string{
    const diffSeconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    for (const [unit, seconds] of UNITS) {
        if (Math.abs(diffSeconds) >= seconds) {
            return rtf.format(Math.round(diffSeconds / seconds), unit);
        }
    }

    return "just now";
}