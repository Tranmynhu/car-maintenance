/* =========================
   GET ELEMENTS
========================= */

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");


/* =========================
   SHOW LOGIN
========================= */

function showLogin() {

    loginForm.classList.remove("hidden");

    signupForm.classList.add("hidden");

    loginTab.classList.add("active");

    signupTab.classList.remove("active");
}


/* =========================
   SHOW SIGN UP
========================= */

function showSignup() {

    signupForm.classList.remove("hidden");

    loginForm.classList.add("hidden");

    signupTab.classList.add("active");

    loginTab.classList.remove("active");
}


/* =========================
   TAB BUTTONS
========================= */

loginTab.addEventListener(
    "click",
    showLogin
);

signupTab.addEventListener(
    "click",
    showSignup
);


/* =========================
   SHOW / HIDE PASSWORD
========================= */

function togglePassword(inputId, button) {

    const passwordInput =
        document.getElementById(inputId);


    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        button.textContent = "🙈";

    } else {

        passwordInput.type = "password";

        button.textContent = "👁";
    }
}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            document.getElementById(
                "loginUsername"
            ).value;


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        if (username === "" || password === "") {

            alert(
                "Please enter your username and password."
            );

            return;
        }


        return attempt(login(username, password)).then(function ({ data: result, error }) {
            if (error) {
                alert("Server error, please turn on server");
                return;
            }

            if (result.isLoginSuccess) {
                // set user id to local storage
                localStorage.setItem("userId", result.userId);

                // go to dashboard
                goToDashboard();
            } else {
                alert("Username or password is incorrect")
            }
        });

    }
);

function goToDashboard() {
    window.location.href = "/dashboard/dashboard.html";
}

function login(username, password) {
    return api.post(getUserApiUrl('/login'), { username, password });
}


/* =========================
   SIGN UP
========================= */

signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            document.getElementById(
                "signupName"
            ).value;


        const password =
            document.getElementById(
                "signupPassword"
            ).value;


        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        /* Check passwords */

        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;
        }

        return attempt(
            api.post(getUserApiUrl('/signUp'), { username, password })
        ).then(function ({ data: result, error }) {
            if (error) {
                alert("Server error, please turn on server");
                return;
            }

            if (result.isSignUpSuccess) {
                alert("Sign up successful! Please log in.");
                showLogin();
            }
        });
    }
);

function getUserApiUrl(path) {
    return USER_URL + path;
}