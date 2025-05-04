class Submission {
    constructor(storageKey = 'submissions') {
        this.storageKey = storageKey;
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    getById(id) {
        return this.getAll().find(entry => entry.id === id);
    }

    add(entry) {
        const entries = this.getAll();
        entry.id = Date.now().toString();  // unique ID based on timestamp
        entries.push(entry);
        localStorage.setItem(this.storageKey, JSON.stringify(entries));
        return entry;
    }

    update(id, updatedData) {
        const entries = this.getAll();
        const index = entries.findIndex(entry => entry.id === id);
        if (index !== -1) {
            entries[index] = { ...entries[index], ...updatedData };
            localStorage.setItem(this.storageKey, JSON.stringify(entries));
        }
    }

    delete(id) {
        const entries = this.getAll().filter(entry => entry.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }
}

export default Submission;
