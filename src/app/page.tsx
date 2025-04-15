'use client'
import CalendarView from "@/ui/CalendarView";
import EditEventForm from "@/ui/EditEventForm";
import { useState } from 'react';
import { GetByDate } from '@/lib/EventsRepo';
import * as schema from '../db/schema';
type Event = typeof schema.events.$inferInsert;

function getTodaysDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function Home() {
  const [entries, setEntries] = useState<Event[]>([]);
  let [selectedDate, setSelectedDate] = useState(getTodaysDate());

  async function refreshList() {
    var latestList = await GetByDate(selectedDate);
    setEntries(latestList);
  }

  async function onNewDateSelected(date: string) {
    setSelectedDate(date);
    await refreshList()
  }

  return (
    <div>
      <h1>Calendar</h1>

      <CalendarView 
        selectedDate={selectedDate} 
        eventList={entries} 
        onSelectedDatechanged={onNewDateSelected} />

      <EditEventForm />
    </div>
  );
}
