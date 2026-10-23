import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { registerSchema } from "../validation/auth.validation.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { registerUserService } from "../services/auth.service.js";
import passport from "passport";

export const googleLoginCallback = asyncHandler(async (req, res) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
        return res.redirect(
            `${process.env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`,
        );
    }

    return res.redirect(
        `${process.env.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`,
    );
});

export const registerUserController = asyncHandler(async (req, res) => {
    const body = registerSchema.parse({
        ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User Created Successfully",
    });
});

export const loginController = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid Email Or Password",
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            return res.status(HTTPSTATUS.OK).json({
                message: "Logged In Successfully",
                user,
            });
        });
    })(req, res, next);
});

export const logOutController = asyncHandler(async (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res
                .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed To Log Out" });
        }
    });

    req.session = null;
    return res
        .status(HTTPSTATUS.OK)
        .json({ message: "Logged Out Successfully" });
});
