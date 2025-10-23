"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();

  // Use useCallback to memoize the fetch function
  const fetchProduct = useCallback(async () => {
    try {
      const response = await api.get(`/products/${params.id}`);
      setProduct(response.data);
    } catch (error) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, fetchProduct]);

  const addToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product already in cart
    const existingItem = existingCart.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Product added to cart!");
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading product...</div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </>
    );

  if (!product)
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Product not found</div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span>Category: {product.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Details */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">
                    ${product.price}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Info Box */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Purchase Options
                  </h3>

                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700 font-medium">
                          Quantity:
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={decreaseQuantity}
                            className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-12 text-center border border-gray-300 rounded py-1">
                            {quantity}
                          </span>
                          <button
                            onClick={increaseQuantity}
                            className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-lg font-bold">
                            ${(product.price * quantity).toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={addToCart}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Please log in to purchase this product
                      </p>
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        Login to Purchase
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
