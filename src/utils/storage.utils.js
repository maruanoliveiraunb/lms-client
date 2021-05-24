import GlobalConstants from "../constants/global.constants";

export default {

    getAccessToken: () => {
        return localStorage.getItem(GlobalConstants.STORAGE.ACCESS_TOKEN);
    },

    setAccessToken: (accessToken) => {
        localStorage.setItem(GlobalConstants.STORAGE.ACCESS_TOKEN, accessToken);
    },

    removeAccessToken: () => {
        localStorage.removeItem(GlobalConstants.STORAGE.ACCESS_TOKEN);
    },

    getUserData: () => {
        return JSON.parse(localStorage.getItem(GlobalConstants.STORAGE.USER_DATA));
    },

    setUserData: (data) => {
        localStorage.setItem(GlobalConstants.STORAGE.USER_DATA, JSON.stringify(data));
    },

    removeUserData: () => {
        localStorage.removeItem(GlobalConstants.STORAGE.USER_DATA);
    },

    getCurrentContextId: () => {
        return localStorage.getItem(GlobalConstants.STORAGE.CURRENT_CONTEXT_ID);
    },

    setCurrentContextId: (id) => {
        localStorage.setItem(GlobalConstants.STORAGE.CURRENT_CONTEXT_ID, id);
    },
}
