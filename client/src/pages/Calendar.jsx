import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function CalendarPage() {

    const day = { minHeight: 80, padding: 8, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 6 }
    const quiz = { fontSize: 12, padding: 4, marginTop: 4, borderRadius: 4, color: '#fff', backgroundColor: '#5B27C9' }
    const assignment = { fontSize: 12, padding: 4, marginTop: 4, borderRadius: 4, color: '#fff', backgroundColor: '#2F6BFF' }

    const [events, setEvents] = useState([]);

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/events")
            .then((response) => {
                setEvents(response.data);
            });
    }, []);

    // October 2026 starts on a Thursday, so 4 empty boxes come first (Sun to Wed)
    const blanks = [0, 1, 2, 3];
    const days = [];
    for (let i = 1; i <= 31; i++) {
        days.push(i);
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Calendar" />

            <div style={{ flex: 1, padding: 30 }}>

                <h1>Calendar</h1>
                <p>October 2026 - Deadlines, quizzes, assignments</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>

                    {weekdays.map((w) => (
                        <div key={w} style={{ textAlign: 'center', fontWeight: 600 }}>{w}</div>
                    ))}

                    {blanks.map((b) => (
                        <div key={'blank' + b}></div>
                    ))}

                    {days.map((d) => {
                        const date = "2026-10-" + String(d).padStart(2, "0");
                        const isToday = today.getFullYear() === 2026 && today.getMonth() === 9 && today.getDate() === d;

                        return (
                            <div key={d} style={isToday ? { ...day, border: '2px solid #5B27C9' } : day}>
                                {d}
                                {events.filter((e) => e.date === date).map((e) => (
                                    <div key={e._id} style={e.type === 'Quiz' ? quiz : assignment}>{e.title}</div>
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