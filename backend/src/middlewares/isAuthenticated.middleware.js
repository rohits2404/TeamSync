import { UnauthorizedException } from "../utils/appError.js";

export const isAuthenticated = (req, res, next) => {
    if (!req.user || !req.user._id) {
        throw new UnauthorizedException("Unauthorized. Please Log In.");
    }
    next();
};
