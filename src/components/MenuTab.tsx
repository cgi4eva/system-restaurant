import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MenuItem } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface MenuTabProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: number) => void;
}

const MenuTab: React.FC<MenuTabProps> = ({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem
}) => {
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Entradas',
    price: 0,
    description: ''
  });

  const handleAddMenuItem = () => {
    if (!newItem.name || newItem.price < 0) {
      alert('Por favor completa el nombre y precio del producto');
      return;
    }

    onAddMenuItem({
      id: Date.now(),
      ...newItem
    });

    setNewItem({
      name: '',
      category: 'Entradas',
      price: 0,
      description: ''
    });
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      {/* Agregar Nuevo Producto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Nuevo Producto al Menú
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Nombre del producto"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            />
            <Select
              value={newItem.category}
              onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entradas">Entradas</SelectItem>
                <SelectItem value="Platos de Fondo">Platos de Fondo</SelectItem>
                <SelectItem value="Bebidas">Bebidas</SelectItem>
                <SelectItem value="Postres">Postres</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Precio"
              step="0.01"
              min="0"
              value={newItem.price}
              onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            />
            <Button onClick={handleAddMenuItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Guardar Producto
            </Button>
          </div>
          <Input
            placeholder="Descripción (opcional)"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
          />
        </CardContent>
      </Card>

      {/* Productos en el Menú */}
      <Card>
        <CardHeader>
          <CardTitle>Productos en el Menú</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 px-3 py-2 bg-primary text-primary-foreground rounded-lg">
                {category}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.description || '-'}</TableCell>
                        <TableCell className="text-right font-semibold">
                          S/ {item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDeleteMenuItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuTab;