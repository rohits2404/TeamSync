import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { editWorkspaceMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

export function EditWorkspaceForm() {
    const { workspace, hasPermission } = useAuthContext();
    const canEditWorkspace = hasPermission(Permissions.EDIT_WORKSPACE);

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useMutation({
        mutationFn: editWorkspaceMutationFn,
    });

    const formSchema = z.object({
        name: z.string().trim().min(1, {
            message: "Workspace Name Is Required",
        }),
        description: z.string().trim(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (workspace) {
            form.setValue("name", workspace.name);
            form.setValue("description", workspace?.description || "");
        }
    }, [form, workspace]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isPending) return;
        const payload = {
            workspaceId: workspaceId,
            data: { ...values },
        };
        mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["workspace"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["userWorkspaces"],
                });
            },
            onError: (error) => {
                toast.error(`${error.message}`);
            },
        });
    };

    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className="mb-5 border-b">
                    <h1
                        className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        Edit Workspace
                    </h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Workspace Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Taco's Co."
                                                className="h-12! disabled:opacity-90 disabled:pointer-events-none"
                                                disabled={!canEditWorkspace}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Workspace Description
                                            <span className="text-xs font-extralight ml-2">
                                                Optional
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={6}
                                                disabled={!canEditWorkspace}
                                                className="disabled:opacity-90 disabled:pointer-events-none"
                                                placeholder="Our Team Organizes Marketing Projects And Tasks Here."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {canEditWorkspace && (
                            <Button
                                className="flex place-self-end h-10 text-white font-semibold"
                                disabled={isPending}
                                type="submit"
                            >
                                {isPending && (
                                    <Loader className="animate-spin" />
                                )}
                                Update Workspace
                            </Button>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}
