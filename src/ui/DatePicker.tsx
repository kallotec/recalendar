'use client'
import { useState } from "react";

function getTodaysDate(): string {
    return new Date().toISOString().slice(0, 10)
}

export default function DatePicker({ selectedDate, onChange }: { selectedDate: string, onChange: (d: string) => void }) {
    return <>
        <label htmlFor="selectedDate">Select date:</label>
        <input
            type="date"
            name="selectedDate"
            value={selectedDate}
            onChange={(e) => onChange(e.target.value)} />
    </>
}