/* eslint-disable @typescript-eslint/no-explicit-any */
import authAxios from "./axiosInstance";
export const getmailcode = async (mail: string) => {
  return await authAxios.post("/mail", { mail });
}
export const login = async (loginData: any) => {
  return await authAxios.post("/verify-code", loginData).then(response => {
    const { id } = response.data;
    localStorage.setItem('user_id', id);

  })
}
export const logout = async (refreshToken: string) => {
  return await authAxios.post('/logout', { refreshToken })
    .then(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    });
}
