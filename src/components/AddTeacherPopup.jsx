import { useState } from 'react';
import { formatUser } from '../utils/teachers.js';

export default function AddTeacherPopup({ onClose, onAddTeacher, countries }) {
    const [error, setError] = useState('');

    const submitTeacher = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const teacher = formatUser({
            full_name: data.get('full_name').trim(),
            course: data.get('course'),
            country: data.get('country'),
            city: data.get('city').trim(),
            email: data.get('email').trim(),
            phone: data.get('phone').trim(),
            b_day: data.get('b_day'),
            gender: data.get('gender'),
            bg_color: data.get('bg_color'),
            note: data.get('note').trim()
        });

        if (!teacher.full_name || !teacher.city) {
            setError('Enter a name and city.');
            return;
        }
        if (teacher.age === null) {
            setError('Enter a valid birth date that is not in the future.');
            return;
        }
        const allowedPhoneCharacters = '0123456789 +-()';
        if (!teacher.phone || !teacher.phone.split('').every(character => allowedPhoneCharacters.includes(character))) {
            setError('Enter a phone number using digits, spaces, +, -, or parentheses.');
            return;
        }

        onAddTeacher(teacher);
    };

    return (
    <div className="popup-overlay" id="add-popup" style={{ display: 'flex' }}>
        <section className="popup-content add-popup-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="popup-header dark-header">
                <h2>Add Teacher</h2>
                <button className="close-btn" aria-label="Close" onClick={onClose}>&times;</button>
            </div>
            
            <form className="add-teacher-form" onSubmit={submitTeacher}>
                <label>
                    Name
                    <input type="text" name="full_name" placeholder="Enter name" required />
                </label>
                
                <label>
                    Speciality
                    <select name="course" required>
                        <option>Mathematics</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                    </select>
                </label>
                
                <div className="form-row">
                    <label>
                        Country
                        <select name="country" defaultValue="Ukraine" required>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        City
                        <input type="text" name="city" required />
                    </label>
                </div>
                
                <div className="form-row">
                    <label>
                        Email
                        <input type="email" name="email" required />
                    </label>
                    <label>
                        Phone
                        <input type="tel" name="phone" required />
                    </label>
                </div>
                
                <label>
                    Date of birth
                    <input type="date" name="b_day" required />
                </label>
                
                <div className="form-row align-center">
                    <div className="sex-radio-group">
                        <span>Sex</span>
                        <label><input type="radio" name="gender" value="male" required /> Male</label>
                        <label><input type="radio" name="gender" value="female" /> Female</label>
                    </div>
                    
                    <label className="color-picker-label">
                        Background color
                        <input name="bg_color" type="color" defaultValue="#ffffff" />
                    </label>
                </div>
                
                <label>
                    Notes (optional)
                    <textarea name="note" rows="4"></textarea>
                </label>
                
                {error && <p>{error}</p>}
                <button type="submit" className="submit-btn full-width-btn">Add</button>
            </form>
        </section>
    </div>
    );
}

