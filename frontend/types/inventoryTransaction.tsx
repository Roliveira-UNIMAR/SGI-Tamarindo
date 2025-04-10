export interface InventoryTransaction {
  id: number;
  inventory_id: number;
  transaction_type: string;
  quantity: number;
  user_id: number;
  transaction_date: string;
  notes: string;
  product_name: string;
  unit_name: string;
  products_details: ProductsDetail[];
}

export interface ProductsDetail {
  product_id: number;
  product_name: string;
  received_quantity: number;
  ordered_quantity: number;
}
