import { useCallback } from "react";
import { payment } from "../api/services";

const SDK = "https://checkout.razorpay.com/v1/checkout.js";

function loadSdk() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SDK;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function useRazorpay() {
  return useCallback(
    async ({
      addressId,
      couponCode,
      customerName,
      notes,
      orderType = "quick",
      scheduledFor,
      contact,
    }) => {
      if (!(await loadSdk())) throw new Error("Razorpay SDK failed to load");

      const { orderId, razorpayOrderId, amount, keyId } =
        await payment.createOrder({
          addressId,
          couponCode,
          customerName,
          notes,
          orderType,
          scheduledFor,
        });

      return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          order_id: razorpayOrderId,
          amount: Math.round(amount * 100),
          currency: "INR",
          name: "Zingro",
          description: "Home-cooked food order",
          theme: { color: "#E63C78" },
          prefill: { contact, name: customerName },
          handler: async (r) => {
            try {
              const res = await payment.verify({
                razorpayOrderId: r.razorpay_order_id,
                razorpayPaymentId: r.razorpay_payment_id,
                razorpaySignature: r.razorpay_signature,
                couponCode,
              });
              resolve({ ...res, zingroOrderId: orderId });
            } catch (e) {
              reject(e);
            }
          },
          modal: { ondismiss: () => reject(new Error("PAYMENT_CANCELLED")) },
        });
        rzp.on("payment.failed", (e) =>
          reject(new Error(e?.error?.description || "Payment failed")),
        );
        rzp.open();
      });
    },
    [],
  );
}
