import { useMemo } from 'react';
import { formateISOToInput } from '../functions/Date';


export const useEventDefaultTimes = (initialStart?: string, initialEnd?: string) => {
    return useMemo(() => {
        const startObj = initialStart ? new Date(initialStart) : new Date();

        const endObj = initialEnd 
            ? new Date(initialEnd) 
            : new Date(startObj.getTime() + 60 * 60 * 1000);

        return {
            start: formateISOToInput(startObj),
            end: formateISOToInput(endObj)
        };
    }, [initialStart, initialEnd]);
};