import EditEventForm from "@/ui/EditEventForm";
import { GetById } from '@/data/eventsRepo';
import { generateNewEventEntry, timezoneLocalNZ } from '@/data/schema';
import { Grid } from "@mui/material";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const { id } = await params
  const isNewEntry = id == 'new';
  const model = (isNewEntry 
    ? generateNewEventEntry(timezoneLocalNZ) // TODO: pull this from the client
    : await GetById(+id));

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
