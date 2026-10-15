export default function TeacherAvatar({ teacher, large = false }) {
    const source = teacher.picture_large || teacher.picture_thumbnail;
    const initials = teacher.full_name.trim().split(' ')
        .filter(Boolean).map(part => part[0]).slice(0, 2).join('.').toUpperCase();

    if (source) {
        const photo = (
            <img
                src={source}
                alt={teacher.full_name}
                className={large ? 'profile-photo-large' : undefined}
            />
        );

        return large ? photo : <div className="img-wrapper">{photo}</div>;
    }

    return (
        <div
            className={large ? 'profile-photo-large avatar-initials' : 'avatar-initials'}
            style={{
                backgroundColor: teacher.bg_color,
                ...(large ? { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 } : {})
            }}
        >
            <span>{initials || '?'}</span>
        </div>
    );
}
