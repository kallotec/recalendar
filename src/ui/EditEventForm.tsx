import { EventEntry, validateEvent } from '@/db/schema';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { Upsert } from '@/lib/EventsRepo';
import { redirect } from 'next/navigation';
import Stack from '@mui/material/Stack';

type EditEventFormParams = {
    event: EventEntry
}

export default function EditEventForm(p: EditEventFormParams) {

    const { id, name, description, start_date_utc, start_time_utc, end_date_utc, end_time_utc } = p.event;

    async function formSubmit(d: FormData) {
        'use server';
        const idStr = (d.get('id') as string);
        const model: EventEntry = {
            id: (idStr?.length > 0 ? +idStr : undefined),
            name: d.get('name') as string,
            description: d.get('description') as string,
            start_date_utc: d.get('start_date_utc') as string,
            start_time_utc: d.get('start_time_utc') as string,
            end_date_utc: d.get('end_date_utc') as string,
            end_time_utc: d.get('end_time_utc') as string
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
                            <label htmlFor="start_date_utc">Start date</label>
                            <input
                                type="date"
                                name="start_date_utc"
                                defaultValue={start_date_utc} />
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="start_time_utc">Start time</label>
                            <input
                                type="time"
                                name="start_time_utc"
                                defaultValue={start_time_utc} />
                        </Stack>
                    </Grid>

                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="end_date_utc">End date</label>
                            <input
                                type="date"
                                name="end_date_utc"
                                defaultValue={end_date_utc} />
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="end_time_utc">End time</label>
                            <input
                                type="time"
                                name="end_time_utc"
                                defaultValue={end_time_utc} />
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