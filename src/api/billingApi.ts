import apiClient, { normalizeError } from "./client";

export interface CheckoutSessionResponse {
  checkoutUrl: string;
}

export const billingApi = {
  async createCheckoutSession(): Promise<CheckoutSessionResponse> {
    try {
      const { data } =
        await apiClient.post<CheckoutSessionResponse>("/billing/checkout");
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async createPortalSession(): Promise<CheckoutSessionResponse> {
    try {
      const { data } =
        await apiClient.post<CheckoutSessionResponse>("/billing/portal");
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
