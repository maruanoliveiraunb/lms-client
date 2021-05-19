export default {

    getAll: (data) => {
        return data.map(item => {
            const { _id, name, type, lineItems, users } = item;
            return {
                id: _id,
                name: name,
                type: type,
                lineItems: lineItems,
                qtdLineItems: lineItems.length,
                users: users,
                qtdUsers: users.length,
            }
        });
    }
}
