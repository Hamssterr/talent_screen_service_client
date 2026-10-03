/**
 * Semantic presentation tones mapped to Editorial Slate & Peach color tokens.
 */
export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "ai"
  | "peach";

/**
 * Normalized status presentation metadata for UI badges, tables, and details.
 */
export interface StatusPresentation {
  label: string;
  tone: StatusTone;
  description?: string;
  iconName?: string;
}
