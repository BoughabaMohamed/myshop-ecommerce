
function showToast(message, type = "success") {
    const colors = {
        success: {
            icon: "✓",
            border: "#16a34a"
        },
        error: {
            icon: "✕",
            border: "#dc2626"
        },
        warning: {
            icon: "!",
            border: "#d97706"
        },
        info: {
            icon: "i",
            border: "#2563eb"
        }
    };

    const style = colors[type] || colors.info;

    // Create notification container if needed
    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";

        Object.assign(container.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "99999",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "min(380px, calc(100vw - 40px))",
            pointerEvents: "none"
        });

        document.body.appendChild(container);
    }

    // Create notification
    const toast = document.createElement("div");

    Object.assign(toast.style, {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#ffffff",
        color: "#1f2937",
        padding: "16px",
        borderRadius: "14px",
        borderLeft: `5px solid ${style.border}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
        opacity: "0",
        transform: "translateX(20px)",
        transition: "opacity 250ms ease, transform 250ms ease",
        pointerEvents: "auto"
    });

    const icon = document.createElement("span");
    icon.textContent = style.icon;

    Object.assign(icon.style, {
        color: style.border,
        fontSize: "20px",
        fontWeight: "bold",
        flexShrink: "0"
    });

    const text = document.createElement("span");
    text.textContent = String(message);

    Object.assign(text.style, {
        flex: "1",
        overflowWrap: "anywhere"
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close notification");

    Object.assign(closeButton.style, {
        border: "none",
        background: "transparent",
        color: "#6b7280",
        fontSize: "23px",
        cursor: "pointer",
        padding: "0 2px",
        lineHeight: "1"
    });

    toast.append(icon, text, closeButton);
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    });

    let timeout;

    function removeToast() {
        clearTimeout(timeout);
        toast.style.opacity = "0";
        toast.style.transform = "translateX(20px)";

        setTimeout(() => toast.remove(), 250);
    }

    closeButton.addEventListener("click", removeToast);

    timeout = setTimeout(removeToast, 3500);
}
