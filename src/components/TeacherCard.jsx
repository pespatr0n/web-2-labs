import TeacherAvatar from './TeacherAvatar.jsx';

export default function TeacherCard({ teacher, showCourse = true }) {
    return (
        <article
            className="teacher-card"
            data-teacher-id={teacher.id}
        >
            <div style={{ position: 'relative', width: 120, margin: '0 auto' }}>
                <TeacherAvatar teacher={teacher} />
                {teacher.favorite && (
                    <span
                        aria-label="Favorite"
                        style={{ position: 'absolute', top: 0, right: -5, color: 'gold', fontSize: 24 }}
                    >★</span>
                )}
            </div>
            <h3>{teacher.full_name || 'Unknown teacher'}</h3>
            {showCourse && <p className="speciality">{teacher.course}</p>}
            <p className="country">{teacher.country || 'Unknown country'}</p>
        </article>
    );
}
