import { Permissions } from "@/constant";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getProjectByIdQueryFn } from "@/lib/api";
import { PermissionsGuard } from "@/resuable/permission-guard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { EditProjectDialog } from "./edit-project-dialog";
import { CreateTaskDialog } from "../task/create-task-dialog";

export const ProjectHeader = () => {
    const param = useParams();
    const projectId = param.projectId as string;

    const workspaceId = useWorkspaceId();

    const { data, isPending, isError } = useQuery({
        queryKey: ["singleProject", projectId],
        queryFn: () =>
            getProjectByIdQueryFn({
                workspaceId,
                projectId,
            }),
        staleTime: Infinity,
        enabled: !!projectId,
        placeholderData: keepPreviousData,
    });

    const project = data?.project;

    // Fallback if no project data is found
    const projectEmoji = project?.emoji || "📊";
    const projectName = project?.name || "Untitled Project";

    const renderContent = () => {
        if (isPending) return <span>Loading...</span>;
        if (isError) return <span>Error Occured</span>;
        return (
            <>
                <span>{projectEmoji}</span>
                {projectName}
            </>
        );
    };
    return (
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
                    {renderContent()}
                </h2>
                <PermissionsGuard requiredPermission={Permissions.EDIT_PROJECT}>
                    <EditProjectDialog project={project} />
                </PermissionsGuard>
            </div>
            <CreateTaskDialog projectId={projectId} />
        </div>
    );
};
