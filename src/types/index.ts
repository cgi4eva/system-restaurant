export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface Customer {
  id: number;
  name: string;
  doc: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface SaleItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

export interface BusinessInfo {
  name: string;
  ruc: string;
  address: string;
  city: string;
}