'use client';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { editFormSubmit, formSubmitState } from '@/ui/EditEventFormHandlers';
import { DateTime } from 'luxon';
import { useActionState } from 'react';

type EditEventFormParams = {
    id: number | undefined,
    name: string,
    description?: string,
    timezone: string,
    startDateTimeSecs: number,
    endDateTimeSecs: number
}
const initialState: formSubmitState = {
    error: ''
};

export default function EditEventForm(p: EditEventFormParams) {
    const [state, submitAction] = useActionState(editFormSubmit, initialState);
    const { id, name, description, timezone, startDateTimeSecs, endDateTimeSecs } = p;
    const timeSettings = { includeOffset: false, suppressMilliseconds: true, suppressSeconds: true };
    const startDateTime = DateTime.fromSeconds(startDateTimeSecs, { locale: timezone });
    const startDateIso: string = startDateTime.toISODate()!;
    const startTimeIso: string = startDateTime.toISOTime(timeSettings)!;
    const endDateTime = DateTime.fromSeconds(endDateTimeSecs, { locale: timezone });
    const endDateIso: string = endDateTime.toISODate()!;
    const endTimeIso: string = endDateTime.toISOTime(timeSettings)!;

    return (
        <form action={submitAction}>
            <Grid container spacing={2}>

                <Grid size={12}>
                    <input type="hidden" name="id" defaultValue={id} />
                    <input type="hidden" name="timezone" defaultValue={timezone} />
                    {state.error ? <p className='warning-item'>{state.error}</p> : null}
                </Grid>

                <Grid size={12}>
                    <TextField fullWidth
                        label="Name"
                        variant="outlined"
                        name="name"
                        defaultValue={name} />
                </Grid>

                <Grid size={12}>
                    <TextField fullWidth
                        label="Description"
                        variant="outlined"
                        multiline={true}
                        rows={5}
                        name="description"
                        defaultValue={description} />
                </Grid>

                <Grid size={6}>
                    <Stack direction={'row'} spacing={1}>
                        <label htmlFor="startDateIso">Start date</label>
                        <input
                            type="date"
                            name="startDateIso"
                            defaultValue={startDateIso} />
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
        </form>)
}
