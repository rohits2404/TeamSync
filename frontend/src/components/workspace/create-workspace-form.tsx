import { createWorkspaceMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

export function WorkspaceForm({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createWorkspaceMutationFn,
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

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isPending) return;
        mutate(values, {
            onSuccess: (data) => {
                queryClient.resetQueries({
                    queryKey: ["userWorkspaces"],
                });

                const workspace = data.workspace;
                onClose();
                navigate(`/workspace/${workspace._id}`);
            },
            onError: (error) => {
                console.log(error);
                toast.error("Failed To Create Workspace");
            },
        });
    };

    return (
        <main className="w-full flex flex-row min-h-147.5 h-auto max-w-full">
            <div className="h-full px-10 py-10 flex-1">
                <div className="mb-5">
                    <h1
                        className="text-2xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        Let's Build a Workspace
                    </h1>
                    <p className="text-muted-foreground text-lg leading-tight">
                        Boost Your Productivity By Making It Easier For Everyone
                        To Access Projects In One Location.
                    </p>
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
                                                className="h-12!"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This Is The Name Of Your Company,
                                            Team Or Organization.
                                        </FormDescription>
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
                                                placeholder="Our Team Organizes Marketing Projects And Tasks Here."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Get Your Members On Board With a Few
                                            Words About Your Workspace.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={isPending}
                            className="w-full h-10 text-white font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Create Workspace
                        </Button>
                    </form>
                </Form>
            </div>
            <div
                className="relative flex-1 shrink-0 hidden bg-muted md:block
      bg-[url('/images/workspace.jpg')] bg-cover bg-center h-full
      "
            />
        </main>
    );
}
