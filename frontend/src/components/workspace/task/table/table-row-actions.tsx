import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/resuable/confirm-dialog";
import type { TaskType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { deleteTaskMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { EditTaskDialog } from "../edit-task-dialog";
import type { AssetTableFeatures } from "@/lib/table-features";

interface DataTableRowActionsProps {
    row: Row<AssetTableFeatures, TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const [openDeleteDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteTaskMutationFn,
    });

    const task = row.original;
    const taskId = task._id as string;
    const taskCode = task.taskCode;

    const handleConfirm = () => {
        mutate(
            { workspaceId, taskId },
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries({
                        queryKey: ["all-tasks", workspaceId],
                    });
                    toast.success(`${data.message}`);
                    setTimeout(() => setOpenDialog(false), 100);
                },
                onError: (error) => {
                    toast.error(`${error.message}`);
                },
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    {/* Edit Task Option */}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setOpenEditDialog(true)}
                    >
                        <Pencil className="w-4 h-4 mr-2" /> Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Delete Task Option */}
                    <DropdownMenuItem
                        className="text-destructive! cursor-pointer"
                        onClick={() => setOpenDialog(true)}
                    >
                        Delete Task
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Task Dialog */}
            <EditTaskDialog
                task={task}
                isOpen={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
            />

            {/* Delete Task Confirmation Dialog */}
            <ConfirmDialog
                isOpen={openDeleteDialog}
                isLoading={isPending}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleConfirm}
                title="Delete Task"
                description={`Are You Sure You Want To Delete ${taskCode}?`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
}
