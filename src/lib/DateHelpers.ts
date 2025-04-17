
export function getLocalTime(addHours: number = 0): Date {
    var now = new Date(); // uses local time
    console.debug('nd: ', now.toDateString());
    if (addHours > 0) {
        const hoursToAdd = addHours * 60 * 60 * 1000;
        now.setTime(now.getTime() + hoursToAdd);
        console.debug('nd+: ', now.toDateString());
    }
    return now;
}

export function formatDateAsISO(d: Date) {
    return `${d.getFullYear()}-${padNumWithZeros(d.getMonth() + 1)}-${padNumWithZeros(d.getDate())}`;
}
export function formatTimeAsISO(d: Date, removeMinutes:Boolean = true) {
    var hrs = d.getHours();
    var mins = (removeMinutes ? 0 : d.getMinutes());
    return `${padNumWithZeros(hrs)}:${padNumWithZeros(mins)}`;
}

const padNumWithZeros = (n: number, c: number = 2) => n.toString().padStart(c, '0');
