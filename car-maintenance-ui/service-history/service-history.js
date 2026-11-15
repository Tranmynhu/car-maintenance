const serviceHistory = [
    {
        title: "Tire Rotation",
        date: "Jan 15, 2026 · 9:00 AM",
        location: "Toyota Service Center"
    },
    {
        title: "Brake Inspection",
        date: "Oct 02, 2025 · 2:30 PM",
        location: "Main Street Auto"
    }
];

function renderServiceHistory(container) {
    container.replaceChildren();

    serviceHistory.forEach(function (service) {
        const card = document.createElement("div");
        card.className = "appointment-card";

        const icon = document.createElement("div");
        icon.className = "appointment-icon";
        icon.textContent = "▤";

        const details = document.createElement("div");
        details.className = "appointment-details";

        const title = document.createElement("h3");
        title.textContent = service.title;

        const date = document.createElement("p");
        date.textContent = service.date;

        const location = document.createElement("p");
        location.textContent = service.location;

        details.append(title, date, location);
        card.append(icon, details);
        container.appendChild(card);
    });
}

document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
        goToPage(item.dataset.page);
    });
});

document.getElementById("logoutButton").addEventListener("click", function () {
    window.location.href = "/login-signup/login-signup.html";
});

renderServiceHistory(document.getElementById("serviceHistoryList"));
