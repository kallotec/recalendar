import { GetByDate, Delete } from '@/data/eventsRepo';
import { EventEntry } from '../data/schema';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { getLocalTime, formatDateAsISO, formatTimeAsISO } from '@/lib/dateConversion';
import { redirect } from "next/navigation";
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

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

  async function loadEventList(selectedDate: string) {
    return await GetByDate(selectedDate);
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
                defaultValue={selectedDate} />
              <Button type="submit">Load</Button>
            </Stack>
          </form>

          <Box>
            <Link href={'/edit/new'}>New</Link>
            <Divider />
            {eventList.map((e: EventEntry) => (
              <Accordion key={e.id!}>
                <AccordionSummary>
                  <Chip label={e.start_time_utc} color={"info"} />
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
