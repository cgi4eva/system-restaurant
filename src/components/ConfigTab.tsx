import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BusinessInfo } from '../types';
import { Save, Download, Upload } from 'lucide-react';

interface ConfigTabProps {
  businessInfo: BusinessInfo;
  onSaveBusinessInfo: (info: BusinessInfo) => void;
}

const ConfigTab: React.FC<ConfigTabProps> = ({ businessInfo, onSaveBusinessInfo }) => {
  const [info, setInfo] = useState(businessInfo);

  const handleSave = () => {
    onSaveBusinessInfo(info);
  };

  const exportAllData = () => {
    const data = {
      businessInfo: info,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `backup_restaurante_${new Date().toISOString().split('T')[0]}.json`);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Información del Negocio */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nombre del negocio"
              value={info.name}
              onChange={(e) => setInfo(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="RUC"
              value={info.ruc}
              onChange={(e) => setInfo(prev => ({ ...prev, ruc: e.target.value }))}
            />
            <Input
              placeholder="Dirección"
              value={info.address}
              onChange={(e) => setInfo(prev => ({ ...prev, address: e.target.value }))}
            />
            <Input
              placeholder="Ciudad"
              value={info.city}
              onChange={(e) => setInfo(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      {/* Gestión de Numeración */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Numeración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Reiniciar numeración de Boletas:
              </label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Nuevo número" min="1" />
                <Button variant="outline">Reiniciar</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Reiniciar numeración de Facturas:
              </label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Nuevo número" min="1" />
                <Button variant="outline">Reiniciar</Button>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium mb-2">Estado actual:</p>
            <p className="text-sm text-blue-700">Próxima Boleta: <span className="font-semibold">0001</span></p>
            <p className="text-sm text-blue-700">Próxima Factura: <span className="font-semibold">0001</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Exportar/Importar Datos */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar/Importar Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={exportAllData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Todos los Datos
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar Todos los Datos
            </Button>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Esta función exporta/importa todos los datos del sistema.
              Útil para realizar copias de seguridad o migrar datos entre dispositivos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigTab;