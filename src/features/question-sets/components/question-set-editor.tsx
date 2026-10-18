import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QuestionSetDetail,
  QuestionSetItemInput,
  QuestionSource,
} from "../types/question-set.types";
import { normalizePositions, moveItem } from "../utils/normalize-question-positions";
import { getQuestionErrorMessage } from "../utils/question-error-message";
import { useUpdateQuestionSetItemsMutation } from "../hooks/use-update-question-set-items-mutation";
import { useRetryQuestionGenerationMutation } from "../hooks/use-retry-question-generation-mutation";
import { QuestionItemEditor } from "./question-item-editor";
import { QuestionSetStatusBadge } from "./question-set-status-badge";
import { QuestionSourceBadge } from "./question-source-badge";
import { RubricCoverageSummary } from "./rubric-coverage-summary";
import { QuestionSetSourcePanel } from "./question-set-source-panel";
import { GenerationStatusPanel } from "./generation-status-panel";
import { StaleQuestionSetAlert } from "./stale-question-set-alert";
import { ApproveQuestionSetDialog } from "./approve-question-set-dialog";
import { CloneQuestionSetDialog } from "./clone-question-set-dialog";
import { DeleteQuestionSetDialog } from "./delete-question-set-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Save,
  CheckCircle2,
  PlusCircle,
  ArrowLeft,
  Copy,
  Trash2,
  Layers,
  Loader2,
  Lock,
} from "lucide-react";
import { PermissionGate } from "@/features/authorization";
import { Permissions } from "@/features/authorization/permission.constants";

interface QuestionSetEditorProps {
  questionSet: QuestionSetDetail;
  applicationId: string;
  className?: string;
}

