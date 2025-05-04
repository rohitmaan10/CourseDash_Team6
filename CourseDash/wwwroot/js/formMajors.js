window.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://fargo-api-ts.datausa.io/tesseract/data.jsonrecords?cube=ipeds_completions&drilldowns=CIP6,Year,University&include=University:137351;Degree:5&locale=en&measures=Completions&parents=true&Year=2022";

    const majorSelect = document.getElementById("major");

    // Ensure the select element exists
    if (!majorSelect) {
        console.error("Dropdown element with id 'major' not found.");
        return;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(json => {
            const records = json.data;
            console.log("Fetched Records:", records);

            // Clear any existing options
            majorSelect.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select a Major";
            majorSelect.appendChild(defaultOption);

            const uniqueMajors = new Set();

            records.forEach(item => {
                const majorName = item["CIP2"];
                if (majorName && !uniqueMajors.has(majorName)) {
                    uniqueMajors.add(majorName);

                    const option = document.createElement("option");
                    option.value = majorName;
                    option.textContent = majorName;
                    majorSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error("Error loading majors:", error);
        });
});
