// import { useState } from "react";
// import "./Cart.css";
// import { CheckoutModal } from "../../components/CheckoutModal/CheckoutModal";

// import { CartListing } from "./components/CartListing/CartListing";
// import { Coupons } from "./components/Coupons/Coupons";
// import { CartAmountSummary } from "./components/CartAmountSummary/CartAmountSummary";
// import { useUserData } from "../../contexts/UserDataProvider.js";
// import { useNavigate } from "react-router-dom";
// import { useData } from "../../contexts/DataProvider.js";

// export const Cart = () => {
//   const [couponSelected, setCouponSelected] = useState([]);
//   const { userDataState } = useUserData();
//   const navigate = useNavigate();
//   const { loading } = useData();
//   const [showCheckout, setShowCheckout] = useState(false);

//   return (
//     !loading &&
//     (userDataState.cartProducts.length ? (
//       <div>
//         <h1 className="page-heading">Cart</h1>
//         <div className="cart-container">
//           <CartListing />
//           <div>
//             <Coupons
//               couponSelected={couponSelected}
//               setCouponSelected={setCouponSelected}
//             />
//             <CartAmountSummary couponSelected={couponSelected} />
//           </div>
//         </div>
//         <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
//           Proceed to Checkout
//         </button>

//         <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
//       </div>

//     ) : (
//       <div className="no-items-container">
//         <h2 className="page-heading">Cart is Empty!</h2>
//         <button
//           className="explore-btn"
//           onClick={() => navigate("/product-listing")}
//         >
//           Explore
//         </button>
//       </div>
//     ))
//   );
// };



import { useState } from "react";
import "./Cart.css";
import { CheckoutModal } from "../../components/CheckoutModal/CheckoutModal";
import { CartListing } from "./components/CartListing/CartListing";
import { Coupons } from "./components/Coupons/Coupons";
import { CartAmountSummary } from "./components/CartAmountSummary/CartAmountSummary";
import { useUserData } from "../../contexts/UserDataProvider.js";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataProvider.js";
import { toast } from "react-hot-toast";

export const Cart = () => {
  const [couponSelected, setCouponSelected] = useState([]);
  const { userDataState, dispatch } = useUserData();
  const navigate = useNavigate();
  const { loading } = useData();
  const [showCheckout, setShowCheckout] = useState(false);

  const handlePlaceOrder = () => {
    // Real order handling logic here
    toast.success("Order Placed Successfully!");

    // Clear cart after order placed
    dispatch({ type: "CLEAR_CART" });

    setShowCheckout(false);
    navigate("/order-confirmation");
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  return (
    !loading &&
    (userDataState.cartProducts.length ? (
      <div>
        <h1 className="page-heading">Cart</h1>
        <div className="cart-container">
          <CartListing />
          <div className="cart-summary">
            <Coupons
              couponSelected={couponSelected}
              setCouponSelected={setCouponSelected}
            />
            <CartAmountSummary
              couponSelected={couponSelected}
              onCheckout={handleCheckout}
            />
          </div>
        </div>

        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    ) : (
      <div className="no-items-container">
        <h2 className="page-heading">Cart is Empty!</h2>
        <button
          className="explore-btn"
          onClick={() => navigate("/product-listing")}
        >
          Explore
        </button>
      </div>
    ))
  );
};
