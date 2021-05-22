import StorageUtils from '../utils/storage.utils';

export default {

    checkAndGetRequestMsg: (request) => {
        const { data: dataRequest, status: statusRequest } = request;

        if (statusRequest === 200) {
            const {  msg } = dataRequest;
            return msg;
        }
        return false;
    },

    checkAndGetRequestData: (request) => {
        const { data: dataRequest, status: statusRequest } = request;

        if (statusRequest === 200) {
            const { data, status } = dataRequest;
            if (status === 200) {
                return data;
            }
        }
        return false;
    },

    checkAndSaveRequestSignIn: (request) => {
        const { data: dataRequest, status: statusRequest } = request;

        if (statusRequest === 200) {
            const { data, status } = dataRequest;
            if (status === 200) {
                const { accessToken } = data;
                StorageUtils.setAccessToken(accessToken);
                StorageUtils.setUserData(data);
                return data;
            }
        }
        return false;
    }
}
