import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import HomePage from "./views/Home.vue";
import Product from "./views/Product.vue";
import Employee from "./views/Employee.vue";
import Leave from "./views/Leave.vue";
import Category from "./views/Category.vue";
import StockManage from "./views/StockManage.vue";
import Salary from "./views/Salary.vue";
import Department from "./views/Department.vue";
import Register from "./views/Register.vue";
import RoleManage from "./views/RoleManage.vue";
import About from "./views/About.vue";
import Quotation from "./views/Quotation.vue";
import forgetPassword from "./views/forgetpassword.vue";
import Customer from "./views/Customer.vue";
import Invoice from "./views/Invoice.vue";
import BillingNote from "./views/BillingNote.vue";
import { config } from "../constant";
import SalesReport from "./views/SalesReport.vue";
import EmployeeReport from "./views/EmployeeReport.vue";
import FirstRegis from "./views/FirstRegister.vue";
import Position from "./views/Position.vue";
import Expenses from "./views/Expenses.vue";
import Tax from "./views/Tax.vue";

const API_CALL = config["url"];

const routes = [
  { path: "/login", name: "login", component: LoginPage },
  {
    path: "/forgetpassword",
    name: "forgetpassword",
    component: forgetPassword,
  },
  { path: "/register", name: "register", component: FirstRegis },
  {
    path: "/home",
    component: HomePage,
    name: "home",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/user",
    component: Register,
    name: "user",
    meta: { requiresAuth: true, requiresAdmin: true, roles: ["SUPERUSER"] },
  },
  {
    path: "/product",
    component: Product,
    name: "product",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/category",
    component: Category,
    name: "category",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/stockmanage",
    component: StockManage,
    name: "stockmanage",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/employee",
    component: Employee,
    name: "employee",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/leave",
    component: Leave,
    name: "leave",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  // {
  //   path: "/salary",
  //   component: Salary,
  //   name: "salary",
  //   meta: {
  //     requiresAuth: true,
  //     requiresAdmin: true,
  //     roles: ["SUPERUSER", "MANAGER", "SALE"],
  //   },
  // },
  {
    path: "/department",
    component: Department,
    name: "department",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/position",
    component: Position,
    name: "position",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/quotation",
    component: Quotation,
    name: "quotation",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/billingnote",
    component: BillingNote,
    name: "billingnote",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/invoice",
    component: Invoice,
    name: "invoice",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/taxinvoice",
    component: Tax,
    name: "taxinvoice",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/customer",
    component: Customer,
    name: "customer",
    meta: { requiresAuth: true, roles: ["SUPERUSER", "MANAGER", "SALE"] },
  },
  {
    path: "/rolemanage",
    component: RoleManage,
    name: "rolemanage",
    meta: { requiresAuth: true, requiresAdmin: true, roles: ["SUPERUSER"] },
  },
  {
    path: "/aboutcompany",
    component: About,
    name: "aboutcompany",
    meta: { requiresAuth: true, requiresAdmin: true, roles: ["SUPERUSER"] },
  },
  {
    path: "/salesreport",
    component: SalesReport,
    name: "salesreport",
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      roles: ["SUPERUSER", "MANAGER", "SALE"],
    },
  },
  {
    path: "/employeereport",
    component: EmployeeReport,
    name: "employeereport",
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      roles: ["SUPERUSER", "MANAGER", "SALE"],
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
  {
    path: "/expenses",
    component: Expenses,
    name: "expenses",
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      roles: ["SUPERUSER", "MANAGER", "SALE"],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("@accessToken");
  const userRole = localStorage.getItem("RoleName");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const allowedRoles = to.meta.roles;

  if (to.path === "/" && token && userRole) {
    return next("/home");
  }

  if (requiresAuth) {
    if (!token || !userRole) {
      return next("/login");
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return next("/login");
    }
    console.log(API_CALL);
    try {
      const response = await fetch(`${API_CALL}/auth/checkAuthen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return next("/login");
      }

      const data = await response.text();

      if (data === "Token Error..") {
        return next("/login");
      }

      next(); // เรียก next() เมื่อทุกอย่างถูกต้อง
    } catch (error) {
      console.error("Error checking authentication:", error);
      return next("/login");
    }
  } else {
    next(); // ไม่ต้องมีการตรวจสอบ auth
  }
});

export default router;
