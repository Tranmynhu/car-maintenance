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
    function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value;


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        if (email === "" || password === "") {

            alert(
                "Please enter your email and password."
            );

            return;
        }


        /*
         * Temporary login behavior.
         *
         * Later you can connect this
         * to your database.
         */

        alert("Login successful!");

        console.log("Email:", email);
    }
);


/* =========================
   SIGN UP
========================= */

signupForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "signupName"
            ).value;


        const email =
            document.getElementById(
                "signupEmail"
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


        /* Check password length */

        if (password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;
        }


        alert(
            "Account created successfully!"
        );


        console.log("Name:", name);

        console.log("Email:", email);
    }
);