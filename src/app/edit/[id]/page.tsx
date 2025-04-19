import EditEventForm from "@/ui/EditEventForm";
import { GetByDate, Delete, GetById } from '@/lib/EventsRepo';
import { EventEntry, generateNewEventEntry } from '@/db/schema';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const { id } = await params
  const isNewEntry = id == 'new';
  const model = (isNewEntry ? generateNewEventEntry(true) : await GetById(+id));

  return (
    <main>
      <h1>{isNewEntry ? "New Event" : "Edit Event"}</h1>

      <Grid container spacing={2}>

        <Grid size={{ xs: 12 }}>
          <EditEventForm event={model} />
        </Grid>

      </Grid>
    </main>
  );
}
