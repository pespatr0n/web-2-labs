import teacherPhoto from '../img/person1.jpg';

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

function Main() {
    return (
    <main>
        <div className="section-separator"></div>

        <section className="top-teachers">
            <h2>Top Teachers</h2>

            <form className="filters">
                <label>Age
                    <select>
                        <option>18-31</option>
                    </select>
                </label>
                <label>Region
                    <select>
                        <option>Europe</option>
                    </select>
                </label>
                <label>Sex
                    <select>
                        <option>Male</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" /> Only with photo
                </label>
                <label>
                    <input type="checkbox" /> Only favorites
                </label>
            </form>

            <div className="teachers-grid">
                <article className="teacher-card">
                    <div className="img-wrapper">
                        <img src={teacherPhoto} alt="Ihor Tkachuk" />
                    </div>
                    <h3>Ihor Tkachuk</h3>
                    <p className="speciality">Chemistry</p>
                    <p className="country">Ukraine</p>
                </article>

                <article className="teacher-card">
                    <div className="avatar-initials"><span>A.M</span></div>
                    <h3>Anna Muzychuk</h3>
                    <p className="speciality">Chess</p>
                    <p className="country">Belarus</p>
                </article>
            </div>
        </section>

        <div className="section-separator"></div>

        <section className="statistics">
            <h2>Statistics</h2>

            <table>
                <thead>
                    <tr>
                        <th>Name <span className="sort-arrow">&darr;</span></th>
                        <th>Speciality <span className="sort-arrow">&darr;</span></th>
                        <th>Age <span className="sort-arrow">&darr;</span></th>
                        <th>Gender <span className="sort-arrow">&darr;</span></th>
                        <th>Nationality <span className="sort-arrow">&darr;</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Daisy Alexander</td>
                        <td>Chemistry</td>
                        <td>28</td>
                        <td>Female</td>
                        <td>Vietnam</td>
                    </tr>
                    <tr>
                        <td>Julia Bradley</td>
                        <td>Math</td>
                        <td>26</td>
                        <td>Female</td>
                        <td>USA</td>
                    </tr>
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

        <div className="section-separator"></div>

        <section className="favorites">
            <h2>Favorites</h2>

            <div className="slider-container">
                <button className="slider-arrow left-arrow">&lt;</button>

                <div className="favorites-grid">
                    <article className="teacher-card">
                        <div className="img-wrapper">
                            <img src={teacherPhoto} alt="Ihor Tkachuk" />
                        </div>
                        <h3>Ihor Tkachuk</h3>
                        <p className="country">Ukraine</p>
                    </article>

                    <article className="teacher-card">
                        <div className="avatar-initials"><span>A.M</span></div>
                        <h3>Anna Makarevich</h3>
                        <p className="country">Belarus</p>
                    </article>
                </div>

                <button className="slider-arrow right-arrow">&gt;</button>
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

function TeacherInfoPopup() {
    return (
    <div className="popup-overlay" id="info-popup">
        <section className="popup-content info-popup-content">
            <div className="popup-header dark-header">
                <h2>Teacher Info</h2>
                <button className="close-btn" aria-label="Close">&times;</button>
            </div>
            
            <div className="teacher-details">
                <div className="teacher-profile-top">
                    <img src={teacherPhoto} alt="Ihor Tkachuk" className="profile-photo-large" />
                    <div className="profile-info">
                        <div className="name-row">
                            <h3>Ihor Tkachuk</h3>
                            <button className="star-btn" aria-label="Add to favorites">&#10025;</button> 
                        </div>
                        <p className="speciality-bold">Chemistry</p>
                        <p className="info-line">Kyiv, Ukraine</p>
                        <p className="info-line">35, Male</p>
                        <a href="mailto:ihor_tkachuk@domain.com" className="info-link">ihor_tkachuk@domain.com</a>
                        <p className="info-line">+380964993252</p>
                    </div>
                </div>
                
                <p className="teacher-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab autem consectetur culpa cumque, distinctio dolor dolore dolorem doloremque ea explicabo facilis nam nesciunt nisi pariatur perspiciatis porro quis similique temporibus veniam veritatis? A ab ad, aliquam amet consequatur cupiditate debitis deserunt doloribus dolorum earum eius eos minus nostrum odit omnis perferendis...</p>
                <a href="#" className="toggle-map">toggle map</a>
            </div>
        </section>
    </div>
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
    return (
        <>
            <Header />
            <Main />
            <Footer />
            <TeacherInfoPopup />
            <AddTeacherPopup />
        </>
    );
}
