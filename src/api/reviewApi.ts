import apiClient, { normalizeError } from "./client";

export type Severity = "bug" | "security" | "style";

export interface ReviewIssue {
  id: string;
  severity: Severity;
  lineStart: number;
  lineEnd: number;
  title: string;
  explanation: string;
  suggestion?: string;
  beforeCode?: string;
  afterCode?: string;
}

export interface ReviewResult {
  id: string;
  createdAt: string;
  language: string;
  fileName?: string;
  summary: string;
  score: number;
  code: string;
  issues: ReviewIssue[];
}

export interface ReviewListItem {
  id: string;
  createdAt: string;
  language: string;
  fileName?: string;
  issueCount: number;
  score: number;
  summary: string;
}

export interface SubmitReviewPayload {
  language: string;
  code: string;
  fileName?: string;
}

export interface DashboardStats {
  reviewsThisMonth: number;
  issuesFound: number;
  securityIssues: number;
  avgScore: number;
}

export const reviewApi = {
  async submit(payload: SubmitReviewPayload): Promise<ReviewResult> {
    try {
      const { data } = await apiClient.post<ReviewResult>("/reviews", payload);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async list(params?: {
    language?: string;
    search?: string;
  }): Promise<ReviewListItem[]> {
    try {
      const { data } = await apiClient.get<ReviewListItem[]>("/reviews", {
        params,
      });
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async getById(id: string): Promise<ReviewResult> {
    try {
      const { data } = await apiClient.get<ReviewResult>(`/reviews/${id}`);
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async getStats(): Promise<DashboardStats> {
    try {
      const { data } = await apiClient.get<DashboardStats>("/reviews/stats");
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
