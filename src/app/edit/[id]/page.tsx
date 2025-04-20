import EditEventForm from "@/ui/EditEventForm";
import { GetById } from '@/data/eventsRepo';
import { generateNewEventEntry, timezoneLocalNZ } from '@/data/schema';

export default async function EditEventPage({
  params
}: {
  params: { id: string };
}) {

  const { id } = await params
  const isNewEntry = id == 'new';
  const model = (isNewEntry
    ? generateNewEventEntry(timezoneLocalNZ) // TODO: pull this from the client
    : await GetById(+id));

  return (
    <main>
      <h1>{isNewEntry ? "Create Event" : "Edit Event"}</h1>
      <EditEventForm event={model} />
    </main>
  );
}
