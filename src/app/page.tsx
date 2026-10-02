"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useCurrentUserQuery,
  useAuthorizationQuery,
  useLogoutMutation,
} from "@/features/auth/hooks/use-auth";
import { UserProfileCard } from "@/components/UserProfileCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
    refetch: refetchUser,
  } = useCurrentUserQuery();

  const { data: authorization, refetch: refetchAuth } = useAuthorizationQuery({
    enabled: !!user,
  });

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleRefreshMe = () => {
    refetchUser();
    refetchAuth();
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto my-auto items-center min-h-screen justify-center flex flex-col gap-6 p-6">
      {!user || isUserError ? (
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <h1 className="text-3xl font-bold">TalentScreen Platform</h1>
          <p className="text-muted-foreground text-sm">
            Hệ thống phỏng vấn và đánh giá ứng viên thông minh. Vui lòng đăng
            nhập để tiếp tục.
          </p>
          <Button onClick={() => router.push("/auth/login")}>
            Đến trang đăng nhập
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <UserProfileCard user={user} authorization={authorization} />
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRefreshMe}>
              Làm mới hồ sơ (/auth/me)
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={isLoggingOut}
              onClick={() => logout()}>
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
