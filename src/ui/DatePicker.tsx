'use client'
import { useState } from "react";

function getTodaysDate(): string {
    return new Date().toISOString().slice(0, 10)
}

export default function DatePicker() {
    let [selectedDate, setSelectedDate] = useState(getTodaysDate());
    return <>
        <label htmlFor="selectedDate">Select date:</label>
        <input
            type="date"
            name="selectedDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} />
    </>
}