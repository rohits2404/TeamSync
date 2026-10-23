import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import { Roles } from "../enums/role.enum.js";
import MemberModel from "../models/member.model.js";
import RoleModel from "../models/roles-permission.model.js";
import WorkspaceModel from "../models/workspace.model.js";
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from "../utils/appError.js";

export const getMemberRoleInWorkspace = async (userId, workspaceId) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace Not Found");
    }

    const member = await MemberModel.findOne({
        userId,
        workspaceId,
    }).populate("role");

    if (!member) {
        throw new UnauthorizedException(
            "You Are Not a Member Of This Workspace",
            ErrorCodeEnum.ACCESS_UNAUTHORIZED,
        );
    }

    const roleName = member.role?.name;

    return { role: roleName };
};

export const joinWorkspaceByInviteService = async (userId, inviteCode) => {
    const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new NotFoundException(
            "Invalid Invite Code Or Workspace Not Found",
        );
    }

    const existingMember = await MemberModel.findOne({
        userId,
        workspaceId: workspace._id,
    }).exec();

    if (existingMember) {
        throw new BadRequestException(
            "You Are Already a Member Of This Workspace",
        );
    }

    const role = await RoleModel.findOne({ name: Roles.MEMBER });

    if (!role) {
        throw new NotFoundException("Role Not Found");
    }

    const newMember = new MemberModel({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });
    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
};
