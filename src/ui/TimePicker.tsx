'use client'
import { Stack } from "@mui/material"

export default function TimePicker(
    {
        label,
        selectedTime,
        onChange
    }: {
        label: string,
        selectedTime: string,
        onChange: (d: string) => void
    }) {
    return <Stack direction={'row'} spacing={1}>
        <label htmlFor="selectedTime">{label}</label>
        <input
            type="time"
            name="selectedTime"
            value={selectedTime}
            onChange={(e) => onChange(e.target.value)} />
    </Stack>
}