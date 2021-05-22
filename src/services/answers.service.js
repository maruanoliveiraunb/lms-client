import axios from "axios";
import configs from "../configs";
import requestUtils from "../utils/request.utils";

class AnswersService {

    static async getById(id) {
        const result = await axios.get(`${configs.api.server}/answer/${id}`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return data;
        return false;
    }

    static async insert(data) {
        const result = await axios.post(`${configs.api.server}/answer`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async update(data) {
        const result = await axios.post(`${configs.api.server}/answer/update`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async deleteById(id) {
        const result = await axios.delete(`${configs.api.server}/answer/${id}`);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }
}

export default AnswersService;
