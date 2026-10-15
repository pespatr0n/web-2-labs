import { useRef, useState } from 'react';
import { randomUserMock, additionalUsers } from '../FE4U-Lab2-mock.js';
import { mergeAndFormatUsers } from './utils/teachers.js';
import TeacherList from './components/TeacherList.jsx';
import TeacherInfoPopup from './components/TeacherInfoPopup.jsx';
import Statistics from './components/Statistics.jsx';

function Header() {
    return (
    <header>
        <div className="header-top">
            <a href="#" className="logo">Teachinder</a>
            <form className="search-group">
                <input type="text" placeholder="Name, note or age to search" />
                <button type="button">Search</button>
            </form>
        </div>
        
        <div className="header-bottom">
            <nav>
                <a href="#">Teachers</a>
                <a href="#">Statistics</a>
                <a href="#">Favorites</a>
                <a href="#">About</a>
            </nav>
            <button className="add-btn">Add teacher</button>
        </div>
    </header>
    );
}

function Main({ teachers, onSelectTeacher }) {
    const [country, setCountry] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [gender, setGender] = useState('');
    const [onlyFavorites, setOnlyFavorites] = useState(false);
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
        if (country && teacher.country !== country) return false;
        if (gender && teacher.gender !== gender) return false;
        if (onlyFavorites && !teacher.favorite) return false;
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
                    <input type="checkbox" /> Only with photo
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

function Footer() {
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
            <button className="add-btn">Add teacher</button>
        </div>
    </footer>
    );
}

function AddTeacherPopup() {
    return (
    <div className="popup-overlay" id="add-popup">
        <section className="popup-content add-popup-content">
            <div className="popup-header dark-header">
                <h2>Add Teacher</h2>
                <button className="close-btn" aria-label="Close">&times;</button>
            </div>
            
            <form className="add-teacher-form">
                <label>
                    Name
                    <input type="text" placeholder="Enter name" />
                </label>
                
                <label>
                    Speciality
                    <select>
                        <option>Mathematics</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                    </select>
                </label>
                
                <div className="form-row">
                    <label>
                        Country
                        <select>
                            <option>Ukraine</option>
                        </select>
                    </label>
                    <label>
                        City
                        <input type="text" />
                    </label>
                </div>
                
                <div className="form-row">
                    <label>
                        Email
                        <input type="email" />
                    </label>
                    <label>
                        Phone
                        <input type="tel" />
                    </label>
                </div>
                
                <label>
                    Date of birth
                    <input type="date" />
                </label>
                
                <div className="form-row align-center">
                    <div className="sex-radio-group">
                        <span>Sex</span>
                        <label><input type="radio" name="sex" value="male" /> Male</label>
                        <label><input type="radio" name="sex" value="female" /> Female</label>
                    </div>
                    
                    <label className="color-picker-label">
                        Background color
                        <input type="color" defaultValue="#ffffff" />
                    </label>
                </div>
                
                <label>
                    Notes (optional)
                    <textarea rows="4"></textarea>
                </label>
                
                <button type="submit" className="submit-btn full-width-btn">Add</button>
            </form>
        </section>
    </div>
    );
}

export default function App() {
    const [teachers, setTeachers] = useState(() => mergeAndFormatUsers(randomUserMock, additionalUsers));
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const selectedTeacher = teachers.find(teacher => teacher.id === selectedTeacherId);

    const toggleFavorite = (id) => {
        setTeachers(current => current.map(teacher =>
            teacher.id === id ? { ...teacher, favorite: !teacher.favorite } : teacher
        ));
    };

    return (
        <>
            <Header />
            <Main teachers={teachers} onSelectTeacher={setSelectedTeacherId} />
            <Footer />
            {selectedTeacher && (
                <TeacherInfoPopup
                    teacher={selectedTeacher}
                    onClose={() => setSelectedTeacherId(null)}
                    onToggleFavorite={toggleFavorite}
                />
            )}
            <AddTeacherPopup />
        </>
    );
}
