import {
    TaskPriorityEnum,
    type TaskPriorityEnumType,
    TaskStatusEnum,
    type TaskStatusEnumType,
} from "@/constant";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useTaskTableFilter = () => {
    return useQueryStates({
        status: parseAsStringEnum<TaskStatusEnumType>(
            Object.values(TaskStatusEnum),
        ),
        priority: parseAsStringEnum<TaskPriorityEnumType>(
            Object.values(TaskPriorityEnum),
        ),
        keyword: parseAsString,
        projectId: parseAsString,
        assigneeId: parseAsString,
    });
};
