import { useMemo, useState } from 'react'

function useSearch<T>(data: T[], key: keyof T) {
    const [query, setQuery] = useState('');
    const filteredData = useMemo (() => {
        return data.filter( item => String(item[key]).toLocaleLowerCase().includes(query.toLowerCase()))
    }, [data, query, key])
    return { query, setQuery, filteredData };
}

export default useSearch;
