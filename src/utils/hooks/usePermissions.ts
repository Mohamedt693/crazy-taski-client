import { useMemo } from "react";
import type { ProjectSettings } from "../../types/project.type";

export const usePermissions = (userRole: string, projectSettings?: ProjectSettings) => {
    return useMemo(() => {
        const isOwner = userRole === "owner";
        const isEditor = userRole === "editor";
        const isCreator = userRole === "creator";
        const isAssignee = userRole === "assignee";

        return {
            canManageProject: isOwner, 

            canEditEntityDetails: isOwner || isEditor || isCreator,

            canUpdateStatus: isOwner || isEditor || isCreator || isAssignee,

            canMemberInvite: isOwner || (isEditor && projectSettings?.canMembersInvite === true),

            hasAnyWriteAccess: ["owner", "editor", "creator", "assignee"].includes(userRole),
            isReadOnly: userRole === "viewer" || userRole === "",
            isAssignee,
        };
    }, [userRole, projectSettings]);
};