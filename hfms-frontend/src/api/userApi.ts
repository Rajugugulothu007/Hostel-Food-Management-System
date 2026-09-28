import axiosClient from "./axiosClient";
import type { StudentDTO } from "../types/student";

export const userApi = {
  async list(): Promise<StudentDTO[]> {
    const res = await axiosClient.get<StudentDTO[]>("/api/students");
    return res.data;
  },

  async getById(id: number): Promise<StudentDTO> {
    const res = await axiosClient.get<StudentDTO>(`/api/students/${id}`);
    return res.data;
  },

  async create(data: StudentDTO): Promise<StudentDTO> {
    const res = await axiosClient.post<StudentDTO>("/api/students", data);
    return res.data;
  },

  async update(id: number, data: StudentDTO): Promise<StudentDTO> {
    const res = await axiosClient.put<StudentDTO>(`/api/students/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/api/students/${id}`);
  },
};