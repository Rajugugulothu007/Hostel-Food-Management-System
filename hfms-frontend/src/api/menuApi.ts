import axiosClient from "./axiosClient";
import type { MenuItemDTO } from "../types/menu";

export const menuApi = {
  async list(): Promise<MenuItemDTO[]> {
    const res = await axiosClient.get<MenuItemDTO[]>("/api/menu");
    return res.data;
  },

  async listByMealType(mealType: string): Promise<MenuItemDTO[]> {
    const res = await axiosClient.get<MenuItemDTO[]>(
      `/api/menu/today?mealType=${mealType}`
    );
    return res.data;
  },

  async getById(id: string): Promise<MenuItemDTO> {
    const res = await axiosClient.get<MenuItemDTO>(`/api/menu/${id}`);
    return res.data;
  },

  async create(data: MenuItemDTO): Promise<MenuItemDTO> {
    const res = await axiosClient.post<MenuItemDTO>("/api/menu", data);
    return res.data;
  },

  async update(id: string, data: MenuItemDTO): Promise<MenuItemDTO> {
    const res = await axiosClient.put<MenuItemDTO>(`/api/menu/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await axiosClient.delete(`/api/menu/${id}`);
  },
};