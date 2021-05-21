import axios from "axios";
import configs from "../configs";
import contextAdapter from "../utils/adapters/context.adapter";
import requestUtils from "../utils/request.utils";

class ContextService {

    static async getAll() {
        const result = await axios.get(`${configs.api.server}/context`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return contextAdapter.getAll(data);
        return [];
    }

    static async getById(id) {
        const result = await axios.get(`${configs.api.server}/context/${id}`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return data;
        return false;
    }

    static async insert(data) {
        const result = await axios.post(`${configs.api.server}/context`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async update(data) {
        const result = await axios.post(`${configs.api.server}/context/update`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async deleteById(id) {
        const result = await axios.delete(`${configs.api.server}/context/${id}`);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }
}

export default ContextService;
