import AxiosInstance from "./AxiosInstance";

export const registerUser = async (username: string, email: string, password1: string, password2: string) => {
  const res = await AxiosInstance.post("/auth/register/", {
    username,
    email,
    password1,
    password2,
  });
  // Save tokens
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await AxiosInstance.post("/auth/login/", { email, password });
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const logoutUser = async () => {
  await AxiosInstance.post("/auth/logout/");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
