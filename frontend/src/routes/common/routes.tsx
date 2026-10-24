import Login from "@/pages/auth/Login";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePaths";
import Register from "@/pages/auth/Register";
import GoogleOAuthFailure from "@/pages/auth/GoogleOAuthFailure";
import WorkspaceDashboard from "@/pages/workspace/Dashboard";
import Tasks from "@/pages/workspace/Tasks";

export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, element: <Login /> },
    { path: AUTH_ROUTES.SIGN_UP, element: <Register /> },
    {
        path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK,
        element: <GoogleOAuthFailure />,
    },
];

export const protectedRoutePaths = [
    { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
    { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
];
