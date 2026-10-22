import { useRef, useState, useEffect } from 'react';
import { fetchTeachers, fetchSavedTeachers, createTeacher } from './utils/teachers.js';
import Header from './components/Header.jsx';
import Main from './components/Main.jsx';
import Footer from './components/Footer.jsx';
import TeacherInfoPopup from './components/TeacherInfoPopup.jsx';
import AddTeacherPopup from './components/AddTeacherPopup.jsx';

export default function App() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loadWarning, setLoadWarning] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState('');
    const loadMoreRequest = useRef(null);
    const [search, setSearch] = useState('');
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const countries = [...new Set(['Ukraine', ...teachers.map(teacher => teacher.country).filter(Boolean)])].sort();
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const selectedTeacher = teachers.find(teacher => teacher.id === selectedTeacherId);

    useEffect(() => {
        const controller = new AbortController();

        async function loadUsers() {
            try {
                const results = await Promise.allSettled([
                    fetchTeachers(50, controller.signal),
                    fetchSavedTeachers(controller.signal)
                ]);

                if (!controller.signal.aborted) {
                    if (results.every(result => result.status === 'rejected')) {
                        throw new Error('Both teacher sources failed.');
                    }

                    const loadedTeachers = results.flatMap(result =>
                        result.status === 'fulfilled' ? result.value : []
                    );
                    setTeachers(current => [
                        ...new Map([...loadedTeachers, ...current].map(teacher => [teacher.id, teacher])).values()
                    ]);
                    setError('');
                    setLoadWarning([
                        results[0].status === 'rejected' ? 'Unable to load RandomUser teachers. Please refresh to try again.' : '',
                        results[1].status === 'rejected' ? 'Unable to load saved teachers. Please refresh to try again.' : ''
                    ].filter(Boolean).join(' '));
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

        return () => {
            controller.abort();
            loadMoreRequest.current?.abort();
        };
    }, []);

    const loadMoreTeachers = async () => {
        if (loadMoreRequest.current) return;

        const controller = new AbortController();
        loadMoreRequest.current = controller;
        setLoadingMore(true);
        setLoadMoreError('');

        try {
            const newTeachers = await fetchTeachers(10, controller.signal);
            if (!controller.signal.aborted) {
                setTeachers(current => [...current, ...newTeachers]);
            }
        } catch (error) {
            if (!controller.signal.aborted) {
                setLoadMoreError('Не вдалося завантажити користувачів. Спробуйте ще раз.');
            }
        } finally {
            if (loadMoreRequest.current === controller) {
                loadMoreRequest.current = null;
                setLoadingMore(false);
            }
        }
    };

    const addTeacher = async (teacher) => {
        const savedTeacher = await createTeacher(teacher);
        setTeachers(current => [...current, savedTeacher]);
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
                <Main
                    teachers={teachers}
                    onSelectTeacher={setSelectedTeacherId}
                    search={search}
                    onLoadMore={loadMoreTeachers}
                    loadingMore={loadingMore}
                    loadMoreError={loadMoreError}
                    loadWarning={loadWarning}
                />
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
