import DBRolesConstants from "../constants/dbRoles.constants";
import Roles from "../constants/roles.constants";
import StorageUtils from "./storage.utils";

function containsOneOf(target, list){
    if (target && list) return list.some(i => target.includes(i));
    return false;
}

const userRolePermission = [
    DBRolesConstants.ROLE_USER,
    DBRolesConstants.ROLE_MODERATOR,
    DBRolesConstants.ROLE_ADMIN,
];

const moderatorRolePermission = [
    DBRolesConstants.ROLE_MODERATOR,
    DBRolesConstants.ROLE_ADMIN,
];

const adminRolePermission = [
    DBRolesConstants.ROLE_ADMIN,
];

const contextRolePermission = [
    Roles.INSTRUCTOR,
    Roles.ADMIN,
]

export default {

    hasModeratorRole: () => {
        const userData = StorageUtils.getUserData();
        const { roles } = userData;
        return containsOneOf(moderatorRolePermission, roles);
    },

    hasAdminRole: () => {
        const userData = StorageUtils.getUserData();
        const { roles } = userData;
        return containsOneOf(adminRolePermission, roles);
    },

    isContextInstructor: ({ users }) => {
        const userData = StorageUtils.getUserData();
        const user = users.find(item => item.user._id === userData.id);
        if (user) return containsOneOf(contextRolePermission, [user.role]);
        return false;
    }
}
