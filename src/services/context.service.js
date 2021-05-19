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
}

export default ContextService;
