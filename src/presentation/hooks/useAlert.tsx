import { createSignal } from 'solid-js';

interface AlertState {
    isOpen: boolean;
    type: 'error' | 'success' | 'info' | 'warning';
    title?: string;
    message: string;
    confirmText?: string;
}

const [alertState, setAlertState] = createSignal<AlertState>({
    isOpen: false,
    type: 'info',
    message: ''
});

export const useAlert = () => {
    const showAlert = (
        message: string,
        type: 'error' | 'success' | 'info' | 'warning' = 'info',
        title?: string,
        confirmText?: string
    ) => {
        setAlertState({
            isOpen: true,
            type,
            title,
            message,
            confirmText
        });
    };

    const showError = (message: string, title?: string) => {
        showAlert(message, 'error', title);
    };

    const showSuccess = (message: string, title?: string) => {
        showAlert(message, 'success', title);
    };

    const showInfo = (message: string, title?: string) => {
        showAlert(message, 'info', title);
    };

    const showWarning = (message: string, title?: string) => {
        showAlert(message, 'warning', title);
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    return {
        alertState,
        showAlert,
        showError,
        showSuccess,
        showInfo,
        showWarning,
        closeAlert
    };
};
