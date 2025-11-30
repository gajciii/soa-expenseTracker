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
  expense_id?: string;
  description: string;
  items: Item[];
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Report {
  date_from: string | null;
  date_to: string | null;
  expenses: ExpenseResponse[];
  most_expensive_items: Item[];
  total_price: number;
  created_at: string;
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

export enum NotificationChannel {
  EMAIL = 'EMAIL',
}

export interface Reminder {
  id: number;
  userId: string;
  message: string;
  remindAt: string;
  processed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  userId: string;
  message: string;
  remindAt: string;
}

export interface UpdateReminderRequest {
  message?: string;
  remindAt?: string;
  processed?: boolean;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  read: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  body: string;
  channel?: NotificationChannel;
  source?: string;
}

export interface UpdateNotificationRequest {
  read?: boolean;
  title?: string;
  body?: string;
}

export interface CategoryRequest {
  name: string;
}

export interface CategoryResponse {
  category_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryResponse {
  message: string;
  category_id: string;
}

export interface BudgetRequest {
  month: string;
  category_id: string;
  limit: number;
}

export interface BudgetResponse {
  budget_id: string;
  month: string;
  category_id: string;
  limit: string;
  created_at: string;
  updated_at: string;
}

