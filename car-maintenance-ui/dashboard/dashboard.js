
/* Store the vehicle information */
let vehicles = [];

/* Get the HTML elements we need */
const vehicleList = document.getElementById("vehicleList");
const addVehicleButton = document.getElementById("addVehicleButton");
const vehicleDialog = document.getElementById("vehicleDialog");
const vehicleForm = document.getElementById("vehicleForm");
const cancelButton = document.getElementById("cancelButton");
const statusMessage = document.getElementById("statusMessage");
const navigationItems = document.querySelectorAll(".nav-item");
const editVehicleDialog = document.getElementById("editVehicleDialog");
const editVehicleForm = document.getElementById("editVehicleForm");
let editingVehicleId = null;
const deleteDialog = document.getElementById("deleteDialog");
let deletingVehicle = null;

/* Display all vehicles on the page */
async function displayVehicles() {
    // Load the vehicles from the server
    try {
        vehicles = await getAllVehicles();
    } catch (error) {
        statusMessage.textContent = "Could not load vehicles.";
        return;
    }

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

        const deleteVehicleButton = document.createElement("button");
        deleteVehicleButton.className = "card-delete-button";
        deleteVehicleButton.textContent = "Delete";
        deleteVehicleButton.addEventListener("click", function (event) {
            // Don't open the edit form
            event.stopPropagation();
            openDeleteDialog(vehicle);
        });

        vehicleCard.append(
            vehicleImage,
            vehicleDetails,
            deleteVehicleButton,
            vehicleArrow
        );

        // Open the edit form when its card is clicked
        vehicleCard.addEventListener("click", function () {
            openEditForm(vehicle);
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
async function saveVehicle(event) {
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
    let newVehicle = {
        name: vehicleName,
        year: vehicleYear,
        color: vehicleColor,
        vin: vehicleVin,
        userId: localStorage.getItem("userId"),
        icon: "🚗"
    };

    await addVehicle(newVehicle);

    // Refresh the vehicle cards from the server
    await displayVehicles();

    // Close the form and show a confirmation
    closeVehicleForm();
    statusMessage.textContent =
        newVehicle.name + " was added successfully.";
}

async function addVehicle(data) {
    const url = 'http://localhost:8080/api/car';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Tells the server to expect JSON
        },
        body: JSON.stringify(data) // Converts your JS object into a JSON string
    });

    const result = await response.json();

    return result;
}

/* Open the Edit Vehicle form filled with the vehicle's current values */
function openEditForm(vehicle) {
    editingVehicleId = vehicle.id;
    document.getElementById("editVehicleName").value = vehicle.name;
    document.getElementById("editVehicleYear").value = vehicle.year;
    document.getElementById("editVehicleColor").value = vehicle.color;
    document.getElementById("editVehicleVin").value = vehicle.vin;
    editVehicleDialog.showModal();
}

/* Save the edited vehicle */
async function updateVehicle(event) {
    event.preventDefault();

    const updatedVehicle = {
        id: editingVehicleId,
        name: document.getElementById("editVehicleName").value.trim(),
        year: Number(document.getElementById("editVehicleYear").value),
        color: document.getElementById("editVehicleColor").value.trim(),
        vin: document.getElementById("editVehicleVin").value.trim(),
        userId: localStorage.getItem("userId")
    };

    await fetch('http://localhost:8080/api/car', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVehicle)
    });

    await displayVehicles();

    editVehicleDialog.close();
    statusMessage.textContent =
        updatedVehicle.name + " was updated successfully.";
}

/* Ask for confirmation before deleting a vehicle */
function openDeleteDialog(vehicle) {
    deletingVehicle = vehicle;
    document.getElementById("deleteMessage").textContent =
        "Are you sure you want to delete " + vehicle.name + "?";
    deleteDialog.showModal();
}

/* Delete the confirmed vehicle */
async function deleteVehicle() {
    await fetch('http://localhost:8080/api/car?id=' + deletingVehicle.id, {
        method: 'DELETE'
    });

    await displayVehicles();

    deleteDialog.close();
    statusMessage.textContent = deletingVehicle.name + " was deleted.";
}

async function getAllVehicles() {
    const userId = localStorage.getItem("userId");
    const url = 'http://localhost:8080/api/car?userId=' + encodeURIComponent(userId);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to load vehicles: " + response.status);
    }

    const cars = await response.json();

    // The server does not send an icon, so use a default one
    return cars.map(function (car) {
        return { ...car, icon: "🚗" };
    });
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

editVehicleForm.addEventListener("submit", updateVehicle);

document.getElementById("deleteConfirmButton").addEventListener("click", deleteVehicle);

document.getElementById("deleteCancelButton").addEventListener("click", function () {
    deleteDialog.close();
});

document.getElementById("editCancelButton").addEventListener("click", function () {
    editVehicleDialog.close();
});

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
