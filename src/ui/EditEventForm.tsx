'use client'
import { useState } from 'react';
import { EventEntry, validateEvent } from '@/db/schema';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import DatePicker from '@/ui/DatePicker';
import TimePicker from './TimePicker';

export type EditEventArgs = {
    eventToEdit: EventEntry,
    handleEventSubmit: (e: EventEntry) => void,
    handleClose: () => void
};

export default function EditEventForm(p: EditEventArgs) {
    let [event, setEvent] = useState<EventEntry>(p.eventToEdit);
    let [errors, setErrors] = useState<string[]>([]);

    function handleFieldChange(name: string, value: any) {
        setEvent({ ...event, [name]: value });
    }

    function validateAndSubmitForm() {
        var err = validateEvent(event);
        if (err.length > 0) {
            setErrors(err);
        }
        else {
            p.handleEventSubmit(event);
        }
    }

    return (
        <Paper elevation={2}>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ padding: 4 }}>
                <Grid container spacing={2}>

                    <Grid size={12}>
                        {event.id === undefined && (<h2>New Event</h2>)}
                        {event.id !== undefined && (<h2>Edit Event</h2>)}
                    </Grid>

                    {errors.length > 0 && (
                        <Grid size={12}>
                            <ul>
                                {errors.map((e: string) => (
                                    <li key={e} className="warning-item">{e}</li>
                                ))}
                            </ul>
                        </Grid>
                    )}

                    <Grid size={12}>
                        <TextField fullWidth
                            name="name"
                            label="Name"
                            variant="outlined"
                            value={event.name}
                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)} />
                    </Grid>

                    <Grid size={12}>
                        <TextField fullWidth
                            name="description"
                            label="Description"
                            variant="outlined"
                            multiline={true} rows={5}
                            value={event.description}
                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)} />
                    </Grid>

                    <Grid size={6}>
                        <DatePicker
                            label='Start date'
                            selectedDate={event.start_date}
                            onChange={(d) => handleFieldChange('start_date', d)}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TimePicker
                            label="Start time"
                            selectedTime={event.start_time}
                            onChange={(t) => handleFieldChange('start_time', t)} />
                    </Grid>

                    <Grid size={6}>
                        <DatePicker
                            label='End date'
                            selectedDate={event.end_date}
                            onChange={(d) => handleFieldChange('end_date', d)}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TimePicker
                            label="End time"
                            selectedTime={event.end_time}
                            onChange={(t) => handleFieldChange('end_time', t)} />
                    </Grid>

                    <Grid size={12} textAlign={'end'}>
                        <Button variant="contained" onClick={() => validateAndSubmitForm()}>Save</Button>&nbsp;
                        <Button variant="outlined" onClick={() => p.handleClose()}>Close</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>)
}