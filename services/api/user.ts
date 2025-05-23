import { api } from "@/services/api/baseApi";

export const updateProfile = async (data: any) => {
  const response = await api.put("/account/me/update/", data);
  return response.data;
};