export function QuestionSetEditor({
  questionSet,
  applicationId,
  className,
}: QuestionSetEditorProps) {
  const router = useRouter();

  // Local items state initialized from questionSet
  const [items, setItems] = React.useState<
    Array<QuestionSetItemInput & { id?: string; source?: QuestionSource }>
  >(() => {
    return normalizePositions(
      (questionSet.items || []).map((it) => ({
        id: it.id,
        position: it.position,
        text: it.text,
        source: it.source,
        competency: it.competency,
        evaluationCriterionId: it.evaluationCriterionId,
        difficulty: it.difficulty,
        allowFollowUp: it.allowFollowUp,
        maxFollowUps: it.maxFollowUps,
        evidenceRefs: it.evidenceRefs,
        reviewNotes: it.reviewNotes,
      })),
    );
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [showSourceDrawer, setShowSourceDrawer] = React.useState(false);

  // Dialogs
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [cloneOpen, setCloneOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // Mutations
  const updateMutation = useUpdateQuestionSetItemsMutation();
  const retryMutation = useRetryQuestionGenerationMutation();

  const isApproved = questionSet.status === "approved";
  const isGenerating = questionSet.status === "generating";
  const isFailed = questionSet.status === "failed";
  const isReadOnly = isApproved || isGenerating;

  // Check if modified locally
  const isDirty = React.useMemo(() => {
    const original = questionSet.items || [];
    if (items.length !== original.length) return true;
    for (let i = 0; i < items.length; i++) {
      const a = items[i];
      const b = original[i];
      if (!b) return true;
      if (
        a.position !== b.position ||
        a.text !== b.text ||
        a.competency !== b.competency ||
        a.evaluationCriterionId !== b.evaluationCriterionId ||
        a.difficulty !== b.difficulty ||
        a.allowFollowUp !== b.allowFollowUp ||
        a.maxFollowUps !== b.maxFollowUps ||
        a.reviewNotes !== b.reviewNotes
      ) {
        return true;
      }
    }
    return false;
  }, [items, questionSet.items]);

  // Handle item change
  const handleItemChange = (index: number, updated: QuestionSetItemInput) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        ...updated,
      };
      return next;
    });
    setSuccessMessage(null);
  };

  // Move up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => moveItem(prev, index, index - 1));
    setSuccessMessage(null);
  };

  // Move down
  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => moveItem(prev, index, index + 1));
    setSuccessMessage(null);
  };

  // Delete item
  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return normalizePositions(next);
    });
    setSuccessMessage(null);
  };

  // Add new question
  const handleAddQuestion = () => {
    if (items.length >= 12) return;
    const newItem: QuestionSetItemInput & { source: QuestionSource } = {
      position: items.length + 1,
      text: "",
      source: "manual",
      competency: "",
      evaluationCriterionId: null,
      difficulty: "intermediate",
      allowFollowUp: true,
      maxFollowUps: 1,
      evidenceRefs: null,
      reviewNotes: "",
    };
    setItems((prev) => normalizePositions([...prev, newItem]));
    setSuccessMessage(null);
  };

  // Save changes
  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic frontend validation
    for (const it of items) {
      if (!it.text || it.text.trim().length < 5) {
        setErrorMessage(`Câu hỏi #${it.position} cần có nội dung ít nhất 5 ký tự.`);
        return;
      }
      if (it.text.length > 2000) {
        setErrorMessage(`Câu hỏi #${it.position} vượt quá giới hạn 2000 ký tự.`);
        return;
      }
    }

    try {
      const payloadItems = items.map((it) => ({
        position: it.position,
        text: it.text.trim(),
        competency: it.competency?.trim() || null,
        evaluationCriterionId: it.evaluationCriterionId || null,
        difficulty: it.difficulty || "intermediate",
        allowFollowUp: Boolean(it.allowFollowUp),
        maxFollowUps: it.allowFollowUp ? (it.maxFollowUps ?? 1) : 0,
        evidenceRefs: it.evidenceRefs || null,
        reviewNotes: it.reviewNotes?.trim() || null,
      }));

      await updateMutation.mutateAsync({
        id: questionSet.id,
        data: {
          expectedVersion: questionSet.version,
          items: payloadItems,
        },
      });

      setSuccessMessage("Đã lưu danh sách câu hỏi thành công.");
    } catch (err) {
      setErrorMessage(getQuestionErrorMessage(err));
    }
  };

  // Retry AI Generation
  const handleRetryAi = async () => {
    setErrorMessage(null);
    try {
      await retryMutation.mutateAsync({
        id: questionSet.id,
        data: {
          expectedGenerationVersion: questionSet.generationVersion,
        },
      });
    } catch (err) {
      setErrorMessage(getQuestionErrorMessage(err));
    }
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Top Breadcrumb & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href={`/applications/${applicationId}/questions`}
              className="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Danh sách Bộ câu hỏi</span>
            </Link>
            <span>/</span>
            <span className="font-mono text-[11px]">v{questionSet.version}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Bộ câu hỏi Phỏng vấn v{questionSet.version}
            </h1>
            <QuestionSetStatusBadge status={questionSet.status} />
            <QuestionSourceBadge source={questionSet.mode} />
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              {questionSet.language}
            </Badge>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Source Panel Reference */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSourceDrawer((prev) => !prev)}
            className="h-9 text-xs gap-1.5"
          >
            <Layers className="size-3.5 text-primary" />
            <span>{showSourceDrawer ? "Ẩn tham chiếu Job/CV" : "Xem tham chiếu Job/CV"}</span>
          </Button>

          {/* Clone Action */}
          <PermissionGate permission={Permissions.QuestionSetsCreate}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCloneOpen(true)}
              className="h-9 text-xs gap-1.5"
            >
              <Copy className="size-3.5" />
              <span>Clone</span>
            </Button>
          </PermissionGate>

          {/* Delete Action */}
          <PermissionGate permission={Permissions.QuestionSetsManage}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="h-9 text-xs text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              title="Xóa bộ câu hỏi"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </PermissionGate>

          {/* Save Button (when draft) */}
          {!isReadOnly && (
            <PermissionGate permission={Permissions.QuestionSetsUpdate}>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending || !isDirty}
                className="h-9 text-xs gap-1.5"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>{updateMutation.isPending ? "Đang lưu..." : isDirty ? "Lưu thay đổi *" : "Đã lưu"}</span>
              </Button>
            </PermissionGate>
          )}

          {/* Approve Button (when draft and not stale) */}
          {!isApproved && (
            <PermissionGate permission={Permissions.QuestionSetsApprove}>
              <Button
                type="button"
                size="sm"
                onClick={() => setApproveOpen(true)}
                disabled={
                  isGenerating ||
                  isFailed ||
                  questionSet.isStale ||
                  items.length === 0 ||
                  isDirty
                }
                className="h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                title={
                  isDirty
                    ? "Vui lòng lưu thay đổi trước khi phê duyệt"
                    : questionSet.isStale
                      ? "Bộ câu hỏi bị stale không thể duyệt"
                      : "Phê duyệt bộ câu hỏi để khóa bất biến và dùng cho Interview"
                }
              >
                <CheckCircle2 className="size-3.5" />
                <span>Phê duyệt (Approve)</span>
              </Button>
            </PermissionGate>
          )}
        </div>
      </div>

      {/* Stale Alert */}
      {questionSet.isStale && <StaleQuestionSetAlert applicationId={applicationId} />}

      {/* AI Generating / Failed State Panel */}
      {(isGenerating || isFailed) && (
        <GenerationStatusPanel
          status={questionSet.status}
          generationVersion={questionSet.generationVersion}
          onRetry={handleRetryAi}
          isRetrying={retryMutation.isPending}
        />
      )}

      {/* Feedback alerts */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[11px] underline ml-2"
          >
            Đóng
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-[11px] underline ml-2"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Main Grid: Left editor (or read-only items), Right rubric & source panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Questions List (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Approved Read-only banner */}
          {isApproved && (
            <Card className="border-emerald-500/40 bg-emerald-500/[0.04]">
              <CardContent className="p-3.5 flex items-center gap-3">
                <Lock className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Bộ câu hỏi đã được phê duyệt và khóa chỉnh sửa (Read-only)
                  </p>
                  <p className="text-muted-foreground">
                    Bộ câu hỏi này đã sẵn sàng để tạo phiên phỏng vấn. Để thay đổi, hãy nhấn nút{" "}
                    <strong>Clone</strong> để tạo bản nháp mới.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List of Question Items */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <QuestionItemEditor
                key={item.id || `item-${item.position}-${index}`}
                item={item}
                index={index}
                totalItems={items.length}
                criteria={questionSet.jobSnapshot?.evaluationCriteria || []}
                isReadOnly={isReadOnly}
                onChange={(updated) => handleItemChange(index, updated)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onDelete={() => handleDeleteItem(index)}
              />
            ))}
          </div>

          {/* Add Question Button (if draft and under 12) */}
          {!isReadOnly && items.length < 12 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="w-full h-11 border-dashed gap-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50"
            >
              <PlusCircle className="size-4 text-primary" />
              <span>Thêm câu hỏi mới ({items.length}/12)</span>
            </Button>
          )}
        </div>

        {/* Right Column: Rubric Coverage & Snapshot Drawer (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Rubric Coverage Summary */}
          <RubricCoverageSummary
            evaluationCriteria={questionSet.jobSnapshot?.evaluationCriteria || []}
            items={items}
          />

          {/* Collapsible Source Reference Panel */}
          {showSourceDrawer && (
            <QuestionSetSourcePanel
              jobSnapshot={questionSet.jobSnapshot}
              profileSnapshot={questionSet.profileSnapshot}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ApproveQuestionSetDialog
        questionSet={questionSet}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={() => {
          setSuccessMessage("Bộ câu hỏi đã được phê duyệt thành công.");
        }}
      />

      <CloneQuestionSetDialog
        questionSetId={questionSet.id}
        applicationId={applicationId}
        open={cloneOpen}
        onOpenChange={setCloneOpen}
      />

      <DeleteQuestionSetDialog
        questionSetId={questionSet.id}
        applicationId={applicationId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => {
          router.push(`/applications/${applicationId}/questions`);
        }}
      />
    </div>
  );
}
