import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.config.js";
import RoleModel from "../models/roles-permission.model.js";
import { RolePermissions } from "../utils/role-permission.js";

const seedRoles = async () => {
    console.log("Seeding Roles Started...");

    try {
        await connectDatabase();

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing Existing Roles...");
        await RoleModel.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName;
            const permissions = RolePermissions[role];

            const existingRole = await RoleModel.findOne({
                name: role,
            }).session(session);
            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions,
                });
                await newRole.save({ session });
                console.log(`Role ${role} Added With Permissions.`);
            } else {
                console.log(`Role ${role} Already Exists.`);
            }
        }

        await session.commitTransaction();
        console.log("Transaction Committed.");

        session.endSession();
        console.log("Session Ended.");

        console.log("Seeding Completed Successfully.");
    } catch (error) {
        console.error("Error During Seeding:", error);
    }
};

seedRoles().catch((error) =>
    console.error("Error Running Seed Script:", error),
);
