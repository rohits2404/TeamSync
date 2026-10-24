import { logoutMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

export const LogoutDialog = (props: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { isOpen, setIsOpen } = props;
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: logoutMutationFn,
        onSuccess: () => {
            queryClient.resetQueries({
                queryKey: ["authUser"],
            });
            navigate("/");
            setIsOpen(false);
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed To Logout");
        },
    });

    const handleLogout = useCallback(() => {
        if (isPending) return;
        mutate();
    }, [isPending, mutate]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Are You Sure You Want To Log Out?
                        </DialogTitle>
                        <DialogDescription>
                            This Will End Your Current Session And You Will Need
                            To Log In Again To Access Your Account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            disabled={isPending}
                            type="button"
                            onClick={handleLogout}
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Sign Out
                        </Button>
                        <Button type="button" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
