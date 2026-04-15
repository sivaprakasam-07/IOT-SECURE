import toast from "react-hot-toast";

const baseStyle = {
    background: "#111827",
    color: "#f9fafb",
    border: "1px solid #374151"
};

const toastConfig = {
    success: {
        icon: "✅",
        style: {
            ...baseStyle,
            borderColor: "#16a34a"
        }
    },
    error: {
        icon: "❌",
        style: {
            ...baseStyle,
            borderColor: "#dc2626"
        }
    },
    warning: {
        icon: "⚠️",
        style: {
            ...baseStyle,
            borderColor: "#f59e0b"
        }
    },
    info: {
        icon: "ℹ️",
        style: {
            ...baseStyle,
            borderColor: "#0ea5e9"
        }
    }
};

export const showToast = (type, message, options = {}) => {
    const config = toastConfig[type] ?? toastConfig.info;
    const toastMethod =
        type === "success" || type === "error" ? toast[type] : toast;

    return toastMethod(message, {
        icon: config.icon,
        style: config.style,
        ...options
    });
};
