import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentMembers } from "@/components/workspace/member/recent-members";
import { RecentProjects } from "@/components/workspace/project/recent-projects";
import { RecentTasks } from "@/components/workspace/task/recent-tasks";
import { WorkspaceAnalytics } from "@/components/workspace/workspace-analytics";
import { useCreateProjectDialog } from "@/hooks/use-create-project-dialog";
import { Plus } from "lucide-react";

const WorkspaceDashboard = () => {
    const { onOpen } = useCreateProjectDialog();

    return (
        <div className="flex min-w-0 flex-1 flex-col py-4 md:pt-3">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Workspace Overview
                    </h2>
                    <p className="text-muted-foreground">
                        Here's An Overview For This Workspace!
                    </p>
                </div>

                <Button onClick={onOpen} className="shrink-0">
                    <Plus />
                    New Project
                </Button>
            </div>

            <WorkspaceAnalytics />

            <div className="mt-4 min-w-0">
                <Tabs
                    defaultValue="projects"
                    className="w-full rounded-lg border p-2"
                >
                    <TabsList className="h-12 w-full justify-start border-0 bg-gray-50 px-1">
                        <TabsTrigger className="py-2" value="projects">
                            Recent Projects
                        </TabsTrigger>
                        <TabsTrigger className="py-2" value="tasks">
                            Recent Tasks
                        </TabsTrigger>
                        <TabsTrigger className="py-2" value="members">
                            Recent Members
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects">
                        <RecentProjects />
                    </TabsContent>

                    <TabsContent value="tasks">
                        <RecentTasks />
                    </TabsContent>

                    <TabsContent value="members">
                        <RecentMembers />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default WorkspaceDashboard;
