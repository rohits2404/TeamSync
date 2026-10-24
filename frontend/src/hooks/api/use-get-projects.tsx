import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import type { AllProjectPayloadType } from "@/types/api.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProjectsInWorkspaceQuery = ({
    workspaceId,
    pageSize,
    pageNumber,
    skip = false,
}: AllProjectPayloadType) => {
    const query = useQuery({
        queryKey: ["allprojects", workspaceId, pageNumber, pageSize],
        queryFn: () =>
            getProjectsInWorkspaceQueryFn({
                workspaceId,
                pageSize,
                pageNumber,
            }),
        staleTime: Infinity,
        placeholderData: skip ? undefined : keepPreviousData,
        enabled: !skip,
    });
    return query;
};
