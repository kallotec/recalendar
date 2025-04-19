
export function getLocalTime(addHours: number = 0): Date {
    const now = new Date(); // uses local time
    if (addHours > 0) {
        const hoursToAdd = addHours * 60 * 60 * 1000;
        now.setTime(now.getTime() + hoursToAdd);
    }
    return now;
}

export function convertUtcToLocal(date_utc:string, time_utc:string):string {
    const year = +date_utc.substring(0,2);
    const month = +date_utc.substring(3,2);
    const day = +date_utc.substring(6,2);
    const hour = +time_utc.substring(0,2);
    const minute = +time_utc.substring(3,2);
    const d = new Date(Date.UTC(year, month-1, day, hour, minute, 0, 0));
    return formatDateAsISO(d) + " " + formatTimeAsISO(d, false);
}

export function convertLocalToUtc(date_local:string, time_local:string):string {
    const year = +date_local.substring(0,2);
    const month = +date_local.substring(3,2);
    const day = +date_local.substring(6,2);
    const hour = +time_local.substring(0,2);
    const minute = +time_local.substring(3,2);
    const d = new Date(year, month-1, day, hour, minute, 0, 0);
    return formatDateAsISO(d) + " " + formatTimeAsISO(d, false);
}

export function formatDateAsISO(d: Date) {
    return `${d.getFullYear()}-${padNumWithZeros(d.getMonth() + 1)}-${padNumWithZeros(d.getDate())}`;
}
export function formatTimeAsISO(d: Date, removeMinutes:Boolean = true) {
    const hrs = d.getHours();
    const mins = (removeMinutes ? 0 : d.getMinutes());
    return `${padNumWithZeros(hrs)}:${padNumWithZeros(mins)}`;
}

const padNumWithZeros = (n: number, c: number = 2) => n.toString().padStart(c, '0');
