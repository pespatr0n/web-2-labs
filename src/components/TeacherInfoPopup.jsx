import TeacherAvatar from './TeacherAvatar.jsx';
import TeacherMap from './TeacherMap.jsx';
import { getDaysUntilBirthday } from '../utils/birthday.js';

export default function TeacherInfoPopup({ teacher, onClose, onToggleFavorite }) {
    const daysUntilBirthday = getDaysUntilBirthday(teacher.b_date);

    return (
        <div
            className="popup-overlay"
            id="info-popup"
            style={{ display: 'flex' }}
        >
            <section
                className="popup-content info-popup-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="teacher-info-title"
            >
                <div className="popup-header dark-header">
                    <h2 id="teacher-info-title">Teacher Info</h2>
                    <button className="close-btn" aria-label="Close" onClick={onClose}>&times;</button>
                </div>
                <div className="teacher-details">
                    <div className="teacher-profile-top">
                        <TeacherAvatar teacher={teacher} large />
                        <div className="profile-info">
                            <div className="name-row">
                                <h3>{teacher.full_name || 'Unknown teacher'}</h3>
                                <button
                                    className="star-btn"
                                    aria-label={teacher.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                    onClick={() => onToggleFavorite(teacher.id)}
                                >{teacher.favorite ? '★' : '☆'}</button>
                            </div>
                            <p className="speciality-bold">{teacher.course}</p>
                            <p className="info-line">{[teacher.city, teacher.country].filter(Boolean).join(', ') || 'Unknown location'}</p>
                            <p className="info-line">{teacher.age ?? 'Unknown age'}, {teacher.gender || 'Unknown gender'}</p>
                            <p className="info-line">
                                Next birthday: {daysUntilBirthday === null
                                    ? 'Unknown'
                                    : daysUntilBirthday === 0
                                        ? 'Today!'
                                        : `in ${daysUntilBirthday} ${daysUntilBirthday === 1 ? 'day' : 'days'}`}
                            </p>
                            {teacher.email && <a href={`mailto:${teacher.email}`} className="info-link">{teacher.email}</a>}
                            {teacher.phone && <p className="info-line">{teacher.phone}</p>}
                        </div>
                    </div>
                    <p className="teacher-description">{teacher.note}</p>
                    <TeacherMap teacher={teacher} />
                </div>
            </section>
        </div>
    );
}
