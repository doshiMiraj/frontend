"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadCart();
  }, [user, router]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await api.post("/orders", orderData);

      // Clear cart
      localStorage.removeItem("cart");
      setCartItems([]);

      alert("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      alert(
        "Checkout failed: " + (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="border-b border-gray-200 p-4 flex items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
