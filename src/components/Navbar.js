"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateCartCount = () => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            E-Commerce Store
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/products" className="hover:text-blue-200">
              Products
            </Link>

            {user ? (
              <>
                <Link href="/cart" className="hover:text-blue-200 relative">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/orders" className="hover:text-blue-200">
                  My Orders
                </Link>
                {user.role === "admin" && (
                  <Link href="/reports" className="hover:text-blue-200">
                    Reports
                  </Link>
                )}
                <span className="mx-2">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link href="/register" className="hover:text-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
