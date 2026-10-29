const FIELDS = {
    full_name: { type: 'string', caption: 'Name' },
    course: { type: 'string', caption: 'Speciality' },
    age: { type: 'number', caption: 'Age' },
    b_date: { type: 'string', caption: 'Date of birth' },
    gender: { type: 'string', caption: 'Gender' },
    country: { type: 'string', caption: 'Country' },
    city: { type: 'string', caption: 'City' },
    email: { type: 'string', caption: 'Email' },
    phone: { type: 'string', caption: 'Phone' },
    favorite: { type: 'string', caption: 'Favorite' },
    note: { type: 'string', caption: 'Notes' },
    id: { type: 'string', caption: 'Teacher ID' }
};

export const createTeacherReport = (teachers, mode) => {
    const rows = teachers.map((teacher, index) => ({
        full_name: teacher.full_name || 'Unknown teacher',
        course: teacher.course || 'Unknown',
        age: Number.isFinite(teacher.age) ? teacher.age : null,
        b_date: teacher.b_date?.split('T')[0] || '',
        gender: teacher.gender || 'Unknown',
        country: teacher.country || 'Unknown',
        city: teacher.city || 'Unknown',
        email: teacher.email || '',
        phone: teacher.phone || '',
        favorite: teacher.favorite ? 'Yes' : 'No',
        note: teacher.note || '',
        id: String(teacher.id ?? index)
    }));
    const byCountry = mode === 'country';

    return {
        dataSource: { data: [FIELDS, ...rows] },
        ...(byCountry && {
            slice: {
                rows: [{ uniqueName: 'country', sort: 'asc' }],
                columns: [{ uniqueName: 'Measures' }],
                measures: [{ uniqueName: 'id', aggregation: 'count', caption: 'Teachers' }]
            }
        }),
        options: {
            grid: {
                type: byCountry ? 'classic' : 'flat',
                showHeaders: false,
                showTotals: 'off',
                showGrandTotals: byCountry ? 'on' : 'off',
                showReportFiltersArea: false
            },
            configuratorButton: false,
            showAggregationLabels: false
        },
        formats: [{ name: '', decimalPlaces: 0, nullValue: 'Unknown' }]
    };
};
