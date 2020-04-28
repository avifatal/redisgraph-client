export const useHistory = () => {
    let all : [{date?: number, query?: string}] = [{}];
    const fetch = () => {
        var data = localStorage.getItem('queries');
        all = JSON.parse(data || '[]')
    }
    
    const add = (q) => {
        all.unshift({date: Date.now(), query: q});
        localStorage.setItem('queries', JSON.stringify(all));
    }
    fetch();
    return {all, add}
}
