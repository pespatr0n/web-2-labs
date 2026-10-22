import { useEffect, useState } from 'react';
import { sortUsers } from '../utils/teachers.js';

const columns = [
    { label: 'Name', field: 'full_name' },
    { label: 'Speciality', field: 'course' },
    { label: 'Age', field: 'age' },
    { label: 'Date of birth', field: 'b_date' },
    { label: 'Gender' },
    { label: 'Nationality', field: 'country' }
];

const PAGE_SIZE = 10;
const VISIBLE_PAGE_COUNT = 5;

export default function Statistics({ teachers, filterKey }) {
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(teachers.length / PAGE_SIZE);
    const currentPage = Math.min(page, Math.max(1, pageCount));

    useEffect(() => {
        setPage(1);
    }, [filterKey]);

    useEffect(() => {
        setPage(current => Math.min(current, Math.max(1, pageCount)));
    }, [pageCount]);

    const changeSort = (field) => {
        if (!field) return;
        setPage(1);

        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const sortedTeachers = sortBy ? sortUsers(teachers, sortBy, sortOrder) : teachers;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageTeachers = sortedTeachers.slice(startIndex, startIndex + PAGE_SIZE);
    const firstVisiblePage = Math.min(
        Math.max(1, currentPage - Math.floor(VISIBLE_PAGE_COUNT / 2)),
        Math.max(1, pageCount - VISIBLE_PAGE_COUNT + 1)
    );
    const visiblePages = Array.from(
        { length: Math.min(VISIBLE_PAGE_COUNT, pageCount) },
        (_, index) => firstVisiblePage + index
    );

    const changePage = (event, nextPage) => {
        event.preventDefault();
        setPage(nextPage);
    };

    return (
        <section className="statistics">
            <h2>Statistics</h2>
            <table>
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={column.label} onClick={() => changeSort(column.field)}>
                                {column.label}{' '}
                                {column.field && (
                                    <span
                                        className="sort-arrow"
                                        style={{ opacity: sortBy === column.field ? 1 : undefined }}
                                    >{sortBy === column.field && sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pageTeachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.full_name}</td>
                            <td>{teacher.course}</td>
                            <td>{teacher.age ?? 'Unknown'}</td>
                            <td>{teacher.b_date ? teacher.b_date.split('T')[0] : 'Unknown'}</td>
                            <td>{teacher.gender}</td>
                            <td>{teacher.country || 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pageCount > 0 && (
                <div className="pagination" role="navigation" aria-label="Statistics pages">
                    {firstVisiblePage > 1 && (
                        <>
                            <a href="#" onClick={event => changePage(event, 1)}>1</a>
                            {firstVisiblePage > 2 && <span>...</span>}
                        </>
                    )}
                    {visiblePages.map(pageNumber => (
                        <a
                            key={pageNumber}
                            href="#"
                            aria-current={pageNumber === currentPage ? 'page' : undefined}
                            onClick={event => changePage(event, pageNumber)}
                        >{pageNumber}</a>
                    ))}
                    {visiblePages.at(-1) < pageCount && <span>...</span>}
                    <a href="#" onClick={event => changePage(event, pageCount)}>Last</a>
                </div>
            )}
        </section>
    );
}
