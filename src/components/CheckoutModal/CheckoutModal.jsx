// src/components/CheckoutModal/CheckoutModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddressSection } from "../../pages/Checkout/components/AddressSection/AddressSection";
import { OrderSummary } from "../../pages/Checkout/components/OrderSummary/OrderSummary";
import { useUserData } from "../../contexts/UserDataProvider.js";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthProvider.js";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import "./CheckoutModal.css";

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { userDataState, dispatch, clearCartHandler } = useUserData();
  const { auth, setCurrentPage } = useAuth();
  const navigate = useNavigate();

  const {
    cartProducts,
    addressList,
    orderDetails: { cartItemsDiscountTotal, orderAddress },
  } = userDataState;

  const KEY_ID = "rzp_test_VAxHG0Dkcr9qc6"; // Razorpay test key (replace with live key later)

  const totalAmount = cartItemsDiscountTotal;

  const userContact = addressList?.find(
    ({ _id }) => _id === orderAddress?._id
  )?.phone;

  const successHandler = (response) => {
    const paymentId = response.razorpay_payment_id;
    const orderId = uuid();
    const order = {
      paymentId,
      orderId,
      amountPaid: totalAmount,
      orderedProducts: [...cartProducts],
      deliveryAddress: { ...orderAddress },
    };

    dispatch({ type: "SET_ORDERS", payload: order });
    clearCartHandler(auth.token);
    setCurrentPage("orders");
    navigate("/profile/orders");
    toast.success("Order placed successfully!");
    onClose();
  };

  const razorpayOptions = {
    key: KEY_ID,
    currency: "INR",
    amount: Number(totalAmount) * 100,
    name: "Art Waves Unleashed",
    description: "Order for products",
    prefill: {
      name: auth.firstName,
      email: auth.email,
      contact: userContact,
    },
    notes: { address: orderAddress },
    theme: { color: "#000000" },
    handler: successHandler,
  };

  const placeOrderHandler = () => {
    if (orderAddress) {
      const razorpayInstance = new window.Razorpay(razorpayOptions);
      razorpayInstance.open();
    } else {
      toast.error("Please select or add a delivery address.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="checkout-modal"
            initial={{ y: "-30px", opacity: 0, scale: 0.95 }}
            animate={{ y: "0px", opacity: 1, scale: 1 }}
            exit={{ y: "-30px", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={onClose}>
              ✖
            </button>
            <h2 className="modal-title">Checkout</h2>

            {/* Scrollable content area */}
            <div className="checkout-scrollable-content">
              <AddressSection />
              <OrderSummary />
            </div>

            {/* Integrated Razorpay Payment Button */}
            <button className="confirm-payment-btn" onClick={placeOrderHandler}>
              Place Order
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
