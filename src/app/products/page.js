"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const response = await api.get(`/products?${params}`);
      setProducts(response.data.products);
    } catch (error) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // This would normally come from an API endpoint
      // For now, we'll extract from products or hardcode
      const hardcodedCategories = ["Electronics", "Accessories"];
      setCategories(hardcodedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading products...</div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ${product.price}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/products/${product._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center text-gray-600 mt-8">
            No products found. Try different search criteria.
          </div>
        )}
      </div>
    </>
  );
}
