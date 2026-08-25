const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupIcon = document.getElementById("popupIcon");
const popupClose = document.getElementById("popupClose");
const popupOk = document.getElementById("popupOk");

function showPopup(message, type = "success", title = "") {

    if (!popup) return;

    popupMessage.textContent = message;

    if (type === "success") {

        popupIcon.textContent = "✓";
        popupIcon.className = "popup-icon success";

        popupTitle.textContent = title || "Success";

    } 
    else if (type === "error") {

        popupIcon.textContent = "!";
        popupIcon.className = "popup-icon error";

        popupTitle.textContent = title || "Error";

    } 
    else if (type === "warning") {

        popupIcon.textContent = "!";
        popupIcon.className = "popup-icon warning";

        popupTitle.textContent = title || "Warning";
    }

    popup.classList.add("show");
}


function closePopup() {

    if (!popup) return;

    popup.classList.remove("show");
}


if (popupClose) {

    popupClose.addEventListener(
        "click",
        closePopup
    );
}


if (popupOk) {

    popupOk.addEventListener(
        "click",
        closePopup
    );
}


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