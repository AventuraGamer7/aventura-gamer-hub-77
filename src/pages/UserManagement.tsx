import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GestionUsuarios from '@/components/GestionUsuarios';

const UserManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-glow">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra usuarios y sus órdenes de servicio</p>
          </div>
          <GestionUsuarios />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagement;