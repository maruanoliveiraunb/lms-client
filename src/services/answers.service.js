import requestUtils from "../utils/request.utils";
import ApiService from "./api.service";

class AnswersService {

    static async getById(id) {
        const result = await ApiService.get(`/answer/${id}`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return data;
        return false;
    }

    static async insert(data) {
        const result = await ApiService.post(`/answer`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async update(data) {
        const result = await ApiService.post(`/answer/update`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async deleteById(id) {
        const result = await ApiService.delete(`/answer/${id}`);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }
}

export default AnswersService;
