import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Loader2, Zap } from "lucide-react";
import { useCreateCourseOrderMutation } from "@/features/api/purchaseApi";
import { toast } from "sonner";
import { RAZORPAY_KEY_ID } from "@/config";

const BuyCourseButton = ({ courseId, onPaymentSuccess }) => {
  const [createCourseOrder, { isLoading }] =
    useCreateCourseOrderMutation();

  const [clicked, setClicked] = useState(false);

  const openRazorpay = (order) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Proxima",
      description: "Course Purchase",
      order_id: order.id,

      handler: function () {
  toast.success("Payment successful 🎉");

  // 🔄 refetch course after webhook
  setTimeout(() => {
    setClicked(false);
    onPaymentSuccess?.();   // course refetch
  }, 2000);
},


      modal: {
        ondismiss: () => {
          setClicked(false); // user ne popup band kiya
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleBuy = async () => {
    if (clicked) return;
    setClicked(true);

    try {
      const res = await createCourseOrder(courseId).unwrap();
      openRazorpay(res.order);
    } catch (err) {
  setClicked(false);

  const message =
    err?.data?.message || "Something went wrong. Please try again.";

  toast.error(message);
}
  };

  return (
    <Button
  disabled={isLoading || clicked}
  className={`
    w-full h-12 relative overflow-hidden transition-all duration-300
    bg-gradient-to-r from-blue-600 to-indigo-700 
    hover:from-blue-700 hover:to-indigo-800
    text-white font-black uppercase tracking-widest text-xs
    rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]
    hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.6)]
    hover:-translate-y-0.5 active:scale-[0.98]
    disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed
  `}
  onClick={handleBuy}
>
  {isLoading || clicked ? (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-white" />
      <span className="animate-pulse">Processing...</span>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-2">
      <Zap size={16} className="fill-current text-yellow-400" />
      <span>Purchase Course</span>
      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  )}

  {/* Subtle Shiny Overlay Effect */}
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
</Button>
  );
};

export default BuyCourseButton;
