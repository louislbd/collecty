import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showSuccess = (message: string) => {
    const options: ToastOptions = {
        toastId: `${Math.random()}`,
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        style: {
            backgroundColor: 'green',
            color: 'white',
            fontSize: '20px',
            padding: '20px',
        },
    };
    toast.success(message, options);
};

const showError = (message: string) => {
    const options: ToastOptions = {
        toastId: `${Math.random()}`,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        style: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: '20px',
            padding: '20px',
        },
    };
    toast.error(message, options);
};

export { showSuccess, showError };
