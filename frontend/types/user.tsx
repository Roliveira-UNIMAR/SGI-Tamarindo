export interface UserType {
  id: number
  email: string
  names: string
  email_verified_at?: Date
  created_at: Date
  updated_at: Date
}

export interface User {
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
  password?: string;
  status_id: number;
  full_name: string;
  phone: string;
  document: string;
  role_id: number;
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
export interface Role {
  id: number;
  name: string;
}
