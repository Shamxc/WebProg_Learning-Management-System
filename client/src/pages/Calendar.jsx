import Sidebar from './Sidebar';

function CalendarPage() {

    const day = { minHeight: 80, padding: 8, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 6 }
    const quiz = { fontSize: 12, padding: 4, borderRadius: 4, color: '#fff', backgroundColor: '#5B27C9' }
    const assignment = { fontSize: 12, padding: 4, borderRadius: 4, color: '#fff', backgroundColor: '#2F6BFF' }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Calendar" />

            <div style={{ flex: 1, padding: 30 }}>

                <h1>Calendar</h1>
                <p>October 2026 - Deadlines, quizzes, assignments</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>

                    <div style={day}>1</div>
                    <div style={day}>2</div>
                    <div style={day}>3</div>
                    <div style={day}>4</div>
                    <div style={day}>5</div>
                    <div style={day}>6</div>
                    <div style={day}>7</div>

                    <div style={day}>8</div>
                    <div style={day}>9</div>
                    <div style={{ ...day, backgroundColor: '#fff', border: '2px solid #5B27C9' }}>10</div>
                    <div style={day}>11</div>
                    <div style={day}>12 <div style={quiz}>Week 5 Quiz</div></div>
                    <div style={day}>13</div>
                    <div style={day}>14 <div style={assignment}>Linked List Lab</div></div>

                    <div style={day}>15</div>
                    <div style={day}>16 <div style={assignment}>Case Study</div></div>
                    <div style={day}>17</div>
                    <div style={day}>18</div>
                    <div style={day}>19</div>
                    <div style={day}>20</div>
                    <div style={day}>21 <div style={quiz}>Midterm Quiz</div></div>

                </div>

            </div>

        </div>
    )

}

export default CalendarPage