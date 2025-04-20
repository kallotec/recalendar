import EditEventForm from "@/ui/EditEventForm";
import { GetById } from '@/data/eventsRepo';
import { generateNewEventEntry, timezoneLocalNZ } from '@/data/schema';

export default async function EditEventPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const { id } = await params
  const isNewEntry = id == 'new';

  const qs = await searchParams;
  const qsDate = qs?.d as string;
  const qsTimezone = qs?.tz as string;

  const model = (isNewEntry
    ? generateNewEventEntry(qsDate, qsTimezone)
    : await GetById(+id));

  return (
    <main>
      <h1>{isNewEntry ? "Create Event" : "Edit Event"}</h1>
      <EditEventForm
        id={model.id}
        name={model.name}
        description={model.description}
        timezone={model.timezone}
        startDateTimeSecs={model.startDateTime.toSeconds()}
        endDateTimeSecs={model.endDateTime.toSeconds()}
      />
    </main>
  );
}
