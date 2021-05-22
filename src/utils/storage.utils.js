import GlobalConstants from "../constants/global.constants";

export default {

    getAccessToken: () => {
        return sessionStorage.getItem(GlobalConstants.STORAGE.ACCESS_TOKEN);
    },

    setAccessToken: (accessToken) => {
        sessionStorage.setItem(GlobalConstants.STORAGE.ACCESS_TOKEN, accessToken);
    },

    getUserData: () => {
        return JSON.parse(sessionStorage.getItem(GlobalConstants.STORAGE.USER_DATA));
    },

    setUserData: (data) => {
        sessionStorage.setItem(GlobalConstants.STORAGE.USER_DATA, JSON.stringify(data));
    }
}
