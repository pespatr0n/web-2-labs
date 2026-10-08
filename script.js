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
console.log(finalUsersArray);
