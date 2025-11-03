import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Customer } from '../types';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';

interface CustomersTabProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: number) => void;
}

const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}) => {
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    doc: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.doc) {
      alert('Por favor completa al menos el nombre y documento del cliente');
      return;
    }

    onAddCustomer({
      id: Date.now(),
      ...newCustomer,
      createdAt: new Date().toISOString()
    });

    setNewCustomer({
      name: '',
      doc: '',
      phone: '',
      address: '',
      notes: ''
    });
  };

  const exportCustomers = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'clientes_restaurante.json');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Agregar Nuevo Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Nuevo Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Nombre completo"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="DNI/RUC"
              value={newCustomer.doc}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, doc: e.target.value }))}
            />
            <Input
              placeholder="Teléfono"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Button onClick={handleAddCustomer} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Guardar Cliente
            </Button>
          </div>
          <Input
            placeholder="Dirección (opcional)"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
          />
          <Input
            placeholder="Notas adicionales (opcional)"
            value={newCustomer.notes}
            onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
          />
        </CardContent>
      </Card>

      {/* Clientes Registrados */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Button onClick={exportCustomers} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Clientes
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar Clientes
            </Button>
          </div>

          {customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay clientes registrados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.doc}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersTab;