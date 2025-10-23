import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our E-Commerce Store
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover amazing products at great prices
          </p>
          <div className="space-x-4">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>
            <Link
              href="/login"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
