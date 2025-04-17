'use client'
import { Stack } from "@mui/material"

export default function DatePicker(
    {
        label,
        selectedDate,
        onChange
    }: {
        label: string,
        selectedDate: string,
        onChange: (d: string) => void
    }) {
    return <Stack direction={'row'} spacing={1}>
        <label htmlFor="selectedDate">{label}</label>
        <input
            type="date"
            name="selectedDate"
            value={selectedDate}
            onChange={async (e) => await onChange(e.target.value)} />
    </Stack>
}