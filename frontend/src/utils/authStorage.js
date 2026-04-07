export const saveAuth = (userData) => {
  if (!userData?.token) return;
  localStorage.setItem("token", userData.token);
  localStorage.setItem("user", JSON.stringify(userData));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getAuthToken = () => localStorage.getItem("token");
