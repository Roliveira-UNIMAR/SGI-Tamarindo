export interface ConsumptionNote {
  id: number;
  client_id: number;
  client_name: string;
  client_document: string;
  user_id: number;
  user_name: string;
  issued_at: string;
  cancelled_at: string;
  address: string;
  status_id: number;
  note_details: ConsumptionNoteDetail[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface ConsumptionNoteDetail {
  recipe_id: string;
  recipe_name: string;
  type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
