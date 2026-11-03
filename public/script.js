
// ========================================
// RENTLY - JAVASCRIPT
// ========================================

// ARRAY TO STORE PROPERTY DATA
let properties = JSON.parse(localStorage.getItem("properties")) || [];
// STORE PROPERTY INQUIRIES
let inquiries = JSON.parse(localStorage.getItem("inquiries")) || [];

// ========================================
// PROPERTY FORM VALIDATION AND STORAGE
// ========================================

const propertyForm = document.getElementById("propertyForm");

function showError(id, message) {
    document.getElementById(id).innerText = message;
}

function clearErrors() {
    const errorIds = [
        "nameError", "typeError", "cityError", "rentError",
        "depositError", "dateError", "facilitiesError",
        "descriptionError"
    ];

    errorIds.forEach(function(id) {
        document.getElementById(id).innerText = "";
    });

    document.getElementById("formMessage").innerText = "";
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// ========================================
// DISPLAY MY LISTINGS
// ========================================

function displayProperties(listToDisplay = properties) {

    const container = document.getElementById("propertyContainer");

    if (!container) return;

    container.innerHTML = "";

    if (listToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">
                    No properties found in My Listings.
                </p>
            </div>
        `;
        return;
    }

    listToDisplay.forEach(function(property) {

        const card = document.createElement("div");
        card.className = "col-md-6 col-lg-4";

        card.innerHTML = `
            <div class="community-property-card">

                <span class="property-type">
                    ${escapeHTML(property.type)}
                </span>

                <h5>${escapeHTML(property.name)}</h5>

                <p>📍 ${escapeHTML(property.city)}</p>

                <div class="community-facilities">
                    <strong>Facilities:</strong>
                    ${escapeHTML(property.facilities)}
                </div>

                <p class="mt-3">
                    ${escapeHTML(property.description)}
                </p>

                <p>
                    <strong>Security Deposit:</strong>
                    ₹${Number(property.deposit).toLocaleString("en-IN")}
                </p>

                <p>
                    <strong>Available From:</strong>
                    ${escapeHTML(property.availableDate)}
                </p>

                <div class="community-price">
                    ₹${Number(property.rent).toLocaleString("en-IN")}
                    <small>/ rental period</small>
                </div>
                <button class="btn btn-primary btn-sm edit-property me-2"
        data-id="${property.id}">
    Edit
</button>
<button class="btn btn-success btn-sm toggle-publish"
        data-id="${property.id}">
    ${property.published ? "Unpublish" : "Publish"}
</button>
                <button class="btn btn-danger btn-sm delete-property"
        data-id="${property.id}">
    Delete
</button>

            </div>
        `;

        container.appendChild(card);
    });
}
// ========================================
// DISPLAY PUBLISHED PROPERTIES PUBLICLY
// ========================================

function displayPublishedProperties() {

    const container = document.getElementById("dynamicPublicProperties");

    if (!container) return;

    container.innerHTML = "";

    const publishedProperties = properties.filter(function(property) {
        return property.published === true;
    });

    publishedProperties.forEach(function(property) {

        const card = document.createElement("div");
        card.className = "col-md-6 col-lg-4";

        card.dataset.city = property.city.toLowerCase();
        card.dataset.type = property.type;
        card.dataset.rent = property.rent;

        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">

                    <span class="badge bg-success">PUBLISHED</span>

                    <h5 class="card-title mt-2">
                        ${escapeHTML(property.name)}
                    </h5>

                    <p>📍 ${escapeHTML(property.city)}</p>

                    <p>
                        <strong>Type:</strong>
                        ${escapeHTML(property.type)}
                    </p>

                    <p>
                        <strong>Facilities:</strong>
                        ${escapeHTML(property.facilities)}
                    </p>

                    <p>${escapeHTML(property.description)}</p>

                    <p>
                        <strong>Deposit:</strong>
                        ₹${Number(property.deposit).toLocaleString("en-IN")}
                    </p>

                    <p>
                        <strong>Available From:</strong>
                        ${escapeHTML(property.availableDate)}
                    </p>

                    <h5 class="text-success">
                        ₹${Number(property.rent).toLocaleString("en-IN")}
                        <small>/ rental period</small>
                    </h5>
            

                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// ========================================
// SUBMIT PROPERTY FORM
// ========================================

propertyForm.addEventListener("submit", function(event) {

    event.preventDefault();
    clearErrors();

    let name = document.getElementById("propertyName").value.trim();
    let type = document.getElementById("propertyType").value;
    let city = document.getElementById("city").value.trim();
    let rentInput = document.getElementById("rent").value;
    let rent = Number(rentInput);
    let depositInput = document.getElementById("deposit").value;
    let deposit = Number(depositInput);
    let date = document.getElementById("availableDate").value;
    let facilities = document.getElementById("facilities").value.trim();
    let description = document.getElementById("description").value.trim();

    let isValid = true;

    if (name === "" || !/^[a-zA-Z ]+$/.test(name)) {
        showError("nameError", "Enter a valid property name.");
        isValid = false;
    }

    if (type === "") {
        showError("typeError", "Please select a property type.");
        isValid = false;
    }

    if (city === "" || !/^[a-zA-Z ]+$/.test(city)) {
        showError("cityError", "Enter a valid city name.");
        isValid = false;
    }

    if (rentInput === "" || rent <= 0) {
        showError("rentError", "Rent must be greater than zero.");
        isValid = false;
    }

    if (depositInput === "" || deposit < 0) {
        showError("depositError", "Enter a valid security deposit.");
        isValid = false;
    }

    if (date === "") {
        showError("dateError", "Please select an availability date.");
        isValid = false;
    } else if (date < new Date().toISOString().split("T")[0]) {
        showError("dateError", "Date cannot be in the past.");
        isValid = false;
    }

    if (facilities === "") {
        showError("facilitiesError", "Please enter available facilities.");
        isValid = false;
    }

    if (description.length < 10) {
        showError("descriptionError", "Description must contain at least 10 characters.");
        isValid = false;
    }

    if (isValid) {

        let property = {
            id: Date.now(),
            published: false,
            name: name,
            type: type,
            city: city,
            rent: rent,
            deposit: deposit,
            availableDate: date,
            facilities: facilities,
            description: description
        };

        properties.push(property);

        localStorage.setItem("properties", JSON.stringify(properties));

        displayProperties();

        document.getElementById("formMessage").innerHTML =
            '<div class="alert alert-success">Property added successfully to My Listings!</div>';

        propertyForm.reset();

        console.log("Saved Properties:", properties);
        console.log("JSON Data:", JSON.stringify(properties));
    }
});


// ========================================
// SEARCH PUBLIC PROPERTIES
// ========================================

const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function() {

    let location = document.getElementById("searchLocation")
        .value.trim().toLowerCase();

    let type = document.getElementById("searchType").value;

    let budget = document.getElementById("searchBudget").value;

    let publicCards = document.querySelectorAll(
    "#publicPropertyContainer > div, #dynamicPublicProperties > div"
);

    let resultCount = 0;

    publicCards.forEach(function(card) {

        let city = card.dataset.city.toLowerCase();
        let propertyType = card.dataset.type;
        let rent = Number(card.dataset.rent);

        let matchesLocation =
            location === "" || city.includes(location);

        let matchesType =
            type === "" || propertyType === type;

        let matchesBudget = true;

        if (budget === "5000") {
            matchesBudget = rent < 5000;
        } else if (budget === "10000") {
            matchesBudget = rent >= 5000 && rent <= 10000;
        } else if (budget === "20000") {
            matchesBudget = rent > 10000 && rent <= 20000;
        } else if (budget === "20001") {
            matchesBudget = rent > 20000;
        }

        let isMatch =
            matchesLocation && matchesType && matchesBudget;

        card.style.display = isMatch ? "" : "none";

        if (isMatch) {
            resultCount++;
        }
    });

    const message = document.getElementById("searchResultMessage");

    message.innerText = resultCount +
        (resultCount === 1
            ? " public property found."
            : " public properties found.");

    document.getElementById("properties").scrollIntoView({
        behavior: "smooth"
    });
});

// ========================================
// DELETE PROPERTY FROM MY LISTINGS
// ========================================

const propertyContainer = document.getElementById("propertyContainer");

propertyContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-property")) {

        let propertyId = Number(event.target.dataset.id);

        let confirmDelete = confirm(
            "Are you sure you want to delete this property?"
        );

        if (confirmDelete) {

            properties = properties.filter(function(property) {
                return property.id !== propertyId;
            });

            localStorage.setItem(
                "properties",
                JSON.stringify(properties)
            );

            displayProperties();

            alert("Property deleted successfully!");
        }
    }
});
// ========================================
// EDIT PROPERTY DETAILS
// ========================================

propertyContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("edit-property")) {

        let propertyId = Number(event.target.dataset.id);

        let property = properties.find(function(item) {
            return item.id === propertyId;
        });

        if (!property) return;

        let name = prompt("Enter property name:", property.name);
        if (name === null) return;

        let city = prompt("Enter city:", property.city);
        if (city === null) return;

        let rent = prompt("Enter monthly rent:", property.rent);
        if (rent === null) return;

        let deposit = prompt("Enter security deposit:", property.deposit);
        if (deposit === null) return;

        let facilities = prompt("Enter facilities:", property.facilities);
        if (facilities === null) return;

        let description = prompt("Enter description:", property.description);
        if (description === null) return;

        // VALIDATION
        if (
            name.trim() === "" ||
            !/^[a-zA-Z ]+$/.test(name.trim()) ||
            city.trim() === "" ||
            !/^[a-zA-Z ]+$/.test(city.trim()) ||
            rent.trim() === "" ||
            !Number.isFinite(Number(rent)) ||
            Number(rent) <= 0 ||
            deposit.trim() === "" ||
            !Number.isFinite(Number(deposit)) ||
            Number(deposit) < 0 ||
            facilities.trim() === "" ||
            description.trim().length < 10
        ) {
            alert("Invalid details! Please try editing again with valid information.");
            return;
        }

        // UPDATE PROPERTY
        property.name = name.trim();
        property.city = city.trim();
        property.rent = Number(rent);
        property.deposit = Number(deposit);
        property.facilities = facilities.trim();
        property.description = description.trim();

        // SAVE UPDATED DATA
        localStorage.setItem("properties", JSON.stringify(properties));

        // REFRESH MY LISTINGS
        displayProperties();

        alert("Property updated successfully!");
    }
});
// ========================================
// PUBLISH / UNPUBLISH PROPERTY
// ========================================

propertyContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("toggle-publish")) {

        let propertyId = Number(event.target.dataset.id);

        let property = properties.find(function(item) {
            return item.id === propertyId;
        });

        if (!property) return;

        property.published = !property.published;

        localStorage.setItem(
            "properties",
            JSON.stringify(properties)
        );

        displayProperties();
        displayPublishedProperties();

        alert(
            property.published
                ? "Property published successfully!"
                : "Property unpublished successfully!"
        );
    }
});
// ========================================
// OPEN REACT PROPERTY ENQUIRY FORM
// ========================================

document.addEventListener("click", function(event) {

    const interestedButton = event.target.closest(".interested-btn");

    if (!interestedButton) return;

    const propertyId = interestedButton.getAttribute("data-id");

    // First check saved properties
    let property = properties.find(function(item) {
        return String(item.id) === String(propertyId);
    });

    // If not found, check the static sample properties
    if (!property) {

        const propertyCard = interestedButton.closest(
            "#publicPropertyContainer > div"
        );

        if (!propertyCard) return;

        property = {
            id: propertyId,
            name: interestedButton.getAttribute("data-name"),
            city: propertyCard.dataset.city,
            type: propertyCard.dataset.type,
            rent: propertyCard.dataset.rent
        };
    }

    console.log("Selected property:", property);

    // Open React enquiry form
    window.dispatchEvent(
        new CustomEvent("rently:open-enquiry", {
            detail: {
                id: property.id,
                name: property.name,
                city: property.city,
                rent: property.rent
            }
        })
    );

});
// CLEAR SEARCH FILTERS

document.getElementById("clearFiltersButton")?.addEventListener("click", function () {
    document.getElementById("searchLocation").value = "";
    document.getElementById("searchType").value = "";
    document.getElementById("searchBudget").value = "";

    document.getElementById("searchButton").click();
});
// ========================================
// INITIAL PAGE DISPLAY
// ========================================

displayProperties();
displayPublishedProperties();
