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
    async function (event) {

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


        try {
            const result = await login(username, password);

            if (result.isLoginSuccess) {
                // set user id to local storage
                localStorage.setItem("userId", result.userId);

                // go to dashboard
                goToDashboard();
            } else {
                alert("Username or password is incorrect")
            }
        } catch (error) {
            alert("Server error, please turn on server")
        }

    }
);

function goToDashboard() {
    window.location.href = "/dashboard/dashboard.html";
}

async function login(username, password) {
    const url = getUserApiUrl('/login');

    // 1. Define the data payload you want to send
    const data = {
        username,
        password
    };

    // 2. Make the HTTP POST request
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Tells the server to expect JSON
        },
        body: JSON.stringify(data) // Converts your JS object into a JSON string
    });

    // 3. Parse and use the server's response
    const result = await response.json();

    return result;
}


/* =========================
   SIGN UP
========================= */

signupForm.addEventListener(
    "submit",
    async function (event) {

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

        const url = getUserApiUrl('/signUp');

        // 1. Define the data payload you want to send
        const data = {
            username,
            password
        };

        // 2. Make the HTTP POST request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tells the server to expect JSON
            },
            body: JSON.stringify(data) // Converts your JS object into a JSON string
        });

        // 3. Parse and use the server's response
        const result = await response.json();

        if (result.isSignUpSuccess) {
            alert("Sign up successful! Please log in.");
            showLogin();
        }
    }
);

function getUserApiUrl(path) {
    const baseUrl = 'http://localhost:8080/api/user';
    return baseUrl + path;
}