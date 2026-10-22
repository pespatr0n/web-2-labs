import { useState } from 'react';

export default function Header({ onSearch, onAddTeacher }) {
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
