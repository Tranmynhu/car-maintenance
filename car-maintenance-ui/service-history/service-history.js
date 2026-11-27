const SERVICE_HISTORY_URL = "http://localhost:8080/api/service-history";
const CAR_URL = "http://localhost:8080/api/car";

async function getAllVehicles() {
    const userId = localStorage.getItem("userId");
    const response = await fetch(CAR_URL + "?userId=" + encodeURIComponent(userId));

    if (!response.ok) {
        throw new Error("Failed to load vehicles: " + response.status);
    }

    return await response.json();
}

async function getServiceHistory(carId) {
    const response = await fetch(SERVICE_HISTORY_URL + "?carId=" + encodeURIComponent(carId));

    if (!response.ok) {
        throw new Error("Failed to load service history: " + response.status);
    }

    return await response.json();
}

function showMessage(container, text) {
    const message = document.createElement("p");
    message.textContent = text;
    container.replaceChildren(message);
}

async function renderServiceHistory(container) {
    let services;

    try {
        const cars = await getAllVehicles();
        const histories = await Promise.all(cars.map(function (car) {
            return getServiceHistory(car.id).then(function (history) {
                return history.map(function (service) {
                    return { ...service, carName: car.name };
                });
            });
        }));
        services = histories.flat();
    } catch (error) {
        showMessage(container, "Could not load service history.");
        return;
    }

    if (services.length === 0) {
        showMessage(container, "No service history yet.");
        return;
    }

    // Most recent first (ISO dates sort correctly as strings)
    services.sort(function (a, b) {
        return b.date.localeCompare(a.date);
    });

    container.replaceChildren();

    services.forEach(function (service) {
        const card = document.createElement("div");
        card.className = "appointment-card";

        const icon = document.createElement("div");
        icon.className = "appointment-icon";
        icon.textContent = "▤";

        const details = document.createElement("div");
        details.className = "appointment-details";

        const title = document.createElement("h3");
        title.textContent = service.title + " - " + service.carName;

        const date = document.createElement("p");
        date.textContent = formatAppointmentDate(service.date);

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
