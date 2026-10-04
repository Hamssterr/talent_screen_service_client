import {
  CreateJobInput,
  Job,
  JobFormValues,
  UpdateJobInput,
} from "../types/job.types";

/**
 * Transforms a Job entity from backend into form-compatible initial values.
 * Preserves criterion ID to maintain relationship with future interview question sets.
 */
export function jobToFormValues(job: Job): JobFormValues {
  return {
    title: job.title || "",
    description: job.description || "",
    requiredSkills: [...(job.requiredSkills || [])],
    evaluationCriteria: (job.evaluationCriteria || []).map((crit) => ({
      id: crit.id,
      name: crit.name,
      description: crit.description,
    })),
    status: job.status === "closed" ? "draft" : (job.status as "draft" | "open"),
  };
}

/**
 * Maps form values to CreateJobInput.
 * Strips client-only metadata like _clientId and trims inputs.
 */
export function formValuesToCreateInput(
  values: JobFormValues,
): CreateJobInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    requiredSkills: (values.requiredSkills || [])
      .map((s) => s.trim())
      .filter(Boolean),
    evaluationCriteria: (values.evaluationCriteria || [])
      .map((c) => ({
        id: c.id?.trim() || undefined,
        name: c.name.trim(),
        description: c.description.trim(),
      }))
      .filter((c) => c.name.length > 0 && c.description.length > 0),
    status: values.status,
  };
}

/**
 * Maps form values to UpdateJobInput with optimistic concurrency expectedVersion.
 */
export function formValuesToUpdateInput(
  values: JobFormValues,
  expectedVersion: number,
): UpdateJobInput {
  return {
    expectedVersion,
    title: values.title.trim(),
    description: values.description.trim(),
    requiredSkills: (values.requiredSkills || [])
      .map((s) => s.trim())
      .filter(Boolean),
    evaluationCriteria: (values.evaluationCriteria || [])
      .map((c) => ({
        id: c.id?.trim() || undefined,
        name: c.name.trim(),
        description: c.description.trim(),
      }))
      .filter((c) => c.name.length > 0 && c.description.length > 0),
    status: values.status,
  };
}
