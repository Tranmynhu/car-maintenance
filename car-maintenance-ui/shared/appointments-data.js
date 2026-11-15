const appointments = [
    {
        title: "Oil Change",
        date: "Apr 30, 2026 · 10:00 AM",
        location: "Toyota Service Center"
    }
];

function renderAppointments(container) {
    container.replaceChildren();

    appointments.forEach(function (appointment) {
        const card = document.createElement("div");
        card.className = "appointment-card";

        const icon = document.createElement("div");
        icon.className = "appointment-icon";
        icon.textContent = "▦";

        const details = document.createElement("div");
        details.className = "appointment-details";

        const title = document.createElement("h3");
        title.textContent = appointment.title;

        const date = document.createElement("p");
        date.textContent = appointment.date;

        const location = document.createElement("p");
        location.textContent = appointment.location;

        details.append(title, date, location);
        card.append(icon, details);
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
