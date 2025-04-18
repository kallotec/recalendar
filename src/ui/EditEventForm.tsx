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

    const { id, name, description, start_date, start_time, end_date, end_time } = p.event;

    async function formSubmit(d: FormData) {
        'use server';
        const idStr = (d.get('id') as string);
        const model: EventEntry = {
            id: (idStr?.length > 0 ? +idStr : undefined),
            name: d.get('name') as string,
            description: d.get('description') as string,
            start_date: d.get('start_date') as string,
            start_time: d.get('start_time') as string,
            end_date: d.get('end_date') as string,
            end_time: d.get('end_time') as string
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
                            <label htmlFor="start_date">Start date</label>
                            <input
                                type="date"
                                name="start_date"
                                defaultValue={start_date} />
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="start_time">Start time</label>
                            <input
                                type="time"
                                name="start_time"
                                defaultValue={start_time} />
                        </Stack>
                    </Grid>

                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="end_date">End date</label>
                            <input
                                type="date"
                                name="end_date"
                                defaultValue={end_date} />
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={'row'} spacing={1}>
                            <label htmlFor="end_time">End time</label>
                            <input
                                type="time"
                                name="end_time"
                                defaultValue={end_time} />
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