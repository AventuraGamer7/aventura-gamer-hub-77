import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechnicalServicesAdmin from '@/components/TechnicalServicesAdmin';

const TechnicalServicesAdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TechnicalServicesAdmin />
      </main>
      <Footer />
    </div>
  );
};

export default TechnicalServicesAdminPage;