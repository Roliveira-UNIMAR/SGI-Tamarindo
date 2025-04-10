export interface Client {
  id: number;
  names: string;
  surnames: string;
  document_type_id: number;
  document_number: string;
  gender_id: number;
  nationality: string;
  phone_operator_id: number;
  phone_number: string;
  email: string;
  address: string;
  status_id: number;
  full_name: string;
  phone: string;
  document: string;
}

export interface DocumentType {
  id: number;
  name: string;
}

export interface PhoneOperator {
  id: number;
  name: string;
}

export interface Gender {
  id: number;
  name: string;
}
