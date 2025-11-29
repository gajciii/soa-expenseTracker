export interface Item {
  item_id: string;
  item_name: string;
  item_price: number;
  item_quantity: number;
}

export interface ExpenseRequest {
  description?: string;
  items: Item[];
}

export interface ExpenseResponse {
  expense_id?: string; // Optional because backend doesn't return it in GET, but we store it on frontend
  description: string;
  items: Item[];
  total_price: number;
  created_at: string; // Format: "YYYY/MM/DD HH:mm:ss"
  updated_at: string; // Format: "YYYY/MM/DD HH:mm:ss"
}

export interface Report {
  date_from: string | null; // Format: "YYYY-MM-DD" or null
  date_to: string | null; // Format: "YYYY-MM-DD" or null
  expenses: ExpenseResponse[];
  most_expensive_items: Item[];
  total_price: number;
  created_at: string; // Format: "YYYY/MM/DD HH:mm:ss"
}

export interface CreateExpenseResponse {
  message: string;
  expense_id: string;
}

export interface CreateReportResponse {
  message: string;
  'report id': string;
}

export interface ExpenseParams {
  date_from?: string;
  date_to?: string;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

