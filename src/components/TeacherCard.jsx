import TeacherAvatar from './TeacherAvatar.jsx';

export default function TeacherCard({ teacher, showCourse = true }) {
    return (
        <article
            className="teacher-card"
            data-teacher-id={teacher.id}
        >
            <TeacherAvatar teacher={teacher} />
            <h3>{teacher.full_name || 'Unknown teacher'}</h3>
            {showCourse && <p className="speciality">{teacher.course}</p>}
            <p className="country">{teacher.country || 'Unknown country'}</p>
        </article>
    );
}
