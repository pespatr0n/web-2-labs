import { useRef, useState, useEffect } from 'react';
import { formatUser, validateUser } from './utils/teachers.js';
import TeacherList from './components/TeacherList.jsx';
import TeacherInfoPopup from './components/TeacherInfoPopup.jsx';
import Statistics from './components/Statistics.jsx';
import AddTeacherPopup from './components/AddTeacherPopup.jsx';

function Header({ onSearch, onAddTeacher }) {
    const [query, setQuery] = useState('');

    const submitSearch = (event) => {
        event.preventDefault();
        onSearch(query.trim().toLowerCase());
    };

    return (
    <header>
        <div className="header-top">
            <a href="#" className="logo">Teachinder</a>
            <form className="search-group" onSubmit={submitSearch}>
                <input
                    type="text"
                    placeholder="Name, note or age to search"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
        
        <div className="header-bottom">
            <nav>
                <a href="#">Teachers</a>
                <a href="#">Statistics</a>
                <a href="#">Favorites</a>
                <a href="#">About</a>
            </nav>
            <button className="add-btn" onClick={onAddTeacher}>Add teacher</button>
        </div>
    </header>
    );
}

function Main({ teachers, onSelectTeacher, search }) {
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
        </section>

        <div className="section-separator"></div>

        <Statistics teachers={teachers} />

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

function Footer({ onAddTeacher }) {
    return (
    <footer>
        <div className="footer-text">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque facere, hic impedit itaque molestiae sit tempore? Ea in mollitia natus rerum voluptates. Ea ex excepturi facere tempora. Aliquid asperiores hic impedit iusto natus quaerat ratione sit? Culpa iusto optio voluptas voluptate. Enim eveniet fugit iure maiores molestiae, praesentium quia.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam eligendi illum in inventore ipsum odio officiis omnis quisquam sed tempora?</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque esse expedita id iusto mollitia, odit sint ullam veritatis vero?</p>
        </div>

        <div className="footer-bottom">
            <nav>
                <a href="#">Teachers</a>
                <a href="#">Statistics</a>
                <a href="#">Favorites</a>
                <a href="#">About</a>
            </nav>
            <button className="add-btn" onClick={onAddTeacher}>Add teacher</button>
        </div>
    </footer>
    );
}

export default function App() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const countries = [...new Set(['Ukraine', ...teachers.map(teacher => teacher.country).filter(Boolean)])].sort();
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const selectedTeacher = teachers.find(teacher => teacher.id === selectedTeacherId);

    useEffect(() => {
        const controller = new AbortController();

        async function loadUsers() {
            try {
                const response = await fetch('https://randomuser.me/api/?results=50', {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();

                if (data?.error) {
                    throw new Error(data.error);
                }

                if (!Array.isArray(data?.results)) {
                    throw new Error('Invalid API response: results must be an array.');
                }

                if (!controller.signal.aborted) {
                    const loadedTeachers = data.results
                        .filter(user => user && typeof user === 'object' && !Array.isArray(user))
                        .map(formatUser)
                        .filter(validateUser);

                    const invalidCount = data.results.length - loadedTeachers.length;
                    if (invalidCount > 0) {
                        console.warn(`Skipped ${invalidCount} invalid API users.`);
                    }

                    setTeachers(current => [...loadedTeachers, ...current]);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError('Unable to load teachers. Please refresh the page to try again.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadUsers();

        return () => controller.abort();
    }, []);

    const addTeacher = (teacher) => {
        setTeachers(current => [...current, teacher]);
        setAddPopupOpen(false);
    };

    const toggleFavorite = (id) => {
        setTeachers(current => current.map(teacher =>
            teacher.id === id ? { ...teacher, favorite: !teacher.favorite } : teacher
        ));
    };

    return (
        <>
            <Header onSearch={setSearch} onAddTeacher={() => setAddPopupOpen(true)} />
            {loading ? (
                <main><p role="status">Loading teachers...</p></main>
            ) : error ? (
                <main><p role="alert">{error}</p></main>
            ) : (
                <Main teachers={teachers} onSelectTeacher={setSelectedTeacherId} search={search} />
            )}
            <Footer onAddTeacher={() => setAddPopupOpen(true)} />
            {selectedTeacher && (
                <TeacherInfoPopup
                    teacher={selectedTeacher}
                    onClose={() => setSelectedTeacherId(null)}
                    onToggleFavorite={toggleFavorite}
                />
            )}
            {addPopupOpen && (
                <AddTeacherPopup
                    onClose={() => setAddPopupOpen(false)}
                    onAddTeacher={addTeacher}
                    countries={countries}
                />
            )}
        </>
    );
}
