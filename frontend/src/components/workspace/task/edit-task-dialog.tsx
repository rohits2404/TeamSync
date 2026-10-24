import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { TaskType } from "@/types/api.type";
import { EditTaskForm } from "./edit-task-form";

export const EditTaskDialog = ({
    task,
    isOpen,
    onClose,
}: {
    task: TaskType;
    isOpen: boolean;
    onClose: () => void;
}) => {
    return (
        <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
                <EditTaskForm task={task} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
};
