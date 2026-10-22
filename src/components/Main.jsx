import { useRef, useState } from 'react';
import TeacherList from './TeacherList.jsx';
import Statistics from './Statistics.jsx';

export default function Main({ teachers, onSelectTeacher, search, onLoadMore, loadingMore, loadMoreError, loadWarning }) {
    const [country, setCountry] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [gender, setGender] = useState('');
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
    const favoritesRef = useRef(null);

    const scrollFavorites = (direction) => {
        const list = favoritesRef.current;
        const card = list.querySelector('.teacher-card');
        if (!card) return;

        list.scrollBy({ left: direction * (card.offsetWidth + 30), behavior: 'smooth' });
    };

    const countries = [...new Set(teachers.map(teacher => teacher.country).filter(Boolean))].sort();
    const [minAge, maxAge = Infinity] = ageRange.split('-').map(Number);
    const filteredTeachers = teachers.filter(teacher => {
        if (
            search &&
            !teacher.full_name.toLowerCase().includes(search) &&
            !teacher.note.toLowerCase().includes(search) &&
            teacher.age !== Number(search)
        ) {
            return false;
        }
        if (country && teacher.country !== country) return false;
        if (gender && teacher.gender !== gender) return false;
        if (onlyFavorites && !teacher.favorite) return false;
        if (onlyWithPhoto && !teacher.picture_large && !teacher.picture_thumbnail) return false;
        if (ageRange && (!Number.isFinite(teacher.age) || teacher.age < minAge || teacher.age > maxAge)) {
            return false;
        }
        return true;
    });

    return (
    <main>
        {loadWarning && <p role="alert">{loadWarning}</p>}
        <div className="section-separator"></div>

        <section className="top-teachers">
            <h2>Top Teachers</h2>

            <form className="filters">
                <label>Age
                    <select value={ageRange} onChange={event => setAgeRange(event.target.value)}>
                        <option value="">All ages</option>
                        <option value="0-17">Under 18</option>
                        <option value="18-31">18-31</option>
                        <option value="32-45">32-45</option>
                        <option value="46-60">46-60</option>
                        <option value="61">61+</option>
                    </select>
                </label>
                <label>Country
                    <select value={country} onChange={event => setCountry(event.target.value)}>
                        <option value="">All countries</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </label>
                <label>Sex
                    <select value={gender} onChange={event => setGender(event.target.value)}>
                        <option value="">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" checked={onlyWithPhoto} onChange={event => setOnlyWithPhoto(event.target.checked)} /> Only with photo
                </label>
                <label>
                    <input type="checkbox" checked={onlyFavorites} onChange={event => setOnlyFavorites(event.target.checked)} /> Only favorites
                </label>
            </form>

            <TeacherList teachers={filteredTeachers} onSelectTeacher={onSelectTeacher} />
            <div className="load-more">
                <button type="button" onClick={onLoadMore} disabled={loadingMore}>
                    {loadingMore ? 'Завантаження...' : 'Далі'}
                </button>
                {loadMoreError && <p role="alert">{loadMoreError}</p>}
            </div>
        </section>

        <div className="section-separator"></div>

        <Statistics
            teachers={filteredTeachers}
            filterKey={JSON.stringify([search, country, ageRange, gender, onlyFavorites, onlyWithPhoto])}
        />

        <div className="section-separator"></div>

        <section className="favorites">
            <h2>Favorites</h2>

            <div className="slider-container">
                <button className="slider-arrow left-arrow" onClick={() => scrollFavorites(-1)}>&lt;</button>

                <TeacherList
                    teachers={teachers.filter(teacher => teacher.favorite)}
                    onSelectTeacher={onSelectTeacher}
                    listRef={favoritesRef}
                    favorites
                />

                <button className="slider-arrow right-arrow" onClick={() => scrollFavorites(1)}>&gt;</button>
            </div>
        </section>
    </main>
    );
}
