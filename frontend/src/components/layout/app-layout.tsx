import { AuthProvider } from "@/context/auth-provider";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { WorkspaceSidebar } from "../sidebar/sidebar";
import { Header } from "../header";
import { Outlet } from "react-router-dom";
import { CreateWorkspaceDialog } from "../workspace/create-workspace-dialog";
import { CreateProjectDialog } from "../workspace/project/create-project-dialog";

const AppLayout = () => {
    return (
        <AuthProvider>
            <SidebarProvider>
                <WorkspaceSidebar />

                <SidebarInset className="min-w-0 flex-1 overflow-x-hidden">
                    <Header />

                    <main className="w-full min-w-0 px-3 py-3 lg:px-6">
                        <Outlet />
                    </main>

                    <CreateWorkspaceDialog />
                    <CreateProjectDialog />
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
};

export default AppLayout;
