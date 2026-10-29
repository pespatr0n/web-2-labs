import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Chart, PieController, ArcElement, Legend, Tooltip } from 'chart.js';

Chart.register(PieController, ArcElement, Legend, Tooltip);

const TeacherReport = lazy(() => import('./TeacherReport.jsx'));
const VIEWS = [
    { value: 'chart', label: 'Pie chart' },
    { value: 'country', label: 'By country' },
    { value: 'flat', label: 'All teachers' }
];

const COLORS = [
    '#f05c4d', '#36a2eb', '#ffce56', '#4bc0c0',
    '#9966ff', '#ff9f40', '#e76f99', '#5b8c5a',
    '#5570a6', '#b38452', '#8e6c88', '#60b5a5'
];

export default function Statistics({ teachers, allTeachers = teachers }) {
    const [view, setView] = useState('chart');
    const canvasRef = useRef(null);
    const groups = useMemo(() => {
        const counts = new Map();

        for (const teacher of teachers) {
            const speciality = teacher.course || 'Unknown';
            counts.set(speciality, (counts.get(speciality) || 0) + 1);
        }

        return [...counts.entries()].sort(([first], [second]) => first.localeCompare(second));
    }, [teachers]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const chart = new Chart(canvasRef.current, {
            type: 'pie',
            data: {
                labels: groups.map(([speciality]) => speciality),
                datasets: [{
                    label: 'Teachers',
                    data: groups.map(([, count]) => count),
                    backgroundColor: groups.map((_, index) => COLORS[index % COLORS.length]),
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const percentage = (context.parsed / teachers.length * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [groups, teachers.length, view]);

    return (
        <section className="statistics">
            <h2>Statistics</h2>
            <div className="statistics-views" role="group" aria-label="Statistics view">
                {VIEWS.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={view === option.value}
                        onClick={() => setView(option.value)}
                    >{option.label}</button>
                ))}
            </div>
            {view !== 'chart' ? (
                <>
                    <p className="statistics-summary">
                        {view === 'country' ? 'Teachers by country' : 'All teachers'} ({allTeachers.length} loaded)
                    </p>
                    <Suspense fallback={<p className="statistics-summary" role="status">Loading report...</p>}>
                        <TeacherReport teachers={allTeachers} mode={view} />
                    </Suspense>
                </>
            ) : teachers.length > 0 ? (
                <>
                    <p className="statistics-summary">
                        Teachers by speciality ({teachers.length} total)
                    </p>
                    <div className="statistics-chart">
                        <canvas
                            ref={canvasRef}
                            role="img"
                            aria-label={`Teachers by speciality: ${groups.map(([name, count]) => `${name}: ${count}`).join(', ')}`}
                        />
                    </div>
                </>
            ) : (
                <p className="statistics-summary" role="status">No teachers match the current filters.</p>
            )}
        </section>
    );
}
