import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MenuItem, SaleItem, Customer } from '../types';
import { Plus, Minus, Trash2, Printer } from 'lucide-react';

interface SalesTabProps {
  menuItems: MenuItem[];
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

const SalesTab: React.FC<SalesTabProps> = ({ menuItems, customers, onAddCustomer }) => {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [menuItemQuantities, setMenuItemQuantities] = useState<{ [key: number]: number }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [receiptType, setReceiptType] = useState('BOLETA');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashier, setCashier] = useState('');
  const [deliveryPerson, setDeliveryPerson] = useState('');

  const changeMenuQuantity = (id: number, change: number) => {
    setMenuItemQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change)
    }));
  };

  const addMenuItemToReceipt = (id: number) => {
    const menuItem = menuItems.find(item => item.id === id);
    const quantity = menuItemQuantities[id] || 1;
    
    if (menuItem && quantity > 0) {
      setItems(prev => [...prev, {
        id: Date.now(),
        description: menuItem.name,
        quantity: quantity,
        price: menuItem.price
      }]);
      
      setMenuItemQuantities(prev => ({ ...prev, [id]: 0 }));
    }
  };

  const addItem = () => {
    const description = (document.getElementById('itemDescription') as HTMLInputElement)?.value;
    const quantity = parseFloat((document.getElementById('itemQuantity') as HTMLInputElement)?.value || '1');
    const price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement)?.value || '0');

    if (!description || quantity <= 0 || price < 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    setItems(prev => [...prev, {
      id: Date.now(),
      description,
      quantity,
      price
    }]);

    // Limpiar campos
    if (document.getElementById('itemDescription')) (document.getElementById('itemDescription') as HTMLInputElement).value = '';
    if (document.getElementById('itemPrice')) (document.getElementById('itemPrice') as HTMLInputElement).value = '';
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const subtotal = total / 1.18;
    const igv = subtotal * 0.18;
    return { subtotal, igv, total };
  };

  const { subtotal, igv, total } = calculateTotals();

  const printReceipt = () => {
    if (items.length === 0) {
      alert('Agrega al menos un producto antes de imprimir');
      return;
    }
    window.print();
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      {/* Datos del Comprobante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Datos del Comprobante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={receiptType} onValueChange={setReceiptType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOLETA">BOLETA</SelectItem>
                <SelectItem value="FACTURA">FACTURA</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Número" value="0001" readOnly />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              Próximo número automático para {receiptType}: <span className="font-semibold">0001</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Datos del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Nombre del cliente (opcional)" />
            <Input placeholder="DNI/RUC (opcional)" />
            <Input placeholder="Dirección del cliente (opcional)" />
          </div>
        </CardContent>
      </Card>

      {/* Información de Venta */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Método de Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Efectivo">💵 Efectivo</SelectItem>
                <SelectItem value="Yape">📱 Yape</SelectItem>
                <SelectItem value="Tarjeta">💳 Tarjeta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cashier} onValueChange={setCashier}>
              <SelectTrigger>
                <SelectValue placeholder="Vendedor/Caja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Caja 1">Caja 1</SelectItem>
                <SelectItem value="Caja 2">Caja 2</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Delivery - Repartidor (opcional)" 
              value={deliveryPerson}
              onChange={(e) => setDeliveryPerson(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Menú Rápido */}
      <Card>
        <CardHeader>
          <CardTitle>Menú del Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 px-3 py-2 bg-primary text-primary-foreground rounded-lg">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => {
                    const quantity = menuItemQuantities[item.id] || 0;
                    return (
                      <Card 
                        key={item.id} 
                        className={`cursor-pointer transition-all ${
                          quantity > 0 ? 'border-green-400 bg-green-50' : ''
                        }`}
                        onClick={() => changeMenuQuantity(item.id, 1)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            <span className="font-bold text-primary">S/ {item.price.toFixed(2)}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeMenuQuantity(item.id, -1);
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeMenuQuantity(item.id, 1);
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addMenuItemToReceipt(item.id);
                                }}
                              >
                                Agregar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Agregar Producto Manual */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Producto Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input id="itemDescription" placeholder="Descripción del producto" />
            <Input id="itemQuantity" type="number" placeholder="Cantidad" defaultValue="1" min="1" step="0.01" />
            <Input id="itemPrice" type="number" placeholder="Precio" min="0" step="0.01" />
            <Button onClick={addItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items del Comprobante</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay productos agregados. Selecciona del menú o agrega manualmente.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">S/ {item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">S/ {(item.quantity * item.price).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Totales */}
      {items.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Subtotal (Gravada):</span>
                <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>IGV (18%):</span>
                <span className="font-medium">S/ {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t">
                <span className="text-xl font-bold">TOTAL:</span>
                <span className="text-xl font-bold text-primary">S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón de Impresión */}
      <div className="flex justify-center">
        <Button onClick={printReceipt} size="lg" className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Imprimir Boleta
        </Button>
      </div>
    </div>
  );
};

export default SalesTab;