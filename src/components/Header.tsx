import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSeconds = (date: Date) => {
    return date.getSeconds().toString().padStart(2, '0');
  };

  return (
    <header className="border-b bg-card">
      <div className="container flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold">SR</span>
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">System Restaurant</h1>
        </div>
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col items-end">
              <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>Hora:</span>
                <span>{formatTime(currentTime)}</span>:
                <span className="text-primary font-semibold">{formatSeconds(currentTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </header>
  );
};

export default Header;