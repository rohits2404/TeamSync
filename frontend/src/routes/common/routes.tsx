import Login from "@/pages/auth/Login";
import { AUTH_ROUTES } from "./routePaths";
import Register from "@/pages/auth/Register";
import GoogleOAuthFailure from "@/pages/auth/GoogleOAuthFailure";

export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, element: <Login /> },
    { path: AUTH_ROUTES.SIGN_UP, element: <Register /> },
    {
        path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK,
        element: <GoogleOAuthFailure />,
    },
];
