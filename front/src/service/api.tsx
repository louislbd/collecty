import axios from 'axios';
import config from "../core/config";
import { StoreState } from '../service/store';



interface RequestProps {
    url: string;
    data?: any;
    store?: StoreState | null;
    needAuth?: boolean;
    extraHeaders?: Record<string, string>;
}

class ApiService {
    apiUrl: string = config.apiUrl;


    get(req: RequestProps) {
        if (req.needAuth && (!req.store || !req.store.token)) {
            throw new Error('Token is required');
        }
        const headers = (req.needAuth && req.store && req.store.token)
        ? {
            'X-CSRFToken': req.store.token,
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.store.token,
            ...req.extraHeaders,
        }
        : {
            'Content-Type': 'application/json',
            ...req.extraHeaders,
        };
        return axios.get(this.apiUrl + req.url, {
            withCredentials: req.needAuth,
            headers: headers,
        });
    }

    post(req: RequestProps) {
        if (req.needAuth && (!req.store || !req.store.token)) {
            throw new Error('Token is required');
        }
        const headers: Record<string, string> = (req.needAuth && req.store && req.store.token)
        ? {
            'X-CSRFToken': req.store.token,
            'Authorization': 'Bearer ' + req.store.token,
            'Content-Type': 'application/json',
            ...req.extraHeaders,
        }
        : {
            'Content-Type': 'application/json',
            ...req.extraHeaders,
        };

        return axios.post(this.apiUrl + req.url, JSON.stringify(req.data), {
            withCredentials: req.needAuth,
            headers: headers,
        });
    }

    postFormData(req: RequestProps) {
        if (req.needAuth && (!req.store || !req.store.token)) {
            throw new Error('Token is required');
        }
        const headers: Record<string, string> = (req.needAuth && req.store && req.store.token)
        ? {
            'X-CSRFToken': req.store.token,
            'Authorization': 'Bearer ' + req.store.token,
            ...req.extraHeaders,
        }
        : {
            ...req.extraHeaders,
        };

        return axios.postForm(this.apiUrl + req.url, req.data, {
            withCredentials: req.needAuth,
            headers: headers,
        });
    }
}

export const apiService = new ApiService();