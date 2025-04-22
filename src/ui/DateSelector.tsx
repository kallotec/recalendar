'use client';
import { DateTime } from 'luxon';

export type DateSelectorParams = {
    htmlName: string,
    selectedDate?: string,
    includeTimezoneField: boolean
}

export default function DateSelector(p: DateSelectorParams) {

    const d = DateTime.now();
    // if blank, default to local browser date
    const selectedDate = p.selectedDate ?? d.toISODate();
    const tz = d.zoneName;

    return (<>
        <input type="date" name={p.htmlName} defaultValue={selectedDate} />
        {p.includeTimezoneField && (
            <input type="hidden" name='timezone' defaultValue={tz} />
        )}
    </>)
}
