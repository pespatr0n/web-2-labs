import TeacherCard from './TeacherCard.jsx';

export default function TeacherList({ teachers, onSelectTeacher, favorites = false }) {
    const selectTeacher = (event) => {
        const card = event.target.closest('[data-teacher-id]');
        if (card) onSelectTeacher(card.dataset.teacherId);
    };

    return (
        <div
            className={favorites ? 'favorites-grid' : 'teachers-grid'}
            onClick={selectTeacher}
        >
            {teachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} showCourse={!favorites} />
            ))}
        </div>
    );
}
