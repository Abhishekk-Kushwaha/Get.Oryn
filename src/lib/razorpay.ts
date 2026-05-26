export const loadRazorpayScript = (): Promise<boolean> => {
  return Promise.resolve(true);
};

export const handleRazorpayCheckout = async (
  userId: string, 
  amount: number, 
  planName: string,
  onSuccess?: () => void
) => {
  try {
    // Instantly simulate a successful transaction for the demo/trial version
    alert(`[Demo Mode] Simulated payment of ₹${amount} for ${planName} successful!`);
    if (onSuccess) {
      onSuccess();
    }
  } catch (err: any) {
    console.error("Checkout error:", err);
    alert(err.message);
  }
};

