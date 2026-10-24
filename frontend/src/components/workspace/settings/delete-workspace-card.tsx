import { Button } from "@/components/ui/button";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { deleteWorkspaceMutationFn } from "@/lib/api";
import { ConfirmDialog } from "@/resuable/confirm-dialog";
import { PermissionsGuard } from "@/resuable/permission-guard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const DeleteWorkspaceCard = () => {
    const { workspace } = useAuthContext();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteWorkspaceMutationFn,
    });

    const handleConfirm = () => {
        mutate(workspaceId, {
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: ["userWorkspaces"],
                });
                navigate(`/workspace/${data.currentWorkspace}`);
                setTimeout(() => onCloseDialog(), 100);
            },
            onError: (error) => {
                toast.error(`${error.message}`);
            },
        });
    };
    return (
        <>
            <div className="w-full">
                <div className="mb-5 border-b">
                    <h1
                        className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        Delete Workspace
                    </h1>
                </div>

                <PermissionsGuard
                    showMessage
                    requiredPermission={Permissions.DELETE_WORKSPACE}
                >
                    <div className="flex flex-col items-start justify-between py-0">
                        <div className="flex-1 mb-2">
                            <p>
                                Deleting A Workspace Is A Permanent Action And
                                Cannot Be Undone. Once You Delete A Workspace,
                                All Its Associated Data, Including Projects,
                                Tasks, And Member Roles, Will Be Permanently
                                Removed. Please Proceed With Caution And Ensure
                                This Action Is Intentional.
                            </p>
                        </div>
                        <Button
                            className="shrink-0 flex place-self-end h-10"
                            variant="destructive"
                            onClick={onOpenDialog}
                        >
                            Delete Workspace
                        </Button>
                    </div>
                </PermissionsGuard>
            </div>

            <ConfirmDialog
                isOpen={open}
                isLoading={isPending}
                onClose={onCloseDialog}
                onConfirm={handleConfirm}
                title={`Delete  ${workspace?.name} Workspace`}
                description={`Are You Sure You Want To Delete? This Action Cannot Be Undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};
