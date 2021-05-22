import requestUtils from "../utils/request.utils";
import ApiService from "./api.service";

class LineItemsService {

    static async getById(id) {
        const result = await ApiService.get(`/lineitem/${id}`);
        const data = requestUtils.checkAndGetRequestData(result);
        if (data) return data;
        return false;
    }

    static async insert(data) {
        const result = await ApiService.post(`/lineitem`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async update(data) {
        const result = await ApiService.post(`/lineitem/update`, data);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }

    static async deleteById(id) {
        const result = await ApiService.delete(`/lineitem/${id}`);
        const msg = requestUtils.checkAndGetRequestMsg(result);
        if (msg) return msg;
        return false;
    }
}

export default LineItemsService;
