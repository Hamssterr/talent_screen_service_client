"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  User,
  Plus,
  Trash2,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  FileText,
  Briefcase,
  Layers,
  Palette,
  Layout,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { AsyncButton } from "@/components/shared/async-button";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { OffsetPagination } from "@/components/shared/offset-pagination";
import { FilterBar } from "@/components/shared/filter-bar";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { DetailField } from "@/components/shared/detail-field";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  ConflictAlert,
} from "@/components/feedback";
import {
  JobStatus,
  ApplicationStatus,
  InterviewStatus,
  NotificationStatus,
  AiRunStatus,
  CvExtractionStatus,
} from "@/lib/status";

export function ShowcaseView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  const simulateAsyncAction = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Hành động bất đồng bộ hoàn tất thành công!");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        {/* Top bar */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-semibold shadow-sm">
                TS
              </div>
              <div>
                <h1 className="font-semibold text-sm leading-none text-foreground flex items-center gap-2">
                  TalentScreen Design System
                  <Badge variant="ai" className="text-[10px] py-0 px-1.5 h-4">
                    Dev Only
                  </Badge>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Editorial Slate & Peach Foundation Showcase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">Chế độ giao diện:</span>
              <ThemeToggle variant="segmented" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Header */}
          <PageHeader
            title="Design System & UI Components"
            description="Bản quy chuẩn token màu sắc, typography, UI primitives, và presentation registry cho hệ thống tuyển dụng AI TalentScreen."
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Đã làm mới token cache!")}>
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Làm mới
                </Button>
                <Button size="sm" onClick={() => toast.success("Đã xác nhận design system foundation!")}>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Xác nhận
                </Button>
              </div>
            }
          />

          {/* Tab navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 h-auto p-1 bg-muted/60 rounded-xl">
              <TabsTrigger value="overview" className="text-xs py-2">
                <Palette className="w-3.5 h-3.5 mr-1.5" />
                Màu sắc & Token
              </TabsTrigger>
              <TabsTrigger value="buttons" className="text-xs py-2">
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Nút & Hành động
              </TabsTrigger>
              <TabsTrigger value="forms" className="text-xs py-2">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Form Controls
              </TabsTrigger>
              <TabsTrigger value="badges" className="text-xs py-2">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                Status Registry
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-xs py-2">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Feedback States
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs py-2">
                <Layout className="w-3.5 h-3.5 mr-1.5" />
                Layout & Shell
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW & COLOR TOKENS */}
            <TabsContent value="overview" className="space-y-8">
              {/* Palette swatches */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Editorial Slate */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Editorial Slate</span>
                      <span className="text-xs font-mono text-muted-foreground">Shell & Layout</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Bảng nền cấu trúc, sidebar và bề mặt tài liệu chính.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-12 rounded-lg bg-background border border-border flex items-center justify-between px-3 text-xs">
                      <span className="font-medium text-foreground">Background</span>
                      <span className="text-muted-foreground font-mono">var(--background)</span>
                    </div>
                    <div className="h-10 rounded-lg bg-card border border-border flex items-center justify-between px-3 text-xs">
                      <span className="font-medium text-card-foreground">Card & Sheet</span>
                      <span className="text-muted-foreground font-mono">var(--card)</span>
                    </div>
                    <div className="h-10 rounded-lg bg-sidebar text-sidebar-foreground flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">Sidebar Slate</span>
                      <span className="text-sidebar-foreground/70 font-mono">#3F545E / #1A242B</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted flex items-center justify-between px-3 text-xs">
                      <span className="font-medium text-muted-foreground">Muted / Border</span>
                      <span className="text-muted-foreground font-mono">var(--muted)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Teal */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Primary Teal</span>
                      <span className="text-xs font-mono text-primary">Primary Action</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Màu hành động chính, nút kêu gọi, điểm nhấn tương tác.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-between px-3 text-xs font-semibold shadow-sm">
                      <span>Primary Teal</span>
                      <span className="font-mono text-primary-foreground/80">#287590 / #64A9B8</span>
                    </div>
                    <div className="h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">Primary Light / Hover</span>
                      <span className="font-mono">#3B8CA3 / #7CBCC9</span>
                    </div>
                    <div className="h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">Primary Subtle Surface</span>
                      <span className="font-mono">primary/10</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Peach Human Context */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Peach</span>
                      <span className="text-xs font-mono text-peach">Human Context</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Đại diện ứng viên, dữ liệu con người, ghi chú tuyển dụng.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-12 rounded-lg bg-peach text-peach-foreground flex items-center justify-between px-3 text-xs font-semibold shadow-sm">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Peach Solid
                      </span>
                      <span className="font-mono text-peach-foreground/80">#F1CBB7 / #D9A78E</span>
                    </div>
                    <div className="h-10 rounded-lg bg-peach-light text-peach-foreground flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">Peach Light</span>
                      <span className="font-mono">#FAECE3 / #382A22</span>
                    </div>
                    <div className="h-10 rounded-lg bg-peach-light border border-peach/30 text-peach-foreground flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">Candidate Tag / Card</span>
                      <span className="font-mono">peach-light border</span>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Steel */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>AI Steel</span>
                      <span className="text-xs font-mono text-ai">AI Context</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Đại diện cho gợi ý AI, phân tích phỏng vấn, tóm tắt CV tự động.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-12 rounded-lg bg-ai text-ai-foreground flex items-center justify-between px-3 text-xs font-semibold shadow-sm">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Steel Solid
                      </span>
                      <span className="font-mono text-ai-foreground/80">#5E7F87 / #8AA7AE</span>
                    </div>
                    <div className="h-10 rounded-lg bg-ai-light text-ai-foreground flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">AI Light Surface</span>
                      <span className="font-mono">#EFF5F5 / #1C2729</span>
                    </div>
                    <div className="h-10 rounded-lg bg-ai-light border border-ai/30 text-ai-foreground flex items-center justify-between px-3 text-xs">
                      <span className="font-medium">AI Recommendation</span>
                      <span className="font-mono">ai-light border</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Semantic States */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Semantic State Tokens</CardTitle>
                  <CardDescription className="text-xs">
                    Màu thông báo và trạng thái hệ thống: Success, Warning, Danger (Destructive), Info.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-success-light border border-success/30 text-success-foreground space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-sm text-success">
                        <CheckCircle2 className="w-4 h-4" />
                        Success
                      </div>
                      <p className="text-xs text-muted-foreground">#2E7D5B / #4EAA82</p>
                    </div>

                    <div className="p-4 rounded-xl bg-warning-light border border-warning/30 text-warning-foreground space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-sm text-warning">
                        <AlertTriangle className="w-4 h-4" />
                        Warning
                      </div>
                      <p className="text-xs text-muted-foreground">#B87A28 / #D49B4B</p>
                    </div>

                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <XCircle className="w-4 h-4" />
                        Destructive / Danger
                      </div>
                      <p className="text-xs text-muted-foreground">#C04B3E / #E06C5F</p>
                    </div>

                    <div className="p-4 rounded-xl bg-info-light border border-info/30 text-info-foreground space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-sm text-info">
                        <Info className="w-4 h-4" />
                        Info
                      </div>
                      <p className="text-xs text-muted-foreground">#287590 / #64A9B8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sonner Toast Demo */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Sonner Toast Notifications</CardTitle>
                  <CardDescription className="text-xs">
                    Kiểm tra thông báo toast với icon màu semantic đồng bộ theme tự động.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-success/40 hover:bg-success-light text-success"
                      onClick={() => toast.success("Kích hoạt tài khoản hoặc lưu dữ liệu thành công!")}>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Toast Success
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-warning/40 hover:bg-warning-light text-warning"
                      onClick={() => toast.warning("Cảnh báo: Ứng viên này đã có hồ sơ trùng lặp!")}>
                      <AlertTriangle className="w-4 h-4 mr-1.5" />
                      Toast Warning
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/40 hover:bg-destructive/10 text-destructive"
                      onClick={() => toast.error("Lỗi: Mã kích hoạt không hợp lệ hoặc đã hết hạn.")}>
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Toast Error
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-info/40 hover:bg-info-light text-info"
                      onClick={() => toast.info("Hệ thống AI đang phân tích hồ sơ ứng viên...")}>
                      <Info className="w-4 h-4 mr-1.5" />
                      Toast Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: BUTTONS & ACTIONS */}
            <TabsContent value="buttons" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Button Variants</CardTitle>
                  <CardDescription className="text-xs">
                    Đầy đủ các biến thể nút bấm chuẩn hóa cho TalentScreen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default">Primary Teal</Button>
                    <Button variant="secondary">Secondary Slate</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="destructive-outline">Destructive Outline</Button>
                    <Button variant="peach">
                      <User className="w-4 h-4 mr-1.5" />
                      Peach Action
                    </Button>
                    <Button variant="ai">
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      AI Action
                    </Button>
                    <Button variant="link">Link Style</Button>
                  </div>

                  <div className="pt-4 border-t border-border flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">Kích thước:</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm">Small (h-7)</Button>
                        <Button size="default">Default (h-9)</Button>
                        <Button size="lg">Large (h-11)</Button>
                        <Button size="icon" aria-label="Icon only">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">AsyncButton có Spinner:</div>
                      <div className="flex items-center gap-2">
                        <AsyncButton
                          onClick={simulateAsyncAction}
                          loadingText="Đang thực thi...">
                          Thử Async Action
                        </AsyncButton>
                        <AsyncButton
                          variant="destructive"
                          onClick={simulateAsyncAction}
                          loadingText="Đang xóa...">
                          Async Destructive
                        </AsyncButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Confirm Dialog Demo */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">ConfirmActionDialog</CardTitle>
                  <CardDescription className="text-xs">
                    Hộp thoại xác nhận hành động nguy hiểm hoặc quan trọng.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Mở hộp thoại xóa vị trí tuyển dụng
                  </Button>

                  <ConfirmActionDialog
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    title="Xóa vị trí tuyển dụng Senior Frontend Engineer?"
                    description="Hành động này không thể hoàn tác. Mọi hồ sơ ứng tuyển và buổi phỏng vấn liên quan sẽ bị chuyển sang trạng thái đã đóng."
                    confirmLabel="Xác nhận xóa"
                    variant="destructive"
                    onConfirm={async () => {
                      await simulateAsyncAction();
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: FORM CONTROLS */}
            <TabsContent value="forms" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Form Input Controls</CardTitle>
                  <CardDescription className="text-xs">
                    Input, Textarea, Select, Checkbox, Tooltip, Dialog, Sheet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-foreground">
                        Họ và tên ứng viên
                      </label>
                      <Input placeholder="Ví dụ: Nguyễn Văn A" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-foreground">
                        Vị trí ứng tuyển
                      </label>
                      <Select defaultValue="fe">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn vị trí" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fe">Senior Frontend Engineer (Next.js)</SelectItem>
                          <SelectItem value="be">Backend Engineer (NestJS / PostgreSQL)</SelectItem>
                          <SelectItem value="ai">AI / ML Research Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-foreground">
                        Tóm tắt ghi chú phỏng vấn
                      </label>
                      <Textarea placeholder="Nhập nhận xét về ứng viên..." rows={3} />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={checkboxChecked}
                        onCheckedChange={(c) => setCheckboxChecked(!!c)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-xs text-foreground font-medium leading-none cursor-pointer">
                        Đồng ý gửi thông báo qua email cho ứng viên
                      </label>
                    </div>

                    <div className="flex items-center gap-4">
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button variant="outline" size="sm">
                              <Info className="w-4 h-4 mr-1.5" />
                              Hover để xem Tooltip
                            </Button>
                          }
                        />
                        <TooltipContent>
                          <p className="text-xs">Đây là tooltip chuẩn hóa sử dụng Base UI Tooltip.</p>
                        </TooltipContent>
                      </Tooltip>

                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button variant="secondary" size="sm">
                              Mở Base UI Dialog
                            </Button>
                          }
                        />
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Thêm câu hỏi phỏng vấn mới</DialogTitle>
                            <DialogDescription>
                              Nhập câu hỏi và tiêu chí đánh giá cho bộ câu hỏi.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3 py-2">
                            <Input placeholder="Tiêu đề câu hỏi..." />
                            <Textarea placeholder="Tiêu chí chấm điểm..." rows={2} />
                          </div>
                          <DialogFooter>
                            <Button variant="default" onClick={() => toast.success("Đã thêm câu hỏi!")}>
                              Lưu câu hỏi
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Sheet>
                        <SheetTrigger
                          render={
                            <Button variant="outline" size="sm">
                              Mở Drawer / Sheet
                            </Button>
                          }
                        />
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Chi tiết ứng viên</SheetTitle>
                            <SheetDescription>
                              Thông tin tóm tắt và đánh giá AI từ hệ thống.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="py-4 space-y-4">
                            <DetailField label="Họ tên" value="Trần Thị B" />
                            <DetailField label="Email" value="b.tran@example.com" />
                            <DetailField
                              label="Trạng thái"
                              value={<StatusBadge domain="application" status="interviewing" />}
                            />
                            <DetailField
                              label="Đánh giá AI"
                              value="Ứng viên đáp ứng 92% tiêu chí kỹ năng Next.js App Router và NestJS API."
                            />
                          </div>
                        </SheetContent>
                      </Sheet>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Tùy chọn thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast.info("Xem lịch sử")}>
                            Xem lịch sử phỏng vấn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Xuất PDF")}>
                            Xuất báo cáo PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => toast.error("Đã hủy lời mời")}>
                            Hủy lời mời
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: STATUS REGISTRY & PRESENTATION */}
            <TabsContent value="badges" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Typed Status Presentation Registry</CardTitle>
                  <CardDescription className="text-xs">
                    Toàn bộ status badge được ánh xạ trực tiếp từ backend NestJS enums với màu sắc và tiếng Việt chuẩn hóa.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Statuses */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      1. Vị trí tuyển dụng (JobStatus)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["draft", "open", "closed"] as JobStatus[]).map((status) => (
                        <StatusBadge key={status} domain="job" status={status} />
                      ))}
                    </div>
                  </div>

                  {/* Application Statuses */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      2. Hồ sơ ứng tuyển (ApplicationStatus)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          "shortlisted",
                          "interviewing",
                          "under_review",
                          "approved",
                          "rejected",
                          "withdrawn",
                        ] as ApplicationStatus[]
                      ).map((status) => (
                        <StatusBadge key={status} domain="application" status={status} />
                      ))}
                    </div>
                  </div>

                  {/* Interview Statuses */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      3. Buổi phỏng vấn (InterviewStatus)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          "invited",
                          "in_progress",
                          "completed",
                          "expired",
                          "cancelled",
                        ] as InterviewStatus[]
                      ).map((status) => (
                        <StatusBadge key={status} domain="interview" status={status} />
                      ))}
                    </div>
                  </div>

                  {/* Notification Statuses */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      4. Thông báo / Email (NotificationStatus)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          "pending",
                          "sending",
                          "accepted",
                          "delivered",
                          "failed",
                          "unknown",
                          "suppressed",
                        ] as NotificationStatus[]
                      ).map((status) => (
                        <StatusBadge key={status} domain="notification" status={status} />
                      ))}
                    </div>
                  </div>

                  {/* AI Run & CV Extraction Statuses */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      5. AI Run & CV Trích xuất (AiRunStatus & CvExtractionStatus)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(
                        ["processing", "succeeded", "failed", "superseded"] as AiRunStatus[]
                      ).map((status) => (
                        <StatusBadge key={status} domain="ai" status={status} />
                      ))}
                      {(
                        [
                          "pending",
                          "processing",
                          "ready",
                          "failed",
                          "needs_manual_input",
                        ] as CvExtractionStatus[]
                      ).map((status) => (
                        <StatusBadge key={status} domain="cv" status={status} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: FEEDBACK STATES */}
            <TabsContent value="feedback" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Empty State */}
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">EmptyState Component</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      title="Chưa có ứng viên nào"
                      description="Hiện chưa có ứng viên nộp hồ sơ cho vị trí này. Hãy tạo chiến dịch tuyển dụng hoặc chia sẻ liên kết."
                      primaryAction={
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-1.5" />
                          Thêm ứng viên thủ công
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>

                {/* Error State */}
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ErrorState Component</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ErrorState
                      title="Không thể tải danh sách vị trí"
                      message="Đã có sự cố kết nối tới máy chủ API. Vui lòng kiểm tra lại đường truyền."
                      onRetry={() => toast.info("Đang thử lại kết nối...")}
                    />
                  </CardContent>
                </Card>

                {/* Loading State */}
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">LoadingState Component</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingState title="Đang tải dữ liệu hồ sơ và phân tích AI..." />
                  </CardContent>
                </Card>

                {/* Conflict Alert */}
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ConflictAlert Component</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ConflictAlert
                      title="Dữ liệu đã được cập nhật bởi quản trị viên khác"
                      message="Phiên bản câu hỏi phỏng vấn trên máy bạn không còn là mới nhất. Vui lòng tải lại trang để tránh ghi đè dữ liệu."
                      onReload={() => toast.success("Đang tải lại dữ liệu mới nhất...")}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 6: DATA TABLE, PAGINATION & SHELL */}
            <TabsContent value="layout" className="space-y-6">
              {/* Filter bar & Data table shell */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">DataTableShell & FilterBar Foundation</CardTitle>
                  <CardDescription className="text-xs">
                    Khung bảng dữ liệu phân trang và bộ lọc chuẩn hóa cho toàn bộ ứng dụng.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FilterBar
                    searchSlot={
                      <Input
                        placeholder="Tìm kiếm ứng viên theo tên, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64"
                      />
                    }
                    filtersSlot={
                      <Select
                        value={filterRole}
                        onValueChange={(val) => {
                          if (val) setFilterRole(val);
                        }}>
                        <SelectTrigger className="w-[150px] h-9">
                          <SelectValue placeholder="Vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả vai trò</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="INTERVIEWER">Interviewer</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                    actionsSlot={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterRole("all");
                        }}>
                        Đặt lại
                      </Button>
                    }
                  />

                  <DataTableShell
                    pagination={
                      <OffsetPagination
                        page={currentPage}
                        limit={10}
                        totalItems={35}
                        totalPages={4}
                        onPageChange={setCurrentPage}
                      />
                    }>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ứng viên / Email</TableHead>
                          <TableHead>Vị trí</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Đánh giá AI</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">Nguyễn Hoàng Long</div>
                              <div className="text-xs text-muted-foreground">long.nguyen@example.com</div>
                            </div>
                          </TableCell>
                          <TableCell>Senior Frontend Engineer</TableCell>
                          <TableCell>
                            <StatusBadge domain="application" status="shortlisted" />
                          </TableCell>
                          <TableCell>
                            <Badge variant="ai" className="gap-1">
                              <Sparkles className="w-3 h-3" />
                              95% Match
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">Phạm Minh Trang</div>
                              <div className="text-xs text-muted-foreground">trang.pham@example.com</div>
                            </div>
                          </TableCell>
                          <TableCell>Backend Architect</TableCell>
                          <TableCell>
                            <StatusBadge domain="application" status="approved" />
                          </TableCell>
                          <TableCell>
                            <Badge variant="ai" className="gap-1">
                              <Sparkles className="w-3 h-3" />
                              98% Match
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </DataTableShell>
                </CardContent>
              </Card>

              {/* Sidebar Slate Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-sidebar text-sidebar-foreground border border-sidebar-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Solid Slate Sidebar Preview</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Dark Editorial Slate
                    </Badge>
                  </div>
                  <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
                    Sidebar sử dụng màu Editorial Slate đồng bộ và tương phản cao với nội dung chính.
                  </p>
                  <div className="flex flex-col gap-1.5 pt-2">
                    <div className="px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium flex items-center justify-between">
                      <span>Tổng quan tuyển dụng</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 text-xs transition-colors">
                      Vị trí tuyển dụng (Jobs)
                    </div>
                    <div className="px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 text-xs transition-colors">
                      Hồ sơ ứng viên (Candidates)
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl sidebar-glass text-sidebar-foreground border border-sidebar-border/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">.sidebar-glass Effect Preview</span>
                    <Badge variant="ai" className="text-[10px]">
                      Mac Glass Tint
                    </Badge>
                  </div>
                  <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
                    Hiệu ứng kính mờ tinh tế với nền bán trong suốt và viền mờ cao cấp.
                  </p>
                  <div className="flex flex-col gap-1.5 pt-2">
                    <div className="px-3 py-2 rounded-lg bg-sidebar-accent/80 text-sidebar-accent-foreground text-xs font-medium flex items-center justify-between">
                      <span>Buổi phỏng vấn trực tuyến</span>
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/40 text-xs transition-colors">
                      Đánh giá & Nhận xét
                    </div>
                    <div className="px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/40 text-xs transition-colors">
                      Cài đặt hệ thống
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
}
