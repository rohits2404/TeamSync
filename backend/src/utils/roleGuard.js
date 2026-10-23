import { UnauthorizedException } from "./appError.js";
import { RolePermissions } from "./role-permission.js";

export const roleGuard = (role, requiredPermissions) => {
    const permissions = RolePermissions[role];

    const hasPermission = requiredPermissions.every((permission) =>
        permissions.includes(permission),
    );

    if (!hasPermission) {
        throw new UnauthorizedException(
            "You Do Not Have The Necessary Permissions To Perform This Action.",
        );
    }
};
