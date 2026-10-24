import type { PermissionType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";

type PermissionsGuardProps = {
    requiredPermission: PermissionType;
    children: React.ReactNode;
    showMessage?: boolean;
};

export const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
    requiredPermission,
    showMessage = false,
    children,
}) => {
    const { hasPermission } = useAuthContext();

    if (!hasPermission(requiredPermission)) {
        return (
            showMessage && (
                <div
                    className="text-center 
        text-sm pt-3
        italic
        w-full
        text-muted-foreground"
                >
                    You Do Not Have The Permission To View This
                </div>
            )
        );
    }

    return <>{children}</>;
};
