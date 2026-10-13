import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function CalendarPage() {

    const day = { minHeight: 80, padding: 8, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 6 }
    const quiz = { fontSize: 12, padding: 4, marginTop: 4, borderRadius: 4, color: '#fff', backgroundColor: '#5B27C9' }
    const assignment = { fontSize: 12, padding: 4, marginTop: 4, borderRadius: 4, color: '#fff', backgroundColor: '#2F6BFF' }
    const navBtn = { color: '#5B27C9', borderColor: '#5B27C9', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }

    const today = new Date();

    const [events, setEvents] = useState([]);
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/events", { params: localStorage.getItem("role") === 'STUDENT' ? { student: localStorage.getItem("studentId") } : {} })
            .then((response) => {
                setEvents(response.data);
            });
    }, []);

    function prevMonth(){
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    }

    function nextMonth(){
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // empty boxes before the 1st, and number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const blanks = [];
    for (let i = 0; i < firstDay; i++) {
        blanks.push(i);
    }

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Calendar" />

            <div style={{ flex: 1, padding: 30 }}>

                <h1>Calendar</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <Button onClick={prevMonth} variant="outlined" size="small" sx={navBtn}>Prev</Button>
                    <strong>{monthNames[month]} {year}</strong>
                    <Button onClick={nextMonth} variant="outlined" size="small" sx={navBtn}>Next</Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>

                    {weekdays.map((w) => (
                        <div key={w} style={{ textAlign: 'center', fontWeight: 600 }}>{w}</div>
                    ))}

                    {blanks.map((b) => (
                        <div key={'blank' + b}></div>
                    ))}

                    {days.map((d) => {
                        const date = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
                        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

                        return (
                            <div key={d} style={isToday ? { ...day, border: '2px solid #5B27C9' } : day}>
                                {d}
                                {events.filter((e) => e.date === date).map((e) => (
                                    <div key={e._id} style={e.type === 'Quiz' ? quiz : assignment}>{e.course && e.course + " - "}{e.title}{localStorage.getItem("role") !== 'STUDENT' && e.section && " - " + e.section}</div>
                                ))}
                            </div>
                        )
                    })}

                </div>

            </div>

        </div>
    )

}

export default CalendarPage