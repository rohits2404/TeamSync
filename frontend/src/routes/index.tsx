import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "./auth-route";
import { BaseLayout } from "@/components/layout/base-layout";
import { authenticationRoutePaths, protectedRoutePaths } from "./common/routes";
import ProtectedRoute from "./protected.route";
import AppLayout from "@/components/layout/app-layout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthRoute />}>
                    <Route element={<BaseLayout />}>
                        {authenticationRoutePaths.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>
                <Route path="/" element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        {protectedRoutePaths.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
