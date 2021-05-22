import requestUtils from "../utils/request.utils";
import ApiService from "./api.service";

class AuthService {

    static async signin(data) {
        const result = await ApiService.post(`/auth/signin`, data);
        const auth = requestUtils.checkAndSaveRequestSignIn(result);
        if (auth) return auth;
        return false;
    }
}

export default AuthService;
