import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import { useGetProjectsInWorkspaceQuery } from "@/hooks/api/use-get-projects";
import { useGetWorkspaceMembers } from "@/hooks/api/use-get-workspace-members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { createTaskMutationFn } from "@/lib/api";
import {
    getAvatarColor,
    getAvatarFallbackText,
    transformOptions,
} from "@/lib/helper";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function CreateTaskForm(props: {
    projectId?: string;
    onClose: () => void;
}) {
    const { projectId, onClose } = props;

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useMutation({
        mutationFn: createTaskMutationFn,
    });

    const { data, isLoading } = useGetProjectsInWorkspaceQuery({
        workspaceId,
        skip: !!projectId,
    });

    const { data: memberData } = useGetWorkspaceMembers(workspaceId);

    const projects = data?.projects || [];
    const members = memberData?.members || [];

    //Workspace Projects
    const projectOptions = projects?.map((project) => {
        return {
            label: (
                <div className="flex items-center gap-1">
                    <span>{project.emoji}</span>
                    <span>{project.name}</span>
                </div>
            ),
            value: project._id,
        };
    });

    // Workspace Memebers
    const membersOptions = members?.map((member) => {
        const name = member.userId?.name || "Unknown";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        return {
            label: (
                <div className="flex items-center space-x-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage
                            src={member.userId?.profilePicture || ""}
                            alt={name}
                        />
                        <AvatarFallback className={avatarColor}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                </div>
            ),
            value: member.userId._id,
        };
    });

    const formSchema = z.object({
        title: z.string().trim().min(1, {
            message: "Title Is Required",
        }),
        description: z.string().trim(),
        projectId: z.string().trim().min(1, {
            message: "Project Is Required",
        }),
        status: z.enum(
            Object.values(TaskStatusEnum) as [
                "BACKLOG",
                "TODO",
                "IN_PROGRESS",
                "IN_REVIEW",
                "DONE",
            ],
            {
                error: "Status Is Required",
            },
        ),

        priority: z.enum(
            Object.values(TaskPriorityEnum) as ["LOW", "MEDIUM", "HIGH"],
            {
                error: "Priority Is Required",
            },
        ),
        assignedTo: z.string().trim().min(1, {
            message: "AssignedTo Is Required",
        }),
        dueDate: z.date({
            error: "A Date Of Birth Is Required.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            projectId: projectId ?? "",
            status: "TODO",
            priority: "MEDIUM",
            assignedTo: "",
        },
    });

    const taskStatusList = Object.values(TaskStatusEnum);
    const taskPriorityList = Object.values(TaskPriorityEnum);

    const statusOptions = transformOptions(taskStatusList);
    const priorityOptions = transformOptions(taskPriorityList);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isPending) return;
        const payload = {
            workspaceId,
            projectId: values.projectId,
            data: {
                ...values,
                dueDate: values.dueDate.toISOString(),
            },
        };

        mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["project-analytics", projectId],
                });

                queryClient.invalidateQueries({
                    queryKey: ["all-tasks", workspaceId],
                });

                toast.success("Task Created Successfully");
                onClose();
            },
            onError: (error) => {
                toast.error(`${error.message}`);
            },
        });
    };

    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full">
                <div className="mb-5 pb-2 border-b">
                    <h1
                        className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
                    >
                        Create Task
                    </h1>
                    <p className="text-muted-foreground text-sm leading-tight">
                        Organize And Manage Tasks, Resources, And Team
                        Collaboration
                    </p>
                </div>
                <Form {...form}>
                    <form
                        className="space-y-3"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Task Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Website Redesign"
                                                className="h-12!"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* {Description} */}
                        <div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                            Task Description
                                            <span className="text-xs font-extralight ml-2">
                                                Optional
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={1}
                                                placeholder="Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* {ProjectId} */}

                        {!projectId && (
                            <div>
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a project" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoading && (
                                                        <div className="my-2">
                                                            <Loader className="w-4 h-4 place-self-center flex animate-spin" />
                                                        </div>
                                                    )}
                                                    <div
                                                        className="w-full max-h-50
                           overflow-y-auto scrollbar
                          "
                                                    >
                                                        {projectOptions?.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    className="capitalize! cursor-pointer"
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* {Members AssigneeTo} */}

                        <div>
                            <FormField
                                control={form.control}
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assigned To</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a assignee" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <div
                                                    className="w-full max-h-50
                           overflow-y-auto scrollbar
                          "
                                                >
                                                    {membersOptions?.map(
                                                        (option) => (
                                                            <SelectItem
                                                                className="cursor-pointer"
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </div>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* {Due Date} */}
                        <div className="mt-2!">
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full flex-1 pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP",
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a Date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date <
                                                            new Date(
                                                                new Date().setHours(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                ),
                                                            ) ||
                                                        date >
                                                            new Date(
                                                                "2100-12-31",
                                                            )
                                                    }
                                                    defaultMonth={new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* {Status} */}

                        <div>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        className="text-muted-foreground! capitalize!"
                                                        placeholder="Select a Status"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {statusOptions?.map(
                                                    (status) => (
                                                        <SelectItem
                                                            className="capitalize!"
                                                            key={status.value}
                                                            value={status.value}
                                                        >
                                                            {status.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* {Priority} */}
                        <div>
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {priorityOptions?.map(
                                                    (priority) => (
                                                        <SelectItem
                                                            className="capitalize!"
                                                            key={priority.value}
                                                            value={
                                                                priority.value
                                                            }
                                                        >
                                                            {priority.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            className="flex place-self-end  h-10 text-white font-semibold"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Create
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
