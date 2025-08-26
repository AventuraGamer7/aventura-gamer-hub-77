import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechnicalServicesDashboard from '@/components/TechnicalServicesDashboard';

const TechnicalServicesDashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TechnicalServicesDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default TechnicalServicesDashboardPage;