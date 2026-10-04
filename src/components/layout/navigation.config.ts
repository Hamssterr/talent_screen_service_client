import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  FileCheck,
  Users,
  ShieldCheck,
  KeyRound,
  FileText,
  LucideIcon,
} from "lucide-react";
import { Permissions, PermissionKey } from "@/features/authorization/permission.constants";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  badge?: string | number;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  title?: string;
  items: NavigationItem[];
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
}

export const workspaceNavigation: NavigationSection[] = [
  {
    id: "main",
    items: [
      {
        id: "dashboard",
        label: "Tổng quan",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "jobs",
        label: "Vị trí tuyển dụng",
        href: "/jobs",
        icon: Briefcase,
        permission: Permissions.JobsRead,
      },
      {
        id: "candidates",
        label: "Ứng viên",
        href: "/candidates",
        icon: UserCheck,
        permission: Permissions.CandidatesRead,
      },
      {
        id: "applications",
        label: "Hồ sơ ứng tuyển",
        href: "/applications",
        icon: FileCheck,
        permission: Permissions.ApplicationsRead,
      },
    ],
  },
  {
    id: "admin",
    title: "Quản trị hệ thống",
    anyOf: [
      Permissions.UsersRead,
      Permissions.RolesRead,
      Permissions.PermissionsRead,
      Permissions.AuditRead,
    ],
    items: [
      {
        id: "admin-users",
        label: "Người dùng",
        href: "/admin/users",
        icon: Users,
        permission: Permissions.UsersRead,
      },
      {
        id: "admin-roles",
        label: "Vai trò",
        href: "/admin/roles",
        icon: ShieldCheck,
        permission: Permissions.RolesRead,
      },
      {
        id: "admin-permissions",
        label: "Danh mục quyền",
        href: "/admin/permissions",
        icon: KeyRound,
        permission: Permissions.PermissionsRead,
      },
      {
        id: "admin-audit-logs",
        label: "Nhật ký kiểm toán",
        href: "/admin/audit-logs",
        icon: FileText,
        permission: Permissions.AuditRead,
      },
    ],
  },
];
