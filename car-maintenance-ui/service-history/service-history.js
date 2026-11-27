function getAllVehicles() {
    return api.get(CAR_URL, { userId: localStorage.getItem("userId") });
}

function getServiceHistory(carId) {
    return api.get(SERVICE_HISTORY_URL, { carId });
}

// Service history of every vehicle, each entry tagged with its vehicle's name
function getAllServices() {
    return getAllVehicles()
        .then(cars => Promise.all(cars.map(withServices)))
        .then(histories => histories.flat());
}

function withServices(car) {
    return getServiceHistory(car.id)
        .then(history => history.map(service => ({ ...service, carName: car.name })));
}

function showMessage(container, text) {
    const message = document.createElement("p");
    message.textContent = text;
    container.replaceChildren(message);
}

function renderServiceHistory(container) {
    return attempt(getAllServices()).then(function ({ data, error }) {
        if (error) {
            showMessage(container, "Could not load service history.");
            return;
        }

        renderServiceCards(container, data);
    });
}

function renderServiceCards(container, services) {
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

renderServiceHistory(document.getElementById("serviceHistoryList"));
