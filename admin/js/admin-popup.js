
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupIcon = document.getElementById("popupIcon");
const popupClose = document.getElementById("popupClose");
const popupOk = document.getElementById("popupOk");

let confirmResolve = null;

// ==========================================
// SHOW NORMAL POPUP
// ==========================================

function showPopup(title, message, type = "success") {
    if (
        !popup ||
        !popupTitle ||
        !popupMessage ||
        !popupIcon ||
        !popupOk
    ) {
        return;
    }

    // If a confirmation is already open, cancel it first.
    if (confirmResolve) {
        finishConfirmation(false);
    }

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    if (type === "error") {
        popupIcon.textContent = "✕";
        popupIcon.className =
            "mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold";
    } else if (type === "warning") {
        popupIcon.textContent = "!";
        popupIcon.className =
            "mx-auto mb-4 w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl font-bold";
    } else {
        popupIcon.textContent = "✓";
        popupIcon.className =
            "mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold";
    }

    popupOk.textContent = "OK";
    popup.classList.remove("hidden");
    popup.classList.add("flex");
}

// ==========================================
// CLOSE NORMAL POPUP
// ==========================================

function closePopup() {
    if (!popup) return;

    if (confirmResolve) {
        finishConfirmation(false);
        return;
    }

    hidePopup();
}

function hidePopup() {
    if (!popup) return;

    popup.classList.add("hidden");
    popup.classList.remove("flex");

    if (popupOk) {
        popupOk.textContent = "OK";
    }
}

// ==========================================
// CONFIRM POPUP
// ==========================================

function showConfirmPopup(title, message) {
    if (
        !popup ||
        !popupTitle ||
        !popupMessage ||
        !popupIcon ||
        !popupOk
    ) {
        return Promise.resolve(false);
    }

    // Prevent overlapping confirmation dialogs.
    if (confirmResolve) {
        finishConfirmation(false);
    }

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    popupIcon.textContent = "?";
    popupIcon.className =
        "mx-auto mb-4 w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl font-bold";

    popupOk.textContent = "Yes";

    popup.classList.remove("hidden");
    popup.classList.add("flex");

    return new Promise(resolve => {
        confirmResolve = resolve;
    });
}

// ==========================================
// FINISH CONFIRMATION
// ==========================================

function finishConfirmation(result) {
    if (!confirmResolve) return;

    const resolve = confirmResolve;
    confirmResolve = null;

    hidePopup();
    resolve(result);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

if (popupClose) {
    popupClose.addEventListener("click", closePopup);
}

if (popupOk) {
    popupOk.addEventListener("click", () => {
        if (confirmResolve) {
            finishConfirmation(true);
        } else {
            closePopup();
        }
    });
}

if (popup) {
    popup.addEventListener("click", event => {
        if (event.target === popup) {
            closePopup();
        }
    });
}

// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.showPopup = showPopup;
window.closePopup = closePopup;
window.showConfirmPopup = showConfirmPopup;
