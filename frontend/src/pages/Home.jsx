import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to SACCO Microfinance System
          </h1>
          <p className="mt-4 text-gray-600">
            Empowering communities through savings and credit management.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
