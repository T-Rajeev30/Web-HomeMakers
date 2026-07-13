const WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN;

let initPromise = null;

/**
 * Initialize the MSG91 widget. Resolves only when the SDK confirms init via
 * its `success` callback (or times out), and rejects on `failure`. The old
 * version resolved on a blind 300ms timer regardless of outcome, so a failed
 * init still let sendOtp run — producing no reqId and the downstream
 * "reqId is required" verify error.
 */
export function initializeMsg91() {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    if (typeof window.initSendOTP !== "function") {
      initPromise = null; // allow retry once SDK loads
      reject(new Error("MSG91 SDK is not loaded."));
      return;
    }

    if (!WIDGET_ID || !TOKEN_AUTH) {
      initPromise = null;
      reject(
        new Error("MSG91 widget config missing (check VITE_MSG91_* env)."),
      );
      return;
    }

    let settled = false;

    window.initSendOTP({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      exposeMethods: true,
      success: (data) => {
        if (settled) return;
        settled = true;
        console.log("MSG91 Init Success:", data);
        resolve(data);
      },
      failure: (error) => {
        if (settled) return;
        settled = true;
        initPromise = null; // let the user retry
        console.error("MSG91 Init Failure:", error);
        reject(new Error(error?.message || "MSG91 initialization failed."));
      },
    });

    // Fallback: exposeMethods exposes window.sendOtp synchronously; if the
    // success callback never fires but the method exists, resolve so we don't
    // hang forever. If it doesn't exist, reject.
    setTimeout(() => {
      if (settled) return;
      settled = true;
      if (typeof window.sendOtp === "function") {
        resolve({ note: "resolved via method-availability fallback" });
      } else {
        initPromise = null;
        reject(new Error("MSG91 init timed out; sendOtp not available."));
      }
    }, 2000);
  });

  return initPromise;
}

export async function sendOtp(phone) {
  await initializeMsg91();

  const identifier = `91${phone.replace(/^\+?91/, "").replace(/\D/g, "")}`;

  return new Promise((resolve, reject) => {
    if (typeof window.sendOtp !== "function") {
      reject(new Error("MSG91 sendOtp() not found."));
      return;
    }

    window.sendOtp(
      identifier,
      (data) => {
        console.log("OTP Sent", data);
        resolve(data);
      },
      (error) => {
        console.error("sendOtp failed", error);
        reject(new Error(error?.message || "Failed to send OTP."));
      },
    );
  });
}

export function verifyOtp(otp) {
  return new Promise((resolve, reject) => {
    if (typeof window.verifyOtp !== "function") {
      reject(new Error("MSG91 verifyOtp() not found."));
      return;
    }

    window.verifyOtp(
      Number(otp), // MSG91 widget expects a numeric OTP, not a string
      (data) => {
        console.log("OTP Verified", data);
        resolve(data);
      },
      (error) => {
        console.error("verifyOtp failed", error);
        reject(new Error(error?.message || "Incorrect OTP."));
      },
    );
  });
}

export function resendOtp(channel = null) {
  return new Promise((resolve, reject) => {
    if (typeof window.retryOtp !== "function") {
      reject(new Error("MSG91 retryOtp() not found."));
      return;
    }

    window.retryOtp(
      channel,
      (data) => {
        console.log("OTP Resent", data);
        resolve(data);
      },
      (error) => {
        console.error("retryOtp failed", error);
        reject(new Error(error?.message || "Failed to resend OTP."));
      },
    );
  });
}
