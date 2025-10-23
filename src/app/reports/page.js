"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function Reports() {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const [revenueRes, categoryRes, customersRes] = await Promise.all([
        api.get("/reports/daily-revenue"),
        api.get("/reports/category-stats"),
        api.get("/reports/top-customers"),
      ]);

      setDailyRevenue(revenueRes.data);
      setCategoryStats(categoryRes.data);
      setTopCustomers(customersRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">Admin access required.</div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading reports...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Reports</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Daily Revenue (Last 7 Days)
            </h2>
            {dailyRevenue.length === 0 ? (
              <p className="text-gray-600">No revenue data available.</p>
            ) : (
              <div className="space-y-3">
                {dailyRevenue.map((day) => (
                  <div
                    key={day.date}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${parseFloat(day.revenue).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.ordercount} orders
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Category Statistics</h2>
            {categoryStats.length === 0 ? (
              <p className="text-gray-600">No category data available.</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((category) => (
                  <div
                    key={category._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="capitalize">{category._id}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {category.productcount} products
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg: ${parseFloat(category.averageprice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Top Customers</h2>
            {topCustomers.length === 0 ? (
              <p className="text-gray-600">No customer data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Customer</th>
                      <th className="text-right py-2">Orders</th>
                      <th className="text-right py-2">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer) => (
                      <tr key={customer.email} className="border-b">
                        <td className="py-2">
                          <div className="font-semibold">{customer.name}</div>
                          <div className="text-sm text-gray-600">
                            {customer.email}
                          </div>
                        </td>
                        <td className="text-right py-2">
                          {customer.ordercount}
                        </td>
                        <td className="text-right py-2 font-semibold">
                          ${parseFloat(customer.totalspent).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
