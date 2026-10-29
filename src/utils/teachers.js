import _ from 'lodash';

const COURSES = [
    "Mathematics", "Physics", "English", "Computer Science",
    "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"
];

export const getRandomCourse = () => _.sample(COURSES);

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

const getUserId = (user) => {
    for (const value of [user.login?.uuid, user.id]) {
        if (typeof value !== 'string' && typeof value !== 'number') continue;
        if (typeof value === 'number' && !Number.isFinite(value)) continue;

        const id = String(value).trim();
        if (id && !['undefined', 'null', '[object Object]'].includes(id)) return id;
    }

    return null;
};

export const formatUser = (user) => {
    const fullName = user.full_name || `${user.name?.first || ''} ${user.name?.last || ''}`.trim();
    const title = _.get(user, 'name.title') || user.title;
    const city = _.get(user, 'location.city') || user.city;
    const state = _.get(user, 'location.state') || user.state;
    const country = _.get(user, 'location.country') || user.country;
    const postcode = _.get(user, 'location.postcode') || user.postcode;
    const coordinates = _.get(user, 'location.coordinates') || user.coordinates;
    const timezone = _.get(user, 'location.timezone') || user.timezone;
    const b_date = _.get(user, 'dob.date') || user.b_day;
    const age = _.get(user, 'dob.age') ?? user.age ?? calculateAge(b_date);
    const picture_large = _.get(user, 'picture.large') || user.picture_large || null;
    const picture_thumbnail = _.get(user, 'picture.thumbnail') || user.picture_thumbnail || null;
    const id = getUserId(user) || crypto.randomUUID();

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

        id: id,
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
        id: getUserId(user) || undefined
    };
};

export const mergeAndFormatUsers = (mockUsers, extraUsers) => {
    const getEmail = (user) => typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';

    const mergedUsers = _.reduce([...mockUsers, ...extraUsers], (users, user) => {
        const fields = getUserFields(user);
        const email = getEmail(fields);
        const id = getUserId(fields);
        let index = email ? _.findIndex(users, existing => getEmail(existing) === email) : -1;

        if (index === -1 && id) {
            index = _.findIndex(users, existing =>
                (!email || !getEmail(existing)) && getUserId(existing) === id
            );
        }

        const updates = _.omitBy(fields, _.isNil);

        if (index === -1) {
            users.push(updates);
        } else {
            users[index] = {
                ...users[index],
                ...updates,
                id: getUserId(users[index]) || updates.id
            };
        }

        return users;
    }, []);

    const reservedIds = new Set(_.compact(_.map(mergedUsers, getUserId)));
    const usedIds = new Set();

    return _.map(mergedUsers, user => {
        let id = getUserId(user);

        if (!id || usedIds.has(id)) {
            do {
                id = crypto.randomUUID();
            } while (reservedIds.has(id) || usedIds.has(id));
        }

        usedIds.add(id);
        return formatUser({ ...user, id });
    });
};

export const validateUser = (user) => {
    const invalid = (error) => ({ isValid: false, error });

    if (!_.isObjectLike(user) || _.isArray(user)) {
        return invalid('User data must be an object.');
    }

    const requiredStrings = [
        ['full_name', 'name'],
        ['city', 'city'],
        ['country', 'country']
    ];
    const missingField = _.find(requiredStrings, ([field]) =>
        typeof user[field] !== 'string' || _.trim(user[field]) === ''
    );
    if (missingField) {
        return invalid(`Enter a ${missingField[1]}.`);
    }

    const invalidTextField = _.find(['note', 'state'], field =>
        !_.isNil(user[field]) && typeof user[field] !== 'string'
    );
    if (invalidTextField) {
        return invalid(`${invalidTextField === 'note' ? 'Notes' : 'State'} must be text.`);
    }

    if (typeof user.b_date !== 'string' || calculateAge(user.b_date) === null) {
        return invalid('Enter a valid birth date that is not in the future.');
    }

    if (!_.includes(['male', 'female'], user.gender)) {
        return invalid('Select male or female.');
    }

    if (!_.isInteger(user.age) || user.age < 0) {
        return invalid('Age must be a non-negative whole number.');
    }

    if (typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        return invalid('Enter a valid email address.');
    }


    if (
        typeof user.phone !== 'string' ||
        !/^[0-9\s+().-]+$/.test(user.phone) ||
        !/[0-9]/.test(user.phone)
    ) {
        return invalid('Enter a phone number with at least one digit using digits, spaces, +, -, dots, or parentheses.');
    }

    return { isValid: true, error: null };
};

export async function fetchTeachers(count, signal) {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`, { signal });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data?.error) {
        throw new Error(data.error);
    }
    if (!_.isArray(data?.results)) {
        throw new Error('Invalid API response: results must be an array.');
    }

    const users = _.chain(data.results)
        .filter(user => _.isObjectLike(user) && !_.isArray(user))
        .map(formatUser)
        .filter(user => validateUser(user).isValid)
        .value();

    const invalidCount = data.results.length - users.length;
    if (invalidCount > 0) {
        console.warn(`Skipped ${invalidCount} invalid API users.`);
    }

    return users;
}

export async function fetchSavedTeachers(signal) {
    const response = await fetch('http://127.0.0.1:3000/teachers', { signal });

    if (!response.ok) {
        throw new Error(`Unable to load saved teachers: HTTP ${response.status}`);
    }

    const teachers = await response.json();
    if (!_.isArray(teachers)) {
        throw new Error('Invalid saved teachers response: expected an array.');
    }

    return _.filter(teachers, teacher => validateUser(teacher).isValid);
}

export async function createTeacher(teacher) {
    const validation = validateUser(teacher);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    const response = await fetch('http://127.0.0.1:3000/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher)
    });

    if (!response.ok) {
        throw new Error(`Unable to save teacher: HTTP ${response.status}`);
    }

    return response.json();
}

export const filterUsers = (usersArray, searchParams) =>
    _.filter(usersArray, user => _.every(searchParams, (value, key) => user[key] === value));

export const sortUsers = (usersArray, sortBy, order) => {
    const isMissing = value => _.isNil(value) || value === '';

    return _.orderBy(usersArray, [
        user => isMissing(user[sortBy]),
        user => {
            const value = user[sortBy];
            if (isMissing(value)) return null;
            return typeof value === 'string' ? _.toLower(value) : value;
        }
    ], ['asc', order === 'desc' ? 'desc' : 'asc']);
};

export const findUser = (usersArray, searchField, searchValue) => {
    return _.find(usersArray, user => {
        const value = user[searchField];

        if (typeof value === 'string' && typeof searchValue === 'string') {
            return _.includes(_.toLower(value), _.toLower(searchValue));
        }

        return value === searchValue;
    });
};

export const getPercentage = (usersArray, condition) => {
    if (usersArray.length === 0) return 0;

    return (_.filter(usersArray, condition).length / usersArray.length) * 100;
};
