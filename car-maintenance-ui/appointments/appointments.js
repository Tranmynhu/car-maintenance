const statusMessage = document.getElementById("statusMessage");
const appointmentDialog = document.getElementById("appointmentDialog");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentVehicle = document.getElementById("appointmentVehicle");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentList = document.getElementById("appointmentList");
const editAppointmentDialog = document.getElementById("editAppointmentDialog");
const editAppointmentForm = document.getElementById("editAppointmentForm");
const editAppointmentVehicle = document.getElementById("editAppointmentVehicle");
const deleteAppointmentDialog = document.getElementById("deleteAppointmentDialog");
let editingAppointmentId = null;
let deletingAppointment = null;

function showAppointments() {
    return renderAppointments(
        appointmentList,
        openEditAppointmentForm,
        openDeleteAppointmentDialog
    );
}

// Fills the select with the user's vehicles; resolves to false if it could not
function loadVehicles(select) {
    return attempt(
        api.get(CAR_URL, { userId: localStorage.getItem("userId") })
    ).then(function ({ data: cars, error }) {
        if (error) {
            statusMessage.textContent = "Could not load vehicles.";
            return false;
        }

        if (cars.length === 0) {
            statusMessage.textContent = "Please add a vehicle before scheduling an appointment.";
            return false;
        }

        select.replaceChildren();
        cars.forEach(function (car) {
            const option = document.createElement("option");
            option.value = car.id;
            option.textContent = car.name + " (" + car.year + ")";
            select.appendChild(option);
        });

        return true;
    });
}

function openAppointmentForm() {
    return loadVehicles(appointmentVehicle).then(function (loaded) {
        if (!loaded) {
            return;
        }

        appointmentForm.reset();
        appointmentDialog.showModal();
    });
}

function saveAppointment(event) {
    event.preventDefault();

    const newAppointment = {
        carId: Number(appointmentVehicle.value),
        date: appointmentDate.value,
        description: document.getElementById("appointmentDescription").value.trim()
    };

    return attempt(api.post(APPOINTMENT_URL, newAppointment))
        .then(function ({ error }) {
            if (error) {
                statusMessage.textContent = "Could not save the appointment.";
                return;
            }

            return showAppointments().then(function () {
                appointmentDialog.close();
                statusMessage.textContent = "Appointment was scheduled successfully.";
            });
        });
}

function openEditAppointmentForm(appointment) {
    return loadVehicles(editAppointmentVehicle).then(function (loaded) {
        if (!loaded) {
            return;
        }

        editingAppointmentId = appointment.id;
        editAppointmentVehicle.value = appointment.carId;
        document.getElementById("editAppointmentDate").value = appointment.date;
        document.getElementById("editAppointmentDescription").value = appointment.description || "";
        editAppointmentDialog.showModal();
    });
}

function updateAppointment(event) {
    event.preventDefault();

    const updatedAppointment = {
        id: editingAppointmentId,
        carId: Number(editAppointmentVehicle.value),
        date: document.getElementById("editAppointmentDate").value,
        description: document.getElementById("editAppointmentDescription").value.trim()
    };

    return attempt(api.put(APPOINTMENT_URL, updatedAppointment))
        .then(function ({ error }) {
            if (error) {
                statusMessage.textContent = "Could not update the appointment.";
                return;
            }

            return showAppointments().then(function () {
                editAppointmentDialog.close();
                statusMessage.textContent = "Appointment was updated successfully.";
            });
        });
}

function openDeleteAppointmentDialog(appointment) {
    deletingAppointment = appointment;
    document.getElementById("deleteAppointmentMessage").textContent =
        "Are you sure you want to delete the appointment for " + appointment.carName + "?";
    deleteAppointmentDialog.showModal();
}

function deleteAppointment() {
    return attempt(api.delete(APPOINTMENT_URL, { id: deletingAppointment.id }))
        .then(function ({ error }) {
            deleteAppointmentDialog.close();

            if (error) {
                statusMessage.textContent = "Could not delete the appointment.";
                return;
            }

            return showAppointments().then(function () {
                statusMessage.textContent = "Appointment was deleted.";
            });
        });
}

document.getElementById("deleteAppointmentConfirmButton").addEventListener("click", deleteAppointment);

document.getElementById("deleteAppointmentCancelButton").addEventListener("click", function () {
    deleteAppointmentDialog.close();
});

document.getElementById("scheduleButton").addEventListener("click", openAppointmentForm);

document.getElementById("appointmentCancelButton").addEventListener("click", function () {
    appointmentDialog.close();
});

document.getElementById("editAppointmentCancelButton").addEventListener("click", function () {
    editAppointmentDialog.close();
});

appointmentForm.addEventListener("submit", saveAppointment);

editAppointmentForm.addEventListener("submit", updateAppointment);

showAppointments();
