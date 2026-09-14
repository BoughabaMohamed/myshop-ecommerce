const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupIcon = document.getElementById("popupIcon");
const popupClose = document.getElementById("popupClose");
const popupOk = document.getElementById("popupOk");


// =====================================================
// SHOW POPUP
// =====================================================

function showPopup(message, type = "success", title = "") {

    if (!popup) return;


    popupMessage.textContent = message;


    // SUCCESS
    if (type === "success") {

        popupIcon.textContent = "✓";

        popupIcon.className =
            "mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold";

        popupTitle.textContent =
            title || "Success";
    }


    // ERROR
    else if (type === "error") {

        popupIcon.textContent = "✕";

        popupIcon.className =
            "mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold";

        popupTitle.textContent =
            title || "Error";
    }


    // WARNING
    else if (type === "warning") {

        popupIcon.textContent = "?";

        popupIcon.className =
            "mx-auto mb-4 w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl font-bold";

        popupTitle.textContent =
            title || "Warning";
    }


    popupOk.textContent = "OK";

    popup.classList.remove("hidden");
    popup.classList.add("flex");
}


// =====================================================
// CLOSE POPUP
// =====================================================

function closePopup() {

    if (!popup) return;

    popup.classList.add("hidden");
    popup.classList.remove("flex");

    popupOk.textContent = "OK";
}


// =====================================================
// CLOSE BUTTON
// =====================================================

if (popupClose) {

    popupClose.addEventListener(
        "click",
        closePopup
    );
}


// =====================================================
// OK BUTTON
// =====================================================

if (popupOk) {

    popupOk.addEventListener(
        "click",
        closePopup
    );
}


// =====================================================
// CLICK OUTSIDE
// =====================================================

if (popup) {

    popup.addEventListener(
        "click",
        function (event) {

            if (event.target === popup) {
                closePopup();
            }

        }
    );
}