export interface Inventory {
  id: number;
  product_name: string;
  location_id: number;
  is_available: boolean;
  available_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  reorder_point: number;
  requires_refrigeration: boolean;
  unit_abbr: string;
  address: string;
  unit_id: number;
  transaction_type: string;
  concept: string;
}
