'use server';
import { Upsert } from "@/data/eventsRepo";
import { parseIsoLocalDateAndTime } from "@/lib/dateConversion";
import { EventEntry } from "@/lib/models";
import { redirect } from "next/navigation";

export type formSubmitState = {
    error: string
};

export async function editFormSubmit(prevState: formSubmitState, d: FormData): Promise<formSubmitState> {

    let dateToRedirectTo = '';
    try {
        const idStr = (d.get('id') as string);
        const tz = d.get('timezone') as string;
        const model: EventEntry = {
            id: (idStr?.length > 0 ? +idStr : undefined),
            name: d.get('name') as string,
            description: d.get('description') as string,
            timezone: tz,
            startDateTime: parseIsoLocalDateAndTime(
                d.get('startDateIso') as string,
                d.get('startTimeIso') as string,
                tz),
            endDateTime: parseIsoLocalDateAndTime(
                d.get('endDateIso') as string,
                d.get('endTimeIso') as string,
                tz)
        };

        // validate (if more complicated, switch to using a framework like Yup or Zod)
        var nameSpecified = (model.name?.length > 0);
        if (!nameSpecified) {
            return { error: 'Name must be supplied' };
        }
        var startDateBeforeEndDate = (model.startDateTime < model.endDateTime);
        if (!startDateBeforeEndDate) {
            return { error: 'Start date must be before end date' };
        }

        // save to db
        await Upsert(model);

        // set redirect
        dateToRedirectTo = model.startDateTime.toISODate()!;

        return { error: '' };

    } catch (e) {
        console.error('Error!', e);
        return {
            error: 'Error processing request'
        };
    } finally {
        if (dateToRedirectTo) {
            // go back to event list for this event's start date
            redirect(`/?d=${dateToRedirectTo}`);
        }
    }
}