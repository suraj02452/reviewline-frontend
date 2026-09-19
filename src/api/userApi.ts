import apiClient, { normalizeError } from "./client";

export interface ReviewUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  googleConnected: boolean;
  createdAt: string;
  planStatus: "free" | "pro" | "past_due" | "canceled";
  reviewsThisMonth: number;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  async me(): Promise<ReviewUser> {
    try {
      const { data } = await apiClient.get<ReviewUser>("/user/me");
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    try {
      await apiClient.put("/user/password", payload);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async deleteAccount(): Promise<void> {
    try {
      await apiClient.delete("/user");
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
