import { Job } from "../types/job.types";

export interface JobActionCapabilities {
  canView: boolean;
  canEdit: boolean;
  canClose: boolean;
  canDelete: boolean;
}

/**
 * Computes UI action availability for a given job.
 * Note: Backend enforces authoritative policy; this utility drives presentation state only.
 */
export function getJobActionCapabilities({
  job,
  currentUserId,
  hasReadPermission = false,
  hasUpdatePermission = false,
  hasClosePermission = false,
  hasManagePermission = false,
}: {
  job: Job;
  currentUserId?: string;
  hasReadPermission?: boolean;
  hasUpdatePermission?: boolean;
  hasClosePermission?: boolean;
  hasManagePermission?: boolean;
}): JobActionCapabilities {
  const isOwner = Boolean(currentUserId && job.ownerId === currentUserId);
  const isClosed = job.status === "closed";

  // Viewing: open to anyone with jobs:read if job is open, or if user is owner / admin
  const canView =
    hasReadPermission && (job.status === "open" || isOwner || hasManagePermission);

  // Editing: only allowed if job is not closed AND user has jobs:update AND (is owner or has jobs:manage)
  const canEdit =
    !isClosed && hasUpdatePermission && (isOwner || hasManagePermission);

  // Closing: only allowed if job is not closed AND user has jobs:close AND (is owner or has jobs:manage)
  const canClose =
    !isClosed && hasClosePermission && (isOwner || hasManagePermission);

  // Soft deleting: reserved strictly for users with jobs:manage (Admin)
  const canDelete = hasManagePermission;

  return {
    canView,
    canEdit,
    canClose,
    canDelete,
  };
}
