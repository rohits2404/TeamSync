import type { PermissionType } from "@/constant";
import { useAuth } from "@/hooks/api/use-auth";
import { useGetWorkspaceQuery } from "@/hooks/api/use-get-workspace";
import { usePermissions } from "@/hooks/use-permissions";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import type { UserType, WorkspaceType } from "@/types/api.type";
import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
    user?: UserType;
    workspace?: WorkspaceType;
    hasPermission: (permission: PermissionType) => boolean;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    workspaceLoading: boolean;
    refetchAuth: () => void;
    refetchWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const navigate = useNavigate();
    const workspaceId = useWorkspaceId();

    const {
        data: authData,
        error: authError,
        isLoading,
        isFetching,
        refetch: refetchAuth,
    } = useAuth();
    const user = authData?.user;

    const {
        data: workspaceData,
        isLoading: workspaceLoading,
        error: workspaceError,
        refetch: refetchWorkspace,
    } = useGetWorkspaceQuery(workspaceId);

    const workspace = workspaceData?.workspace;

    useEffect(() => {
        if (workspaceError) {
            if (workspaceError?.errorCode === "ACCESS_UNAUTHORIZED") {
                navigate("/");
            }
        }
    }, [navigate, workspaceError]);

    const permissions = usePermissions(user, workspace);

    const hasPermission = (permission: PermissionType): boolean => {
        return permissions.includes(permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                workspace,
                hasPermission,
                error: authError || workspaceError,
                isLoading,
                isFetching,
                workspaceLoading,
                refetchAuth,
                refetchWorkspace,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useCurrentUserContext must be used within a AuthProvider",
        );
    }
    return context;
};
