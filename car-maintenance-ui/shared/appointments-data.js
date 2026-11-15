const APPOINTMENT_URL = "http://localhost:8080/api/appointment";

async function getAllAppointments() {
    const userId = localStorage.getItem("userId");
    const response = await fetch(APPOINTMENT_URL + "?userId=" + encodeURIComponent(userId));

    if (!response.ok) {
        throw new Error("Failed to load appointments: " + response.status);
    }

    return await response.json();
}

function formatAppointmentDate(isoDate) {
    const parts = isoDate.split("-");
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

async function renderAppointments(container, onEdit, onDelete) {
    let appointments;

    try {
        appointments = await getAllAppointments();
    } catch (error) {
        container.textContent = "Could not load appointments.";
        return;
    }

    container.replaceChildren();

    if (appointments.length === 0) {
        container.textContent = "No upcoming appointments.";
        return;
    }

    appointments.forEach(function (appointment) {
        const card = document.createElement("div");
        card.className = "appointment-card";

        const icon = document.createElement("div");
        icon.className = "appointment-icon";
        icon.textContent = "▦";

        const details = document.createElement("div");
        details.className = "appointment-details";

        const title = document.createElement("h3");
        title.textContent = appointment.carName;

        const date = document.createElement("p");
        date.textContent = formatAppointmentDate(appointment.date);

        const description = document.createElement("p");
        description.textContent = appointment.description || "";

        details.append(title, date, description);
        card.append(icon, details);

        if (onEdit) {
            const editButton = document.createElement("button");
            editButton.className = "card-edit-button";
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {
                onEdit(appointment);
            });
            card.appendChild(editButton);
        }

        if (onDelete) {
            const deleteButton = document.createElement("button");
            deleteButton.className = "card-delete-button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                onDelete(appointment);
            });
            card.appendChild(deleteButton);
        }

        container.appendChild(card);
    });
}

function goToPage(pageName) {
    if (pageName === "Dashboard") {
        window.location.href = "/dashboard/dashboard.html";
    } else if (pageName === "Service History") {
        window.location.href = "/service-history/service-history.html";
    } else if (pageName === "Appointments") {
        window.location.href = "/appointments/appointments.html";
    }
}
