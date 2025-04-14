'use client'
import { ChangeEvent, useState } from "react";

export default function DatePicker() {
    let now = new Date().toLocaleDateString();
    let [ selectedDate, setSelectedDate ] = useState(now);
    const handleInputDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };
    return <>
        <div>
            Date: <input type="date" value={selectedDate} onChange={handleInputDateChange} />
        </div>
    </>
}