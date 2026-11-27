
/* Store the vehicle information */
let vehicles = [];

/* Get the HTML elements we need */
const vehicleList = document.getElementById("vehicleList");
const addVehicleButton = document.getElementById("addVehicleButton");
const vehicleDialog = document.getElementById("vehicleDialog");
const vehicleForm = document.getElementById("vehicleForm");
const cancelButton = document.getElementById("cancelButton");
const statusMessage = document.getElementById("statusMessage");
const editVehicleDialog = document.getElementById("editVehicleDialog");
const editVehicleForm = document.getElementById("editVehicleForm");
let editingVehicleId = null;
const deleteDialog = document.getElementById("deleteDialog");
let deletingVehicle = null;

/* Display all vehicles on the page */
function displayVehicles() {
    // Load the vehicles from the server
    return attempt(getAllVehicles()).then(function ({ data, error }) {
        if (error) {
            statusMessage.textContent = "Could not load vehicles.";
            return;
        }

        vehicles = data;
        renderVehicleCards();
    });
}

function renderVehicleCards() {
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
    let newVehicle = {
        name: vehicleName,
        year: vehicleYear,
        color: vehicleColor,
        vin: vehicleVin,
        userId: localStorage.getItem("userId"),
        icon: "🚗"
    };

    return attempt(addVehicle(newVehicle))
        .then(function ({ error }) {
            if (error) {
                statusMessage.textContent = "Could not add the vehicle.";
                return;
            }

            // Refresh the vehicle cards from the server
            return displayVehicles().then(function () {
                // Close the form and show a confirmation
                closeVehicleForm();
                statusMessage.textContent =
                    newVehicle.name + " was added successfully.";
            });
        });
}

function addVehicle(data) {
    return api.post(CAR_URL, data);
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
function updateVehicle(event) {
    event.preventDefault();

    const updatedVehicle = {
        id: editingVehicleId,
        name: document.getElementById("editVehicleName").value.trim(),
        year: Number(document.getElementById("editVehicleYear").value),
        color: document.getElementById("editVehicleColor").value.trim(),
        vin: document.getElementById("editVehicleVin").value.trim(),
        userId: localStorage.getItem("userId")
    };

    return attempt(api.put(CAR_URL, updatedVehicle))
        .then(function ({ error }) {
            if (error) {
                statusMessage.textContent = "Could not update the vehicle.";
                return;
            }

            return displayVehicles().then(function () {
                editVehicleDialog.close();
                statusMessage.textContent =
                    updatedVehicle.name + " was updated successfully.";
            });
        });
}

/* Ask for confirmation before deleting a vehicle */
function openDeleteDialog(vehicle) {
    deletingVehicle = vehicle;
    document.getElementById("deleteMessage").textContent =
        "Are you sure you want to delete " + vehicle.name + "?";
    deleteDialog.showModal();
}

/* Delete the confirmed vehicle */
function deleteVehicle() {
    return attempt(api.delete(CAR_URL, { id: deletingVehicle.id }))
        .then(function ({ error }) {
            if (error) {
                deleteDialog.close();
                statusMessage.textContent = "Could not delete the vehicle.";
                return;
            }

            return displayVehicles().then(function () {
                deleteDialog.close();
                statusMessage.textContent = deletingVehicle.name + " was deleted.";
            });
        });
}

function getAllVehicles() {
    return api.get(CAR_URL, { userId: localStorage.getItem("userId") })
        .then(function (cars) {
            // The server does not send an icon, so use a default one
            return cars.map(function (car) {
                return { ...car, icon: "🚗" };
            });
        });
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

/* View all appointments */
document.getElementById("viewAllButton").addEventListener("click", function () {
    goToPage("Appointments");
});

/* Profile button */
document.querySelector(".profile-button").addEventListener("click", function () {
    statusMessage.textContent = "Welcome, My Nhu! Profile settings are not implemented yet.";
});

/* Display the initial vehicle and appointment cards */
displayVehicles();
renderAppointments(document.getElementById("appointmentList"));
