import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

let subscribers: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const notifySubscribers = () => {
    subscribers.forEach((callback) => callback([...toasts]));
};

export const dismissToast = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifySubscribers();
};

export const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type }];
    notifySubscribers();

    setTimeout(() => {
        dismissToast(id);
    }, 5000);
};

export const useToasts = () => {
    const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

    useEffect(() => {
        const callback = (updatedToasts: Toast[]) => {
            setCurrentToasts(updatedToasts);
        };
        subscribers.push(callback);
        return () => {
            subscribers = subscribers.filter((sub) => sub !== callback);
        };
    }, []);

    return currentToasts;
};
