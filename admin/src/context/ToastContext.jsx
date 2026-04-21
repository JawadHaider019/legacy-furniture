import React, { createContext, useContext, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const showToast = useCallback((message, type = 'success') => {
        const config = {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#111111',
                color: '#F9F8F6',
                padding: '16px 24px',
                borderRadius: '0px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid rgba(125, 107, 93, 0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                fontFamily: "'Inter', sans-serif",
            },
        };

        switch (type) {
            case 'success':
                toast.success(message, {
                    ...config,
                    icon: <CheckCircle2 size={18} className="text-green-500" />,
                    style: { ...config.style, borderLeft: '4px solid #10b981' }
                });
                break;
            case 'error':
                toast.error(message, {
                    ...config,
                    icon: <AlertCircle size={18} className="text-red-500" />,
                    style: { ...config.style, borderLeft: '4px solid #ef4444' }
                });
                break;
            case 'delete':
                toast(message, {
                    ...config,
                    icon: <Trash2 size={18} className="text-white" />,
                    style: { ...config.style, background: '#000000', borderLeft: '4px solid #ef4444' }
                });
                break;
            case 'info':
            case 'warning':
                toast(message, {
                    ...config,
                    icon: <Info size={18} className="text-brand-bronze" />,
                    style: { ...config.style, borderLeft: '4px solid #7D6B5D' }
                });
                break;
            default:
                toast(message, config);
        }
    }, []);

    const toastMethods = {
        success: (msg) => showToast(msg, 'success'),
        error: (msg) => showToast(msg, 'error'),
        info: (msg) => showToast(msg, 'info'),
        warning: (msg) => showToast(msg, 'warning'),
        delete: (msg) => showToast(msg, 'delete'),
    };

    return (
        <ToastContext.Provider value={toastMethods}>
            <Toaster position="bottom-right" reverseOrder={false} />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
