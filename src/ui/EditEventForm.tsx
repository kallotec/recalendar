import { EventEntry } from '@/lib/models';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { Upsert } from '@/data/eventsRepo';
import { redirect } from 'next/navigation';
import Stack from '@mui/material/Stack';
import { parseIsoLocalDateAndTime } from '@/lib/dateConversion';

type EditEventFormParams = {
    event: EventEntry
}

export default function EditEventForm(p: EditEventFormParams) {

    const { id, name, description, timezone, startDateTime: start_datetime, endDateTime: end_datetime } = p.event;
    const startDateIso: string = start_datetime.toISODate()!;
    const startTimeIso: string = start_datetime.toISOTime()!;
    const endDateIso: string = end_datetime.toISODate()!;
    const endTimeIso: string = end_datetime.toISOTime()!;

    async function formSubmit(d: FormData) {
        'use server';
        console.debug('formSubmit', JSON.stringify(d));
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
        await Upsert(model);

        redirect('/');
    }

    return (
        <Paper elevation={2}>
            <form action={formSubmit}>
                <Grid container spacing={2}>

                    <Grid size={12}>
                        {id === undefined && (<h2>New Event</h2>)}
                        {id !== undefined && (<h2>Edit Event</h2>)}
                        <input type="hidden" name="id" defaultValue={id} />
                        <input type="hidden" name="timezone" defaultValue={timezone} />
                    </Grid>

                    <Grid size={12}>
                        <TextField fullWidth
                            name="name"
                            label="Name"
                            variant="outlined"
                            defaultValue={name} />
                    </Grid>

                    <Grid size={12}>
                        <TextField fullWidth
                            name="description"
                            label="Description"
                            variant="outlined"
                            multiline={true}
                            rows={5}
                            defaultValue={description} />
                    </Grid>

                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="startTimeIso">Start date</label>
                            <input
                                type="date"
                                name="startTimeIso"
                                defaultValue={startTimeIso} />
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="startTimeIso">Start time</label>
                            <input
                                type="time"
                                name="startTimeIso"
                                defaultValue={startTimeIso} />
                        </Stack>
                    </Grid>

                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="endDateIso">End date</label>
                            <input
                                type="date"
                                name="endDateIso"
                                defaultValue={endDateIso} />
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="endTimeIso">End time</label>
                            <input
                                type="time"
                                name="endTimeIso"
                                defaultValue={endTimeIso} />
                        </Stack>
                    </Grid>

                    <Grid size={12} textAlign={'end'}>
                        <Button type="submit" variant="contained">Save</Button>&nbsp;
                        <Link href="/">Close</Link>
                    </Grid>
                </Grid>
            </form>
        </Paper>)
}
