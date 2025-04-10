export interface Order {
  id: number;
  ordered_at: string;
  received_at: string;
  created_at: string;
  issued_at: string;
  cancelled_at: string;
  supplier_id: number,
  supplier_name: string;
  supplier_document: string;
  supplier_phone: string;
  status_id: number;
  user_name: string
  order_details: OrderDetail[];
  document_number: number;
}

export interface OrderDetail {
  product_id: number;
  product_name: string;
  received_quantity: number;
  ordered_quantity: number;
}
