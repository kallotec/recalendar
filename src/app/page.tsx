import { GetByDate, Delete } from '@/data/eventsRepo';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { getLocalTime, getStartAndEndOfDayInMsUtc } from '@/lib/dateConversion';
import { redirect } from "next/navigation";
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { EventEntry } from '@/lib/models';
import { timezoneLocalNZ } from '@/data/schema';
import { DateTime } from 'luxon';

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const qs = await searchParams;
  const qsDate = qs?.d as string;
  const qsTimezone = qs?.tz as string;
  const eventList = (qsDate?.length > 0) ? await loadEventList(qsDate, qsTimezone) : [];

  async function loadEventList(dateLocalIso: string, timezone:string) {
    const { startMs, endMs } = getStartAndEndOfDayInMsUtc(dateLocalIso, timezone);
    return await GetByDate(startMs, endMs);
  }

  async function onSelectedDateChanged(d: FormData) {
    'use server';
    var date = d.get('selected_date') as string;
    redirect(`/?d=${date}`);
  }

  async function onDeleteClicked(d: FormData) {
    'use server';
    var id: number = +(d.get('id') as string);
    await Delete(id);
    revalidatePath('/');
  }

  return (
    <main>
      <h1>Calendar</h1>

      <Grid container spacing={2}>

        <Grid size={{ xs: 12 }}>

          <form action={onSelectedDateChanged}>
            <Stack direction={'row'} spacing={1}>
              <label htmlFor="selected_date">View date</label>
              <input
                type="date"
                name="selected_date"
                defaultValue={qsDate} />
              <Button type="submit">Load</Button>
            </Stack>
          </form>

          <Box>
            <Link href={'/edit/new'}>Create Event</Link>
            <Divider sx={{marginTop: 2, marginBottom: 2}} />
            {eventList?.length === 0 && (
              <>No events..</>
            )}
            {eventList.map((e: EventEntry) => (
              <Accordion key={e.id!}>
                <AccordionSummary>
                  <Chip 
                    label={e.startDateTime.toLocaleString(DateTime.TIME_SIMPLE)} 
                    color={"info"} />
                  <Typography sx={{ paddingLeft: 1, paddingTop: 0.5 }} component="span" fontWeight={'bold'}>
                    {e.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ background: '#efefef' }}>
                  <Typography padding={2}>{e.description}</Typography>
                  <Divider />
                  <Link href={`/edit/${e.id}`}>Edit</Link>
                  <form action={onDeleteClicked}>
                    <input type="hidden" name="id" defaultValue={e.id} />
                    <Button type="submit">Delete</Button>
                  </form>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

        </Grid>

      </Grid>
    </main>
  );
}
