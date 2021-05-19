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
    }
}
