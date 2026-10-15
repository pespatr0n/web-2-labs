const COURSES = [
    "Mathematics", "Physics", "English", "Computer Science",
    "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"
];

export const getRandomCourse = () => {
    const randomIndex = Math.floor(Math.random() * COURSES.length);
    return COURSES[randomIndex];
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
    const age = user.dob?.age || null;
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
        course: getRandomCourse(),
        bg_color: typeof user.bg_color === 'string' ? user.bg_color : "#ffffff", // Дефолтний колір
        note: typeof user.note === 'string' ? user.note : ""
    };
};

export const mergeAndFormatUsers = (mockUsers, extraUsers) => {
    const allUsers = [...mockUsers, ...extraUsers].map(formatUser);

    const uniqueUsersMap = new Map();

    allUsers.forEach(user => {
        uniqueUsersMap.set(user.email, user);
    });

    return Array.from(uniqueUsersMap.values());
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
