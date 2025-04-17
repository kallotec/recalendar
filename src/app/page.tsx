import { GetByDate, Delete } from '@/lib/EventsRepo';
import { EventEntry } from '../db/schema';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { getLocalTime, formatDateAsISO, formatTimeAsISO } from '@/lib/DateHelpers';
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const qs = await searchParams;
  const qsDate = qs?.d as string;
  const selectedDate = qsDate ?? formatDateAsISO(getLocalTime());
  const eventList = await loadEventList(selectedDate);
  console.log('events', JSON.stringify(eventList));

  async function onSelectedDateChanged(d: FormData) {
    'use server';
    var date = d.get('selected_date') as string;
    redirect(`/?d=${date}`);
  }

  async function loadEventList(selectedDate: string) {
    return await GetByDate(selectedDate);
  }

  // async function populateEditForm(event?: EventEntry) {
  //   if (event === undefined) {
  //     const newEvent = getEmptyEventEntry();
  //     var nowIn1Hour = getLocalTime(1);
  //     var nowIn2Hours = getLocalTime(2);
  //     newEvent.start_date = formatDateAsISO(nowIn1Hour);
  //     newEvent.start_time = formatTimeAsISO(nowIn1Hour, true);
  //     newEvent.end_date = formatDateAsISO(nowIn2Hours);
  //     newEvent.end_time = formatTimeAsISO(nowIn2Hours, true);
  //     console.debug(JSON.stringify(newEvent));
  //     setEventBeingEdited(newEvent);
  //   }
  //   else {
  //     setEventBeingEdited(event);
  //   }
  //   setIsEditing(true);
  // }

  // async function saveEventHandler(e: EventEntry) {
  //   if (e.id === undefined) {
  //     const [{ id }] = await Insert(e);
  //   }
  //   else {
  //     await Update(e);
  //   }

  //   closeFormEventHandler();

  //   // TODO: Just update the cached item, don't reload whole list
  //   await onNewDateSelected(selectedDate);
  // }

  // async function deleteEventHandler(id: number) {
  //   await Delete(id);
  //   // TODO: Just remove the cached item, don't reload whole list
  //   await onNewDateSelected(selectedDate);
  // }

  // function closeFormEventHandler() {
  //   const newEvent = getEmptyEventEntry();
  //   setEventBeingEdited(newEvent); // stop binding to the last element
  //   setIsEditing(false);
  // }

  return (
    <main>
      <h1>Calendar</h1>

      <Grid container spacing={2}>

        <Grid size={{ xs: 12 }}>

          <form action={onSelectedDateChanged}>
            <Stack direction={'row'} spacing={1}>
              <label htmlFor="start_date">View date</label>
              <input
                type="date"
                name="selected_date"
                defaultValue={selectedDate} />
            </Stack>
            <Button type="submit">Load</Button>
          </form>

          <Box>
            <Link href='/edit/new'>New</Link>
            <Divider />
            {eventList.map((e: EventEntry) => (
              <Accordion key={e.id!}>
                <AccordionSummary>
                  <Chip label={e.start_time} color={"info"} />
                  <Typography sx={{ paddingLeft: 1, paddingTop: 0.5 }} component="span" fontWeight={'bold'}>
                    {e.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ background: '#efefef' }}>
                  <Typography padding={2}>{e.description}</Typography>
                  <Divider />
                  <Link href={`/edit/${e.id}`}>Edit</Link>
                  {/* <Button onClick={() => deleteEventHandler(e.id as number)}>Delete</Button> */}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>

      </Grid>
    </main>
  );
}
