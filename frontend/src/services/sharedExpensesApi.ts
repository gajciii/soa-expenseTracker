import axios, { AxiosInstance } from 'axios';
import { SHARED_EXPENSES_API_BASE_URL } from '../config/api';
import type {
  GroupExpenseRequest,
  GroupExpenseResponse,
  GroupRequest,
  GroupResponse,
  GroupTitleRequest,
  MemberRequest,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: SHARED_EXPENSES_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sharedExpensesApi = {
  createGroup: async (groupData: GroupRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/groups/create`, groupData);
    return response.data;
  },

  getGroupExpenses: async (groupId: string): Promise<GroupExpenseResponse[]> => {
    const response = await api.get<GroupExpenseResponse[]>(`/group-expenses/get-all/${groupId}`);
    return response.data;
  },

  updateGroupExpense: async (groupId: string, expenseId: string, expenseData: GroupExpenseRequest): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/group-expenses/update/${groupId}/${expenseId}`, expenseData);
    return response.data;
  },

  deleteGroupExpense: async (groupId: string, expenseId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/group-expenses/delete/${groupId}/${expenseId}`);
    return response.data;
  },

  getUserGroups: async (userId: string): Promise<GroupResponse[]> => {
    const response = await api.get<GroupResponse[]>(`/groups/user-groups/${userId}`);
    return response.data;
  },

  getGroup: async (id: string): Promise<GroupResponse> => {
    const response = await api.get<GroupResponse>(`/groups/${id}`);
    return response.data;
  },

  getGroupMembers: async (id: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/groups/group-members/${id}`);
    return response.data;
  },

  updateGroupTitle: async (id: string, titleData: GroupTitleRequest): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/groups/update-title/${id}`, titleData);
    return response.data;
  },

  deleteGroup: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/groups/delete-group/${id}`);
    return response.data;
  },

  addMember: async (groupId: string, memberData: MemberRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/groups/add-member/${groupId}`, memberData);
    return response.data;
  },

  addGroupExpense: async (groupId: string, expenseData: GroupExpenseRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/group-expenses/add/${groupId}`, expenseData);
    return response.data;
  },
};

export default sharedExpensesApi;

