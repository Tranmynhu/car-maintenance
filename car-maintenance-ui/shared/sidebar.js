// Sidebar component shared by the dashboard, service history and appointments pages.
//
// Usage in a page:
//   <app-sidebar active="Dashboard"></app-sidebar>
//   <script src="/shared/sidebar.js"></script>
//
// "active" must match the name of one of the pages below.

const SIDEBAR_PAGES = [
    { name: "Dashboard", icon: "⌂", url: "/dashboard/dashboard.html" },
    { name: "Service History", icon: "▤", url: "/service-history/service-history.html" },
    { name: "Appointments", icon: "▦", url: "/appointments/appointments.html" }
];

const LOGIN_URL = "/login-signup/login-signup.html";

function goToPage(pageName) {
    const page = SIDEBAR_PAGES.find(function (candidate) {
        return candidate.name === pageName;
    });

    if (page) {
        window.location.href = page.url;
    }
}

class AppSidebar extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute("active");

        // No shadow DOM, so the existing dashboard.css rules apply as they are
        this.className = "sidebar";

        const logo = document.createElement("div");
        logo.className = "logo";

        const logoIcon = document.createElement("span");
        logoIcon.className = "logo-icon";
        logoIcon.textContent = "🚘";

        const logoTitle = document.createElement("h2");
        logoTitle.textContent = "Car Maintenance Tracker";

        logo.append(logoIcon, logoTitle);

        const navigation = document.createElement("nav");
        navigation.className = "navigation";

        SIDEBAR_PAGES.forEach(function (page) {
            const button = document.createElement("button");
            button.className = "nav-item" + (page.name === activePage ? " active" : "");

            const icon = document.createElement("span");
            icon.textContent = page.icon;

            button.append(icon, " " + page.name);
            button.addEventListener("click", function () {
                // Already on this page
                if (page.name !== activePage) {
                    goToPage(page.name);
                }
            });

            navigation.appendChild(button);
        });

        const logoutButton = document.createElement("button");
        logoutButton.className = "logout-button";
        logoutButton.textContent = "⇥ Log Out";
        logoutButton.addEventListener("click", function () {
            window.location.href = LOGIN_URL;
        });

        this.replaceChildren(logo, navigation, logoutButton);
    }
}

customElements.define("app-sidebar", AppSidebar);
