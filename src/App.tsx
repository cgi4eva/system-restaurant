import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import Header from './components/Header';
import SalesTab from './components/SalesTab';
import CustomersTab from './components/CustomersTab';
import MenuTab from './components/MenuTab';
import ConfigTab from './components/ConfigTab';
import { MenuItem, Customer, BusinessInfo } from './types';

const defaultMenuItems: MenuItem[] = [
  { id: 1, name: 'Ensalada fresca', category: 'Entradas', price: 3.00, description: 'Lechuga, pollo, crutones, parmesano' },
  { id: 2, name: 'Tequeños', category: 'Entradas', price: 3.00, description: '6 unidades con salsas' },
  { id: 3, name: 'Causa Limeña', category: 'Entradas', price: 3.00, description: 'Papa amarilla, pollo, palta' },
  { id: 4, name: 'Ceviche de Pescado', category: 'Entradas', price: 3.00, description: 'Aguadito' },
  { id: 5, name: 'Lomo Saltado', category: 'Platos de Fondo', price: 8.00, description: 'Con papas fritas y arroz' },
  { id: 6, name: 'Arroz con Pollo', category: 'Platos de Fondo', price: 8.00, description: 'Con ensalada y papa a la huancaína' },
  { id: 7, name: 'Ají de Gallina', category: 'Platos de Fondo', price: 8.00, description: 'Con arroz, papa y aceituna' },
  { id: 8, name: 'Seco de Res', category: 'Platos de Fondo', price: 8.00, description: 'Con frijoles y yuca' },
  { id: 9, name: 'Tallarín Saltado', category: 'Platos de Fondo', price: 8.00, description: 'Carne o pollo' },
  { id: 10, name: 'Chicha Morada', category: 'Bebidas', price: 8.00, description: 'Jarra 1 litro' },
  { id: 11, name: 'Inca Kola', category: 'Bebidas', price: 5.00, description: '500ml' },
  { id: 12, name: 'Limonada', category: 'Bebidas', price: 7.00, description: 'Natural' },
  { id: 13, name: 'Descartables', category: 'Otros', price: 1.00, description: 'Utensilios descartables' }
];

const defaultBusinessInfo: BusinessInfo = {
  name: 'GRUPO ORGANICO PERU S.A.C - SAN MARTIN',
  ruc: '20123456789',
  address: 'GRUPO URBANO MIRAMAR PERU 2-4-IC',
  city: 'AYACUCHO 2849'
};

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedMenu = localStorage.getItem('menuItems');
    const savedCustomers = localStorage.getItem('customers');
    const savedBusiness = localStorage.getItem('businessInfo');

    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      setMenuItems(defaultMenuItems);
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    if (savedBusiness) {
      setBusinessInfo(JSON.parse(savedBusiness));
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('businessInfo', JSON.stringify(businessInfo));
  }, [businessInfo]);

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const handleAddMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const handleDeleteMenuItem = (id: number) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSaveBusinessInfo = (info: BusinessInfo) => {
    setBusinessInfo(info);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="container mx-auto py-6">
        <Tabs defaultValue="ventas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="menu">Menú</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="ventas">
            <SalesTab
              menuItems={menuItems}
              customers={customers}
              onAddCustomer={handleAddCustomer}
            />
          </TabsContent>

          <TabsContent value="clientes">
            <CustomersTab
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          </TabsContent>

          <TabsContent value="menu">
            <MenuTab
              menuItems={menuItems}
              onAddMenuItem={handleAddMenuItem}
              onUpdateMenuItem={handleUpdateMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
            />
          </TabsContent>

          <TabsContent value="config">
            <ConfigTab
              businessInfo={businessInfo}
              onSaveBusinessInfo={handleSaveBusinessInfo}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;