import { DateTime } from "luxon";

export type EventEntry = {
    id: number | undefined,
    name: string,
    description?: string,
    timezone: string,
    startDateTime: DateTime,
    endDateTime: DateTime
};
