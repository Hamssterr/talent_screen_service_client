import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserCircle2, Mail, ShieldCheck, KeyRound, Activity } from "lucide-react";
import { CurrentUser, AuthorizationContext } from "@/features/auth/types/auth.types";
import { LucideIcon } from "lucide-react";

interface UserProfileCardProps {
  user: CurrentUser;
  authorization?: AuthorizationContext;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
  valueClass = "",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <div className={`text-sm font-semibold tracking-wide ${valueClass || "text-foreground"}`}>
      {value}
    </div>
  </div>
);

export const UserProfileCard = ({ user, authorization }: UserProfileCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="relative flex flex-col items-center pt-8 pb-6 border-b border-border/10">
        <div className="relative mb-3">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-background border-4 border-muted/30 shadow-sm">
            <UserCircle2
              className="w-12 h-12 text-primary/80"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">
          {user.name || user.email.split("@")[0]}
        </CardTitle>
        <CardDescription className="mt-1">
          Hồ sơ người dùng hệ thống (Todo 00 Verification)
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col gap-2">
          <InfoRow icon={Mail} label="Địa chỉ Email" value={user.email} />
          
          <InfoRow
            icon={ShieldCheck}
            label="Vai trò (Roles)"
            value={
              authorization?.roles && authorization.roles.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-end">
                  {authorization.roles.map((role) => (
                    <span
                      key={role}
                      className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono uppercase">
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Chưa gán</span>
              )
            }
          />

          <InfoRow
            icon={KeyRound}
            label="Quyền hạn (Permissions)"
            value={
              authorization?.permissions && authorization.permissions.length > 0 ? (
                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground font-mono">
                  {authorization.permissions.length} quyền
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">0 quyền</span>
              )
            }
          />

          {user.status && (
            <InfoRow
              icon={Activity}
              label="Trạng thái"
              value={user.status}
              valueClass="text-emerald-500 uppercase text-xs"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
