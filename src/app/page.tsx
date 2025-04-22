import { GetEventsByDate, DeleteEventById } from '@/data/eventsRepo';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { getStartAndEndOfDayInSecsUtc, localIsoDateToUtc } from '@/lib/dateConversion';
import { redirect } from "next/navigation";
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { EventEntry } from '@/lib/models';
import { DateTime } from 'luxon';
import DateSelector from '@/ui/DateSelector';
import { GetMoonPhaseByDate } from '@/data/moonPhaseRepo';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const qs = await searchParams;
  const qsDate = qs?.d as string || undefined;
  const qsTimezone = qs?.tz as string || undefined;
  const isDateSelected = (qsDate ? qsDate.length > 0 : false);
  const events = await loadEventList(qsDate, qsTimezone);

  async function loadEventList(dateLocalIso: string | undefined, timezone: string | undefined): Promise<EventEntry[]> {
    if (!dateLocalIso) {
      return [];
    }
    const { startSecs, endSecs } = getStartAndEndOfDayInSecsUtc(dateLocalIso, timezone!);
    const utcDate = localIsoDateToUtc(dateLocalIso, timezone!);

    const [matchingPhase, events] = await Promise.all([
      GetMoonPhaseByDate(utcDate.toISODate()!, timezone!),
      GetEventsByDate(startSecs, endSecs)
    ]);

    if (matchingPhase) {
      events.unshift(matchingPhase);
    }

    return events;
  }

  async function onSelectedDateChanged(d: FormData) {
    'use server';
    const date = d.get('selected_date') as string;
    const tz = d.get('timezone') as string;
    redirect(`/?d=${date}&tz=${tz}`);
  }

  async function onDeleteClicked(d: FormData) {
    'use server';
    const id: number = +(d.get('id') as string);
    await DeleteEventById(id);
    revalidatePath('/');
  }

  return (
    <main>
      <h1>Calendar</h1>

      <Grid container spacing={2}>

        <Grid size={{ xs: 12 }}>

          <form action={onSelectedDateChanged}>
            <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ paddingBottom: 2 }}>
              <label htmlFor="selected_date">View date</label>
              <DateSelector
                htmlName='selected_date'
                selectedDate={qsDate}
                includeTimezoneField={true} />
              <Button type="submit">Load</Button>
            </Stack>
          </form>

          <Box>
            {isDateSelected && (
              <Link href={`/edit/new?d=${qsDate}&tz=${qsTimezone}`}>Create Event</Link>
            )}
            <Divider sx={{ paddingTop: 1, paddingBottom: 1 }} />
            {!isDateSelected && (
              <p>Select a date and click load</p>
            )}
            {isDateSelected && events.length == 0 && (
              <>No events..</>
            )}
            {events.map((e: EventEntry) => (
              <Accordion key={e.id || e.name}>
                <AccordionSummary>
                  {!e.isAllDay && (
                    <Chip
                      label={e.startDateTime.toLocaleString(DateTime.TIME_SIMPLE)}
                      color={"info"} />
                  )}
                  {e.isAllDay && (
                    <Chip label="All day" color={'success'} />
                  )}
                  <Typography sx={{ paddingLeft: 1, paddingTop: 0.5 }} component="span" fontWeight={'bold'}>
                    {e.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ background: '#efefef' }}>
                  <Typography padding={2}>{e.description}</Typography>
                  {e.id && (
                    <Stack direction={'row'}>
                      <Link href={`/edit/${e.id}`}>Edit</Link>
                      <form action={onDeleteClicked}>
                        <input type="hidden" name="id" defaultValue={e.id} />
                        <Button type="submit">Delete</Button>
                      </form>
                    </Stack>)}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

        </Grid>

      </Grid>
    </main >
  );
}
