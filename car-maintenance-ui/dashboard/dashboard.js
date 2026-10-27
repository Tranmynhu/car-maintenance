
/* Store the vehicle information */
let vehicles = [
    {
        name: "Toyota Camry",
        year: 2018,
        color: "White",
        vin: "4T1B11HK5JU123456",
        icon: "🚘"
    },
    {
        name: "Honda Civic",
        year: 2020,
        color: "Blue",
        vin: "2HGFC2F69LH123456",
        icon: "🚙"
    }
];

/* Get the HTML elements we need */
const vehicleList = document.getElementById("vehicleList");
const addVehicleButton = document.getElementById("addVehicleButton");
const vehicleDialog = document.getElementById("vehicleDialog");
const vehicleForm = document.getElementById("vehicleForm");
const cancelButton = document.getElementById("cancelButton");
const statusMessage = document.getElementById("statusMessage");
const navigationItems = document.querySelectorAll(".nav-item");

/* Display all vehicles on the page */
function displayVehicles() {
    // Remove the old vehicle cards
    vehicleList.replaceChildren();

    // Create a card for each vehicle
    vehicles.forEach(function (vehicle) {
        const vehicleCard = document.createElement("div");
        vehicleCard.className = "vehicle-card";

        const vehicleImage = document.createElement("div");
        vehicleImage.className = "vehicle-image";
        vehicleImage.textContent = vehicle.icon;

        const vehicleDetails = document.createElement("div");
        vehicleDetails.className = "vehicle-details";

        const vehicleName = document.createElement("h3");
        vehicleName.textContent = vehicle.name;

        const vehicleYearAndColor = document.createElement("p");
        vehicleYearAndColor.textContent =
            vehicle.year + " · " + vehicle.color;

        const vehicleVin = document.createElement("p");
        vehicleVin.textContent = "VIN: " + vehicle.vin;

        const vehicleArrow = document.createElement("span");
        vehicleArrow.className = "arrow";
        vehicleArrow.textContent = "›";

        // Put the vehicle information inside its card
        vehicleDetails.append(
            vehicleName,
            vehicleYearAndColor,
            vehicleVin
        );

        vehicleCard.append(
            vehicleImage,
            vehicleDetails,
            vehicleArrow
        );

        // Show vehicle information when its card is clicked
        vehicleCard.addEventListener("click", function () {
            statusMessage.textContent =
                vehicle.name + " (" + vehicle.year + ") selected.";
        });

        // Add the completed card to the page
        vehicleList.appendChild(vehicleCard);
    });
}

/* Open the Add Vehicle form */
function openVehicleForm() {
    vehicleForm.reset();
    vehicleDialog.showModal();
}

/* Close the Add Vehicle form */
function closeVehicleForm() {
    vehicleDialog.close();
}

/* Save a new vehicle */
function saveVehicle(event) {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    // Get the values entered by the user
    const vehicleName = document.getElementById("vehicleName").value.trim();
    const vehicleYear = Number(
        document.getElementById("vehicleYear").value
    );
    const vehicleColor = document.getElementById("vehicleColor").value.trim();
    const vehicleVin = document.getElementById("vehicleVin").value.trim();

    // Check that the year is valid
    if (
        !vehicleName ||
        !vehicleColor ||
        !vehicleVin ||
        !Number.isInteger(vehicleYear) ||
        vehicleYear < 1886 ||
        vehicleYear > 2100
    ) {
        statusMessage.textContent = "Please enter valid vehicle information.";
        return;
    }

    // Create a new vehicle object
    const newVehicle = {
        name: vehicleName,
        year: vehicleYear,
        color: vehicleColor,
        vin: vehicleVin,
        icon: "🚗"
    };

    // Save the vehicle in the array
    vehicles.push(newVehicle);

    // Refresh the vehicle cards
    displayVehicles();

    // Close the form and show a confirmation
    closeVehicleForm();
    statusMessage.textContent =
        newVehicle.name + " was added successfully.";
}

/* Handle sidebar navigation */
function handleNavigation(event) {
    const selectedItem = event.currentTarget;
    const selectedPage = selectedItem.dataset.page;

    // Remove the active style from every navigation button
    navigationItems.forEach(function (item) {
        item.classList.remove("active");
    });

    // Highlight the selected navigation button
    selectedItem.classList.add("active");

    // Perform the action for the selected page
    if (selectedPage === "Dashboard") {
        statusMessage.textContent = "Welcome to your dashboard.";
    } else if (selectedPage === "Add Vehicle") {
        openVehicleForm();
    } else {
        statusMessage.textContent =
            selectedPage + " page is not implemented yet.";
    }
}

/* Button event listeners */
addVehicleButton.addEventListener("click", openVehicleForm);

cancelButton.addEventListener("click", closeVehicleForm);

vehicleForm.addEventListener("submit", saveVehicle);

navigationItems.forEach(function (item) {
    item.addEventListener("click", handleNavigation);
});

/* View all appointments */
document.getElementById("viewAllButton").addEventListener("click", function () {
    statusMessage.textContent =
        "You have one upcoming appointment: Oil Change.";
});

/* Log out button */
document.getElementById("logoutButton").addEventListener("click", function () {
    statusMessage.textContent =
        "You have been logged out of the demo dashboard.";
    window.location.href = "/login-signup/login-signup.html";
});

/* Profile button */
document.querySelector(".profile-button").addEventListener("click", function () {
    statusMessage.textContent = "Welcome, My Nhu! Profile settings are not implemented yet.";
});

/* Display the initial vehicle cards */
displayVehicles();
