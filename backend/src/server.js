import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "cookie-session";
import { connectDatabase } from "./config/database.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { HTTPSTATUS } from "./config/http.config.js";
import { asyncHandler } from "./middlewares/asyncHandler.middleware.js";
import { BadRequestException } from "./utils/appError.js";
import { ErrorCodeEnum } from "./enums/error-code.enum.js";

import "./config/passport.config.js";
import passport from "passport";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.middleware.js";
import workspaceRoutes from "./routes/workspace.route.js";
import memberRoutes from "./routes/member.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";

const app = express();
const BASE_PATH = process.env.BASE_PATH;

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true,
    }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
    session({
        name: "session",
        keys: [process.env.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }),
);

app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => cb();
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => cb();
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.get(
    `/`,
    asyncHandler(async (req, res, next) => {
        throw new BadRequestException(
            "This Is a Bad Request",
            ErrorCodeEnum.AUTH_INVALID_TOKEN,
        );
        return res.status(HTTPSTATUS.OK).json({
            message: "Hello Subscribe to the channel & share",
        });
    }),
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    console.log(
        `Server Listening On Port ${process.env.PORT} In ${process.env.NODE_ENV}`,
    );
    await connectDatabase();
});
