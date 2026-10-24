import { getWorkspaceByIdQueryFn } from "@/lib/api";
import type { CustomError } from "@/types/custom-error.type";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceQuery = (workspaceId: string) => {
    const query = useQuery<any, CustomError>({
        queryKey: ["workspace", workspaceId],
        queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
        staleTime: 0,
        retry: 2,
        enabled: !!workspaceId,
    });

    return query;
};
