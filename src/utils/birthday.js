import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export const getDaysUntilBirthday = (birthDate, referenceDate = dayjs()) => {
    if (typeof birthDate !== 'string') return null;

    const birth = dayjs(birthDate.split('T')[0], 'YYYY-MM-DD', true);
    const today = dayjs(referenceDate).startOf('day');

    if (!birth.isValid() || !today.isValid() || birth.isAfter(today)) return null;

    let nextBirthday = birth.year(today.year());
    if (nextBirthday.isBefore(today)) {
        nextBirthday = birth.year(today.year() + 1);
    }

    return nextBirthday.diff(today, 'day');
};
