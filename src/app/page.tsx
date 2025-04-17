'use client'
import { useState } from 'react';
import DatePicker from '@/ui/DatePicker';
import EditEventForm from "@/ui/EditEventForm";
import { GetByDate, Insert, Update, Delete } from '@/lib/EventsRepo';
import { EventEntry, getEmptyEventEntry } from '../db/schema';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Typography } from "@mui/material";
import { getLocalTime, formatDateAsISO, formatTimeAsISO } from '@/lib/DateHelpers';

export default function Home() {

  const [eventList, setEventList] = useState<EventEntry[]>([]);
  let [selectedDate, setSelectedDate] = useState(formatDateAsISO(getLocalTime()));
  let [isEditing, setIsEditing] = useState(false);
  let [eventBeingEdited, setEventBeingEdited] = useState<EventEntry>(getEmptyEventEntry());

  async function onNewDateSelected(date: string) {
    setSelectedDate(date);
    var latestList = await GetByDate(selectedDate);
    // sort asc by starting time
    latestList = latestList.sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
    setEventList(latestList);
  }

  async function populateEditForm(event?: EventEntry) {
    if (event === undefined) {
      const newEvent = getEmptyEventEntry();
      var nowIn1Hour = getLocalTime(1);
      var nowIn2Hours = getLocalTime(2);
      newEvent.start_date = formatDateAsISO(nowIn1Hour);
      newEvent.start_time = formatTimeAsISO(nowIn1Hour, true);
      newEvent.end_date = formatDateAsISO(nowIn2Hours);
      newEvent.end_time = formatTimeAsISO(nowIn2Hours, true);
      console.debug(JSON.stringify(newEvent));
      setEventBeingEdited(newEvent);
    }
    else {
      setEventBeingEdited(event);
    }
    setIsEditing(true);
  }

  async function saveEventHandler(e: EventEntry) {
    if (e.id === undefined) {
      const [{ id }] = await Insert(e);
    }
    else {
      await Update(e);
    }

    closeFormEventHandler();

    // TODO: Just update the cached item, don't reload whole list
    await onNewDateSelected(selectedDate);
  }

  async function deleteEventHandler(id: number) {
    await Delete(id);
    // TODO: Just remove the cached item, don't reload whole list
    await onNewDateSelected(selectedDate);
  }

  function closeFormEventHandler() {
    const newEvent = getEmptyEventEntry();
    setEventBeingEdited(newEvent); // stop binding to the last element
    setIsEditing(false);
  }

  return (
    <main>
      <h1>Calendar</h1>

      <Grid container spacing={2}>

        {isEditing && (
          <Grid size={{ xs: 12, md: 6 }}>
            <EditEventForm
              eventToEdit={eventBeingEdited}
              handleEventSubmit={saveEventHandler}
              handleClose={closeFormEventHandler} />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            label="View date:"
            selectedDate={selectedDate}
            onChange={onNewDateSelected} />

          <Box>
            <Button variant="contained" onClick={async () => await populateEditForm()}>New</Button>
            <Divider />
            {eventList.map((e: EventEntry) => (
              <Accordion key={e.id as number}>
                <AccordionSummary>
                  <Chip label={e.start_time} color={"info"} />
                  <Typography sx={{ paddingLeft: 1, paddingTop: 0.5 }} component="span" fontWeight={'bold'}>
                    {e.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ background: '#efefef' }}>
                  <Typography padding={2}>{e.description}</Typography>
                  <Divider />
                  <Button onClick={() => populateEditForm(e)}>Edit</Button>
                  <Button onClick={() => deleteEventHandler(e.id as number)}>Delete</Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>

      </Grid>
    </main>
  );
}
