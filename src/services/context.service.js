import contextAdapter from "../utils/adapters/context.adapter";
import requestUtils from "../utils/request.utils";
import ApiService from "./api.service";

class ContextService {

    static async getAll() {
        const result = await ApiService.get(`/context`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return contextAdapter.getAll(data);
        return [];
    }

    static async getById(id) {
        const result = await ApiService.get(`/context/${id}`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return data;
        return false;
    }

    static async insert(data) {
        const result = await ApiService.post(`/context`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async update(data) {
        const result = await ApiService.post(`/context/update`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async updateUsers(data) {
        const result = await ApiService.post(`/context/update/user`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async deleteById(id) {
        const result = await ApiService.delete(`/context/${id}`);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }
}

export default ContextService;
