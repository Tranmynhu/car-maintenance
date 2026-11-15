document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
        goToPage(item.dataset.page);
    });
});

document.getElementById("logoutButton").addEventListener("click", function () {
    window.location.href = "/login-signup/login-signup.html";
});

renderAppointments(document.getElementById("appointmentList"));
