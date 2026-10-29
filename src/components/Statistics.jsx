import { useEffect, useMemo, useRef } from 'react';
import { Chart, PieController, ArcElement, Legend, Tooltip } from 'chart.js';

Chart.register(PieController, ArcElement, Legend, Tooltip);

const COLORS = [
    '#f05c4d', '#36a2eb', '#ffce56', '#4bc0c0',
    '#9966ff', '#ff9f40', '#e76f99', '#5b8c5a',
    '#5570a6', '#b38452', '#8e6c88', '#60b5a5'
];

export default function Statistics({ teachers }) {
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
    }, [groups, teachers.length]);

    return (
        <section className="statistics">
            <h2>Statistics</h2>
            {teachers.length > 0 ? (
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
