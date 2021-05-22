import axios from "axios";
import configs from "../configs";
import StorageUtils from '../utils/storage.utils';

const axiosInstance = axios.create({
    baseURL: configs.api.server,
    timeout: 1000,
    headers: {'x-access-token': StorageUtils.getAccessToken()}
});

class ApiService {

    static async get(url) {
        try {
            return await axiosInstance.get(url);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 401) {
                window.location.replace('/');
            } else {
                return error;
            }
        }
    }

    static async post(url, data) {
        try {
            return await axiosInstance.post(url, data);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 401) {
                window.location.replace('/');
            } else {
                return error;
            }
        }
    }

    static async delete(url) {
        try {
            return await axiosInstance.delete(url);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 401) {
                window.location.replace('/');
            } else {
                return error;
            }
        }
    }
}

export default ApiService;
