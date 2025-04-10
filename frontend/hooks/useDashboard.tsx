export interface SummaryData {
  total_orders: number;
  total_consumption_notes: number;
  inventory_value: number;
  pending_orders: number;
}

export interface Order {
  id: number;
  status: string;
  supplier_name: string;
  created_at: string;
}

export interface ConsumptionNote {
  id: number;
  client: { name: string };
  total: number;
  created_at: string;
}

export interface InventoryProduct {
  id: number;
  name: string;
  available_quantity: number;
  min_stock_level: number;
}

export interface Transfer {
  id: number;
  from_location: string;
  to_location: string;
  updated_at: string;
}

export interface ConsumedProduct {
  product_id: number;
  total_consumed: number;
  product: { name: string };
}

export const fetchSummary = async (): Promise<SummaryData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/summary`);
  return response.json();
};

export const fetchOrdersAndNotes = async (): Promise<{
  orders_by_status: { status: string; count: number }[];
  latest_orders: Order[];
  latest_notes: ConsumptionNote[];
}> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/orders-notes`);
  return response.json();
};

export const fetchInventoryManagement = async (): Promise<{
  low_stock_products: InventoryProduct[];
  recent_transfers: Transfer[];
  top_consumed_products: ConsumedProduct[];
}> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/inventory`);
  return response.json();
};
