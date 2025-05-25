const production = {
  url: "https://erp-backend-5gd0.onrender.com",
};
const development = {
  url: "http://localhost:5000",
};

export const config =
  import.meta.env.VITE_SITE_NAME === "dev" ? development : production;
