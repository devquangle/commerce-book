import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastOptions {
  id?: string | number;
}

const commonSettings = {
  position: "top-right" as const,
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: { marginTop: '45px' }
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...commonSettings,
    theme: "colored",
    ...(options?.id ? { toastId: options.id } : {}),
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...commonSettings,
    ...(options?.id ? { toastId: options.id } : {}),
  });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...commonSettings,
    ...(options?.id ? { toastId: options.id } : {}),
  });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...commonSettings,
    ...(options?.id ? { toastId: options.id } : {}),
  });
};

export const dismissToast = (id: string | number) => {
  toast.dismiss(id);
};