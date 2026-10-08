const COURSES = [
    "Mathematics", "Physics", "English", "Computer Science",
    "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"
];

const getRandomCourse = () => {
    const randomIndex = Math.floor(Math.random() * COURSES.length);
    return COURSES[randomIndex];
};

const formatUser = (user) => {
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
        gender: user.gender,
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

const mergeAndFormatUsers = (mockUsers, extraUsers) => {
    const allUsers = [...mockUsers, ...extraUsers].map(formatUser);

    const uniqueUsersMap = new Map();

    allUsers.forEach(user => {
        uniqueUsersMap.set(user.email, user);
    });

    return Array.from(uniqueUsersMap.values());
};

const finalUsersArray = mergeAndFormatUsers(randomUserMock, additionalUsers);
console.log("finalUsersArray: ");
console.log(finalUsersArray);

//task 2

const validateUser = (user) => {
    const isCapitalizedString = (value) => {
        if (value === "") return true; 
        return typeof value === 'string' && value.length > 0 && value[0] === value[0].toUpperCase();
    };

    const stringFields = ['full_name', 'gender', 'note', 'state', 'city', 'country'];
    for (let field of stringFields) {
        if (!isCapitalizedString(user[field])) {
            return false;
        }
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


const validUsers = finalUsersArray.filter(validateUser);
console.log("validUsers: ");
console.log(validUsers);

//task 3

const filterUsers = (usersArray, searchParams) => {
    return usersArray.filter(user => {
        for (let key in searchParams) {
            if (user[key] !== searchParams[key]) {
                return false;
            }
        }
        return true; 
    });
};

const criteria = {
    country: "Germany",
    gender: "male"
};

const filteredUsers = filterUsers(finalUsersArray, criteria);
console.log("filteredUsers: ");
console.log(filteredUsers);

//task 4
const sortUsers = (usersArray, sortBy, order) => {
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

const sortedByAgeDesc = sortUsers(finalUsersArray, 'age', 'desc');
console.log("sortedByAgeDesc: ");
console.log(sortedByAgeDesc);
const sortedByAgeAsc = sortUsers(finalUsersArray, 'age', 'asc');
console.log("sortedByAgeAsc: ");
console.log(sortedByAgeAsc);
