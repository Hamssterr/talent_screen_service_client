import { Metadata } from "next";
import { Sparkles, UserCheck, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Phỏng vấn trực tuyến | TalentScreen",
  description: "Cổng phỏng vấn trực tuyến dành cho ứng viên",
};

interface CandidateInterviewPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function CandidateInterviewPage({
  params,
}: CandidateInterviewPageProps) {
  const { token } = await params;

  return (
    <Card className="border-border shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-4 pt-8">
        <div className="mx-auto size-14 rounded-2xl bg-peach-light text-peach-foreground border border-peach/30 flex items-center justify-center mb-3">
          <UserCheck className="size-7" />
        </div>
        <CardTitle className="text-xl font-bold">
          Cổng phỏng vấn ứng viên trực tuyến
        </CardTitle>
        <CardDescription className="text-xs max-w-md mx-auto mt-1">
          Khu vực phỏng vấn công khai dành cho ứng viên tham gia đánh giá năng lực qua mã mời (Invitation Token).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" />
              Mã bảo mật lời mời:
            </span>
            <Badge variant="peach" className="font-mono text-[10px]">
              {token.length > 16 ? `${token.substring(0, 16)}...` : token}
            </Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Khu vực này độc lập hoàn toàn với tài khoản nhân viên nội bộ (không yêu cầu đăng nhập, không dùng JWT nhân sự).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-ai-light border border-ai/20 text-ai-foreground text-xs flex items-start gap-2.5">
          <Sparkles className="size-4 shrink-0 text-ai mt-0.5" />
          <div>
            <span className="font-semibold">Candidate Runtime Boundary (Todo 02 / Todo 09):</span>
            <p className="text-muted-foreground mt-0.5">
              Toàn bộ luồng trả lời phỏng vấn theo từng câu hỏi, ghi âm/video và phản hồi tự động bằng AI sẽ được khởi chạy tại Todo 09.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
