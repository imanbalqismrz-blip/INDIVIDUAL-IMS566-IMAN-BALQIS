const HARDCODED_USERS = [
    {
        name: "Admin",
        email: "admin@pawpulse.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Staff",
        email: "staff@pawpulse.com",
        password: "staff123",
        role: "staff"
    }
];

function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (!messageElement) return;
    messageElement.textContent = message;
    messageElement.className = `form-message mb-3 small text-${type} text-center fw-bold`;
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            showMessage("loginMessage", "Please enter both email and password.", "danger");
            return;
        }

        const matchedUser = HARDCODED_USERS.find(
            user => user.email.toLowerCase() === email && user.password === password
        );

        if (matchedUser) {
            const currentUser = {
                name: matchedUser.name,
                email: matchedUser.email,
                role: matchedUser.role
            };
            sessionStorage.setItem("pawpulseCurrentUser", JSON.stringify(currentUser));
            showMessage("loginMessage", "Login successful! Redirecting to dashboard...", "success");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 600);
        } else {
            showMessage("loginMessage", "Invalid email or password. Please check the demo credentials below.", "danger");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const welcomeSpan = document.getElementById("welcomeUser");
    const userJson = sessionStorage.getItem("pawpulseCurrentUser");

    if (welcomeSpan && userJson) {
        const user = JSON.parse(userJson);
        welcomeSpan.textContent = `Welcome, ${user.name}!`;
    }
});

function logoutUser() {
    sessionStorage.removeItem("pawpulseCurrentUser");
    window.location.href = "index.html";
}