import { useState } from 'react';
import { sortUsers } from '../utils/teachers.js';

const columns = [
    { label: 'Name', field: 'full_name' },
    { label: 'Speciality', field: 'course' },
    { label: 'Age', field: 'age' },
    { label: 'Date of birth', field: 'b_date' },
    { label: 'Gender' },
    { label: 'Nationality', field: 'country' }
];

export default function Statistics({ teachers }) {
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const changeSort = (field) => {
        if (!field) return;

        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const sortedTeachers = sortBy ? sortUsers(teachers, sortBy, sortOrder) : teachers;

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
                    {sortedTeachers.map(teacher => (
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
            <div className="pagination">
                <a href="#">1</a>{' '}
                <a href="#">2</a>{' '}
                <a href="#">3</a>{' '}
                <span>...</span>{' '}
                <a href="#">Last</a>
            </div>
        </section>
    );
}
