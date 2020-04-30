

export const useHistory = () => {
    const all = () : [{date?: number, query?: string}] => {
        var data = localStorage.getItem('queries');
        return JSON.parse(data || '[]')
    }
    
    const add = (q) => {
        let allItems = all();
        if(allItems[0]?.query?.trim() !== q.trim()){
            allItems.unshift({date: Date.now(), query: q});
            localStorage.setItem('queries', JSON.stringify(allItems));
        }
    }
    const getLast = () => {
        let allItems = all();
        return allItems[0];
    }

    return {all, add, getLast}
}
