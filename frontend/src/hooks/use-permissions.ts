import type { PermissionType } from "@/constant";
import type { UserType, WorkspaceWithMembersType } from "@/types/api.type";
import { useEffect, useMemo, useState } from "react";

export const usePermissions = (
    user: UserType | undefined,
    workspace: WorkspaceWithMembersType | undefined,
) => {
    const [permissions, setPermissions] = useState<PermissionType[]>([]);

    useEffect(() => {
        if (user && workspace) {
            const member = workspace.members.find(
                (member) => member.userId === user._id,
            );
            if (member) {
                setPermissions(member.role.permissions || []);
            }
        }
    }, [user, workspace]);

    return useMemo(() => permissions, [permissions]);
};
