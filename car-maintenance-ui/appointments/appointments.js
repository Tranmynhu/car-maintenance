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

async function loadVehicles(select) {
    const userId = localStorage.getItem("userId");

    let cars;
    try {
        const response = await fetch(
            "http://localhost:8080/api/car?userId=" + encodeURIComponent(userId)
        );
        cars = await response.json();
    } catch (error) {
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
}

async function openAppointmentForm() {
    if (!(await loadVehicles(appointmentVehicle))) {
        return;
    }

    appointmentForm.reset();
    appointmentDialog.showModal();
}

async function saveAppointment(event) {
    event.preventDefault();

    const newAppointment = {
        carId: Number(appointmentVehicle.value),
        date: appointmentDate.value,
        description: document.getElementById("appointmentDescription").value.trim()
    };

    const response = await fetch(APPOINTMENT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newAppointment)
    });

    if (!response.ok) {
        statusMessage.textContent = "Could not save the appointment.";
        return;
    }

    await showAppointments();

    appointmentDialog.close();
    statusMessage.textContent = "Appointment was scheduled successfully.";
}

async function openEditAppointmentForm(appointment) {
    if (!(await loadVehicles(editAppointmentVehicle))) {
        return;
    }

    editingAppointmentId = appointment.id;
    editAppointmentVehicle.value = appointment.carId;
    document.getElementById("editAppointmentDate").value = appointment.date;
    document.getElementById("editAppointmentDescription").value = appointment.description || "";
    editAppointmentDialog.showModal();
}

async function updateAppointment(event) {
    event.preventDefault();

    const updatedAppointment = {
        id: editingAppointmentId,
        carId: Number(editAppointmentVehicle.value),
        date: document.getElementById("editAppointmentDate").value,
        description: document.getElementById("editAppointmentDescription").value.trim()
    };

    const response = await fetch(APPOINTMENT_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedAppointment)
    });

    if (!response.ok) {
        statusMessage.textContent = "Could not update the appointment.";
        return;
    }

    await showAppointments();

    editAppointmentDialog.close();
    statusMessage.textContent = "Appointment was updated successfully.";
}

function openDeleteAppointmentDialog(appointment) {
    deletingAppointment = appointment;
    document.getElementById("deleteAppointmentMessage").textContent =
        "Are you sure you want to delete the appointment for " + appointment.carName + "?";
    deleteAppointmentDialog.showModal();
}

async function deleteAppointment() {
    const response = await fetch(APPOINTMENT_URL + "?id=" + deletingAppointment.id, {
        method: "DELETE"
    });

    deleteAppointmentDialog.close();

    if (!response.ok) {
        statusMessage.textContent = "Could not delete the appointment.";
        return;
    }

    await showAppointments();
    statusMessage.textContent = "Appointment was deleted.";
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

document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
        goToPage(item.dataset.page);
    });
});

document.getElementById("logoutButton").addEventListener("click", function () {
    window.location.href = "/login-signup/login-signup.html";
});

showAppointments();
