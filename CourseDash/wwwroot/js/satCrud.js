document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("satForm");
    const tableBody = document.getElementById("satTableBody");

    // Load existing entries on page load
    loadEntries();

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const satScore = document.getElementById("satScore").value;
        const major = document.getElementById("major").value;
        const message = document.getElementById("message").value;
        const entryId = form.getAttribute("data-edit-id");

        if (!satScore || !major || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const entries = JSON.parse(localStorage.getItem("satEntries")) || [];

        if (entryId) {
            // Update existing entry
            const updatedEntries = entries.map(entry => {
                if (entry.id === parseInt(entryId)) {
                    return { ...entry, satScore, major, message };
                }
                return entry;
            });
            localStorage.setItem("satEntries", JSON.stringify(updatedEntries));
            form.removeAttribute("data-edit-id");
        } else {
            // Add new entry
            const newEntry = {
                id: Date.now(),
                satScore,
                major,
                message
            };
            entries.push(newEntry);
            localStorage.setItem("satEntries", JSON.stringify(entries));
        }

        form.reset();
        renderTable();
    });

    // Load entries from local storage
    function loadEntries() {
        renderTable();
    }

    function renderTable() {
        tableBody.innerHTML = "";
        const entries = JSON.parse(localStorage.getItem("satEntries")) || [];
        entries.forEach(entry => appendEntryToTable(entry));
    }

    function appendEntryToTable(entry) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="padding: 8px;text-align: center;">${entry.satScore}</td>
            <td style="padding: 8px;text-align: center;">${entry.major}</td>
            <td style="padding: 8px;text-align: center;">${entry.message}</td>
           <td style="padding: 8px;text-align: center;">
             <button onclick="editEntry(${entry.id})" title="Edit" style="background: none; border: none; cursor: pointer; color: green;">
             <i class="fas fa-pencil-alt"></i>
            </button>
             <button onclick="deleteEntry(${entry.id})" title="Delete" style="background: none; border: none; cursor: pointer; color: red;">
                 <i class="fas fa-trash-alt"></i>
                 </button>
            </td>
        `;
        tableBody.appendChild(row);
    }

    // Make functions available globally
    window.editEntry = function (id) {
        const entries = JSON.parse(localStorage.getItem("satEntries")) || [];
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        document.getElementById("satScore").value = entry.satScore;
        document.getElementById("major").value = entry.major;
        document.getElementById("message").value = entry.message;

        form.setAttribute("data-edit-id", id);
    };

    window.deleteEntry = function (id) {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        const entries = JSON.parse(localStorage.getItem("satEntries")) || [];
        const updatedEntries = entries.filter(e => e.id !== id);
        localStorage.setItem("satEntries", JSON.stringify(updatedEntries));
        renderTable();
    };
});
