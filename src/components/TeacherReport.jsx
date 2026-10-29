import { useEffect, useRef } from 'react';
import WebDataRocks from '@webdatarocks/webdatarocks';
import '@webdatarocks/webdatarocks/webdatarocks.min.css';
import { createTeacherReport } from '../utils/teacherReports.js';

export default function TeacherReport({ teachers, mode }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!teachers.length) return;

        const pivot = new WebDataRocks({
            container: containerRef.current,
            width: '100%',
            height: 450,
            toolbar: false,
            report: createTeacherReport(teachers, mode)
        });

        return () => pivot.dispose();
    }, [teachers, mode]);

    if (!teachers.length) {
        return <p className="statistics-summary" role="status">No teachers loaded.</p>;
    }

    return (
        <div
            ref={containerRef}
            className="teacher-report"
            role="region"
            aria-label={mode === 'country' ? 'Teacher counts by country' : 'All loaded teachers'}
        />
    );
}
