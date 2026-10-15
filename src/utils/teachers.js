const COURSES = [
    "Mathematics", "Physics", "English", "Computer Science",
    "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"
];

export const getRandomCourse = () => {
    const randomIndex = Math.floor(Math.random() * COURSES.length);
    return COURSES[randomIndex];
};

export const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    if (Number.isNaN(birth.getTime()) || birth > today) {
        return null;
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age;
};

export const formatUser = (user) => {
    const fullName = user.full_name || `${user.name?.first || ''} ${user.name?.last || ''}`.trim();
    const title = user.name?.title || user.title;
    const city = user.location?.city || user.city;
    const state = user.location?.state || user.state;
    const country = user.location?.country || user.country;
    const postcode = user.location?.postcode || user.postcode;
    const coordinates = user.location?.coordinates || user.coordinates;
    const timezone = user.location?.timezone || user.timezone;
    const b_date = user.dob?.date || user.b_day;
    const age = user.dob?.age ?? user.age ?? calculateAge(b_date);
    const picture_large = user.picture?.large || user.picture_large || null;
    const picture_thumbnail = user.picture?.thumbnail || user.picture_thumbnail || null;
    const id = user.login?.uuid || user.id;

    return {
        gender: typeof user.gender === 'string' ? user.gender.trim().toLowerCase() : user.gender,
        title: title,
        full_name: fullName,
        city: city,
        state: state,
        country: country,
        postcode: postcode,
        coordinates: coordinates,
        timezone: timezone,
        email: user.email,
        b_date: b_date,
        age: age,
        phone: user.phone,
        picture_large: picture_large,
        picture_thumbnail: picture_thumbnail,

        id: String(id),
        favorite: typeof user.favorite === 'boolean' ? user.favorite : false,
        course: user.course ?? getRandomCourse(),
        bg_color: typeof user.bg_color === 'string' ? user.bg_color : "#ffffff", // Дефолтний колір
        note: typeof user.note === 'string' ? user.note : ""
    };
};

const getUserFields = (user) => {
    const { name, location, dob, picture, login, ...fields } = user;

    return {
        ...fields,
        full_name: user.full_name ?? (name ? `${name.first ?? ''} ${name.last ?? ''}`.trim() : undefined),
        title: name?.title ?? user.title,
        city: location?.city ?? user.city,
        state: location?.state ?? user.state,
        country: location?.country ?? user.country,
        postcode: location?.postcode ?? user.postcode,
        coordinates: location?.coordinates ?? user.coordinates,
        timezone: location?.timezone ?? user.timezone,
        b_day: dob?.date ?? user.b_day,
        age: dob?.age ?? user.age,
        picture_large: picture?.large ?? user.picture_large,
        picture_thumbnail: picture?.thumbnail ?? user.picture_thumbnail,
        id: login?.uuid ?? user.id
    };
};

export const mergeAndFormatUsers = (mockUsers, extraUsers) => {
    const mergedUsers = [];
    const getEmail = (user) => typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';
    const getId = (user) => {
        if (typeof user.id !== 'string' && typeof user.id !== 'number') return '';
        return String(user.id).trim();
    };

    for (const user of [...mockUsers, ...extraUsers]) {
        const fields = getUserFields(user);
        const email = getEmail(fields);
        const id = getId(fields);
        let index = email ? mergedUsers.findIndex(existing => getEmail(existing) === email) : -1;

        if (index === -1 && id) {
            index = mergedUsers.findIndex(existing =>
                (!email || !getEmail(existing)) && getId(existing) === id
            );
        }

        const updates = Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined && value !== null)
        );

        if (index === -1) {
            mergedUsers.push(updates);
        } else {
            mergedUsers[index] = { ...mergedUsers[index], ...updates };
        }
    }

    return mergedUsers.map(formatUser);
};

export const validateUser = (user) => {
    const isCapitalizedString = (value) => {
        if (value === "") return true;
        return typeof value === 'string' && value.length > 0 && value[0] === value[0].toUpperCase();
    };

    const stringFields = ['full_name', 'note', 'state', 'city', 'country'];
    for (let field of stringFields) {
        if (!isCapitalizedString(user[field])) {
            return false;
        }
    }

    if (!['male', 'female'].includes(user.gender)) {
        return false;
    }

    if (typeof user.age !== 'number' || isNaN(user.age)) {
        return false;
    }

    if (typeof user.email !== 'string' || !user.email.includes('@')) {
        return false;
    }


    if (typeof user.phone !== 'string' || user.phone.trim() === '') {
        return false;
    }

    const allowedChars = "0123456789 +-()";
    for (let i = 0; i < user.phone.length; i++) {
        if (!allowedChars.includes(user.phone[i])) {
            return false;
        }
    }

    return true;
};

export const filterUsers = (usersArray, searchParams) => {
    return usersArray.filter(user => {
        for (let key in searchParams) {
            if (user[key] !== searchParams[key]) {
                return false;
            }
        }
        return true;
    });
};

export const sortUsers = (usersArray, sortBy, order) => {
    return [...usersArray].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
            if (order === 'desc') return 1;
            return -1;
        }
        if (a[sortBy] > b[sortBy]) {
            if (order === 'desc') return -1;
            return 1;
        }
        return 0;
    });
};

export const findUser = (usersArray, searchField, searchValue) => {
    return usersArray.find(user => {
        const value = user[searchField];

        if (typeof value === 'string' && typeof searchValue === 'string') {
            return value.toLowerCase().includes(searchValue.toLowerCase());
        }

        return value === searchValue;
    });
};

export const getPercentage = (usersArray, condition) => {
    if (usersArray.length === 0) return 0;

    let count = 0;
    for (let user of usersArray) {
        if (condition(user)) {
            count++;
        }
    }

    return (count / usersArray.length) * 100;
};
