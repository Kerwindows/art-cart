import "./AddressModal.css";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { addAddressService } from "../../../../services/address-services/addAddressService";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import { updateAddressService } from "../../../../services/address-services/updateAddressService";
import { toast } from "react-hot-toast";
import { useAddress } from "../../../../contexts/AddressProvider.js";
import { useAuth } from "../../../../contexts/AuthProvider.js";

export const AddressModal = () => {
  const [, setLoading] = useState(false);
  const [, setError] = useState("false");
  const { auth } = useAuth();
  const { dispatch } = useUserData();

  const dummyAddress = {
    name: "Aniket Saini",
    street: "66/6B Main Post Office",
    city: "Roorkee",
    state: "Uttarakhand",
    country: "India",
    pincode: "247667",
    phone: "963-906-0737",
  };

  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    addressForm,
    setAddressForm,
    isEdit,
    setIsEdit,
  } = useAddress();

  const updateAddress = async (address) => {
    try {
      setLoading(true);
      setError("");
      const response = await updateAddressService(address, auth.token);
      if (response.status === 200) {
        setLoading(false);
        toast.success(` ${address.name}'s address updated successfully!`);
        dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address) => {
    try {
      setLoading(true);
      setError("");
      const response = await addAddressService(address, auth.token);
      if (response.status === 201) {
        setLoading(false);
        toast.success("New address added successfully!");
        dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAddressModalOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }} // 💡 add transition here
        >
          <motion.div
            className="checkout-modal"
            initial={{ y: "-30px", opacity: 0, scale: 0.95 }}
            animate={{ y: "0px", opacity: 1, scale: 1 }}
            exit={{ y: "-30px", opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }} // 💡 and here
            onClick={(e) => e.stopPropagation()}
          >
            <div className="address-modal-container">
              <div className="address-input-container">
                <h1>Address Form</h1>
                <div className="address-input-form">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!isEdit) {
                        addAddress(addressForm);
                      } else {
                        updateAddress(addressForm);
                        setIsEdit(false);
                      }
                      setAddressForm({
                        name: "",
                        street: "",
                        city: "",
                        state: "",
                        country: "",
                        pincode: "",
                        phone: "",
                      });
                      setIsAddressModalOpen(false);
                    }}
                    className="input-container"
                  >
                    <input
                      name="name"
                      value={addressForm.name}
                      required
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, name: e.target.value })
                      }
                      placeholder="Enter Name"
                    />
                    <input
                      required
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, street: e.target.value })
                      }
                      placeholder="Enter Street"
                    />
                    <input
                      name="city"
                      required
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      placeholder="Enter City"
                    />
                    <input
                      name="state"
                      required
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      placeholder="Enter State"
                    />
                    <input
                      name="country"
                      value={addressForm.country}
                      required
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, country: e.target.value })
                      }
                      placeholder="Enter Country"
                    />
                    <input
                      name="pincode"
                      value={addressForm.pincode}
                      required
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, pincode: e.target.value })
                      }
                      placeholder="Enter Pincode"
                    />
                    <input
                      name="phone"
                      value={addressForm.phone}
                      required
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      placeholder="Enter Phone"
                      minLength="8"
                    />
                    <input className="submit" type="submit" value="Save" />
                  </form>
                </div>
                <div className="btn-container">
                  <button onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
                  <button
                    onClick={() => setAddressForm({ ...dummyAddress })}
                  >
                    Add Dummy Data
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
