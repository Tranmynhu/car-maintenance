function getAllAppointments() {
    return api.get(APPOINTMENT_URL, { userId: localStorage.getItem("userId") });
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

function renderAppointments(container, onEdit, onDelete) {
    return attempt(getAllAppointments()).then(function ({ data, error }) {
        if (error) {
            container.textContent = "Could not load appointments.";
            return;
        }

        renderAppointmentCards(container, data, onEdit, onDelete);
    });
}

function renderAppointmentCards(container, appointments, onEdit, onDelete) {
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
