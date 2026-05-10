export const formatTextToISO = (dateFromInput: string): string | null => {
    if (!dateFromInput) return null;

    const date = new Date(dateFromInput);

    return date.toISOString(); 
};



export const formateISOToInput = (dateFromDB: string | Date | undefined): string => {
    if (!dateFromDB) return "";

    const date = new Date(dateFromDB);

    if (isNaN(date.getTime())) return "Invalid Date";

    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

};



export const formatISOToReadableText = (dateFromDB: string | Date | undefined): string => {
    if (!dateFromDB) return "";
    const date = new Date(dateFromDB);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};


export const getDefaultDateTime = (): string => {
    const now = new Date();

    const tzOffset = now.getTimezoneOffset() * 60000;

    const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);

    return localISOTime;
};

// "2026-04-11T20:00:00.000Z" iso date
// ISODate("2026-04-11T20:00:00.000Z") iso date in mongodb