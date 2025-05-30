<template>
  <div class="Navigation">
    <!-- Top Navigate -->
    <div>
      <nav
        class="navtop navbar navbar-expand-sm fixed-top"
        style="flex-wrap: nowrap"
      >
        <span
          class="mdi mdi-menu show-moblie"
          style="cursor: pointer; display: none"
          @click="toggleSidebarMenu"
        ></span>

        <div class="container-fluid logowithname-top">
          <img :src="formDataBusiness.bus_logo" class="logo-on-top" />
          <a class="navbar-brand">{{ formDataBusiness.bus_name }}</a>
        </div>
        <div class="me-3">
          <div style="cursor: pointer" @click="toggleLanguage(t('headerLang'))">
            <a>{{ t("headerLang") }}</a>
          </div>
        </div>
        <div class="me-3">
          <div class="user-profile-button" @click="toggleDropdown">
            <a target="_blank" class="me-2">
              <img
                src="/src/assets/user.svg"
                alt="Forest"
                width="30"
                height="30"
              />
            </a>
            <a style="white-space: nowrap">
              {{ userName }}
            </a>
          </div>
        </div>
      </nav>
    </div>
    <!-- Expanded bar - click on username box on top nav -->
    <div class="expanded-content">
      <div v-if="isExpanded" class="dropdown-content">
        <p @click="openPopup">{{ t("profile") }}</p>
        <p @click="Logout">{{ t("logout") }}</p>
      </div>
    </div>
    <!-- Expanded bar - click TH/EN for switch language -->
    <div class="expanded-content">
      <div v-if="isExpandedLanguage" class="dropdown-content">
        <p @click="setLanguage('th')">TH</p>
        <p @click="setLanguage('en')">EN</p>
      </div>
    </div>
    <!-- Sidebar Navigation -->
    <div>
      <nav
        ref="sidebar"
        :class="{ open: isSidebarVisible }"
        class="navbar bg-light sidebar"
      >
        <div
          class="container-fluid"
          style="padding-bottom: 100px; padding-top: 60px"
        >
          <ul class="navbar-nav">
            <!-- Search input -->
            <div>
              <input
                class="form-control"
                :placeholder="$t('Search')"
                v-model="searchNav"
                @input="filterItems"
              />
            </div>
            <!-- Navigate Home page -->
            <li
              v-if="searchNav === ''"
              class="nav-item"
              :class="{ active: activePage === 'home' }"
              @click="handleSidebarToggleOnMobile"
            >
              <router-link
                @click="handleClicktoHome"
                class="nav-link"
                to="/"
                :disabled="activePage === 'home'"
                >{{ t("home") }}</router-link
              >
            </li>
            <li
              v-if="searchNav === ''"
              class="nav-item"
              :class="{ active: activePage === 'expenses' }"
              @click="handleSidebarToggleOnMobile"
            >
              <router-link
                @click="handleClicktoExpenses"
                class="nav-link"
                to="/"
                :disabled="activePage === 'expenses'"
                >{{ t("Expenses") }}</router-link
              >
            </li>
            <!--filter sidebar (if input text on search input)-->
            <li
              v-else
              v-for="navItem in filteredNavItems"
              :key="navItem.path"
              class="nav-item"
              :class="{ active: activePage === navItem.name.toLowerCase() }"
            >
              <router-link
                class="nav-link"
                :to="navItem.path"
                :disabled="activePage === navItem.name.toLowerCase()"
                v-if="this.$i18n.locale === 'th'"
              >
                {{
                  isThaiSearch
                    ? navItem.displayNameTh || navItem.displayName
                    : navItem.displayNameTh
                }}
              </router-link>
              <router-link
                class="nav-link"
                :to="navItem.path"
                :disabled="activePage === navItem.name.toLowerCase()"
                v-else
              >
                {{
                  isThaiSearch
                    ? navItem.displayName || navItem.displayName
                    : navItem.displayName
                }}
              </router-link>
            </li>
            <!--  sales Navigate -->
            <li
              v-if="searchNav === ''"
              class="nav-item"
              @click="toggleSubSidebarSale"
              :class="{
                active:
                  activePage === 'quotation' ||
                  activePage === 'billingnote' ||
                  activePage === 'invoice' ||
                  activePage === 'taxinvoice' ||
                  activePage === 'customer',
              }"
            >
              <a class="nav-link sidebar-expanded">
                {{ t("sale") }}
                <i class="bi" :class="isOpenSale ? 'bi-dash' : 'bi-plus'"></i>
              </a>
            </li>
            <div class="sub-sidebar" v-if="isOpenSale">
              <!-- Quotation -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'quotation' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleClicktoQuotation"
                  class="nav-link"
                  to="/quotation"
                  :disabled="activePage === 'quotation'"
                  >{{ t("headerQuotation") }}
                </router-link>
              </li>
              <!-- Invoice -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'invoice' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleClicktoInvoice"
                  class="nav-link"
                  to="/invoice"
                  :disabled="activePage === 'invoice'"
                  >{{ t("headerInvoice") }}</router-link
                >
              </li>
              <!-- Tax -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'taxinvoice' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleClicktoTaxInvoice"
                  class="nav-link"
                  to="/taxinvoice"
                  :disabled="activePage === 'taxinvoice'"
                  >{{ t("taxinvoice") }}</router-link
                >
              </li>
              <!-- Billing Note -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'billingnote' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleClicktoBillingNote"
                  class="nav-link"
                  to="/billingnote"
                  :disabled="activePage === 'billingnote'"
                  >{{ t("headerBilling") }}</router-link
                >
              </li>
              <!-- Customer -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'customer' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleClicktoCustomer"
                  class="nav-link"
                  to="/customer"
                  :disabled="activePage === 'customer'"
                  >{{ t("headerCustomer") }}</router-link
                >
              </li>
            </div>
            <!-- Product Navigate -->
            <li
              v-if="searchNav === ''"
              class="nav-item"
              @click="toggleSubSidebarProduct"
              :class="{
                active:
                  activePage === 'product' ||
                  activePage === 'stockmanage' ||
                  activePage === 'category',
              }"
            >
              <a class="nav-link sidebar-expanded">
                {{ t("headerProduct") }}
                <i
                  class="bi"
                  :class="isOpenProduct ? 'bi-dash' : 'bi-plus'"
                ></i>
              </a>
            </li>
            <div class="sub-sidebar" v-if="isOpenProduct">
              <!-- Product -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'product' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subProduct"
                  class="nav-link"
                  to="/product"
                  :disabled="activePage === 'product'"
                  >{{ t("headerProduct") }}</router-link
                >
              </li>
              <!-- Stock Manage -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'stockmanage' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subProduct_manageStock"
                  class="nav-link"
                  to="/stockmanage"
                  :disabled="activePage === 'stockmanage'"
                  >{{ t("headerStockManage") }}</router-link
                >
              </li>
              <!-- Category -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'category' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  class="nav-link"
                  @click="subProduct_category"
                  to="/category"
                  :disabled="activePage === 'category'"
                  >{{ t("headerCategory") }}</router-link
                >
              </li>
            </div>
            <!-- Employee Navigate -->
            <li
              v-if="searchNav === '' && userRole != 'SALE'"
              class="nav-item"
              @click="toggleSubSidebarEmp"
              :class="{
                active:
                  activePage === 'employee' ||
                  activePage === 'department' ||
                  activePage === 'position' ||
                  activePage === 'salary',
              }"
            >
              <a class="nav-link sidebar-expanded">
                {{ t("headerEmployee") }}
                <i
                  class="bi"
                  :class="isOpenEmployee ? 'bi-dash' : 'bi-plus'"
                ></i>
              </a>
            </li>
            <div class="sub-sidebar" v-if="isOpenEmployee">
              <!-- Employee -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'employee' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subEmployee"
                  class="nav-link"
                  to="/employee"
                  :disabled="activePage === 'employee'"
                  >{{ t("headerEmployee") }}</router-link
                >
              </li>
              <!-- leave -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'leave' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subLeave"
                  class="nav-link"
                  to="/leave"
                  :disabled="activePage === 'leave'"
                  >{{ t("headerLeave") }}</router-link
                >
              </li>
              <!-- Department -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'department' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subEmployee_department"
                  class="nav-link"
                  to="/department"
                  :disabled="activePage === 'department'"
                  >{{ t("headerDepartment") }}</router-link
                >
              </li>
              <!-- Position -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'position' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subEmployee_position"
                  class="nav-link"
                  to="/position"
                  :disabled="activePage === 'position'"
                  >{{ t("headerPosition") }}</router-link
                >
              </li>
              <!-- Salary -->
              <!-- <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'salary' }"
              >
                <router-link
                  class="nav-link"
                  @click="subEmployee_salary"
                  to="/salary"
                  :disabled="activePage === 'salary'"
                  >{{ t("headerSalary") }}</router-link
                >
              </li> -->
            </div>
            <!-- Report Navigate -->
            <li
              v-if="searchNav === '' && userRole === 'SUPERUSER'"
              class="nav-item"
              @click="toggleSubSidebarReport"
              :class="{
                active:
                  activePage === 'salesreport' ||
                  activePage === 'employeereport',
              }"
            >
              <a class="nav-link sidebar-expanded">
                {{ t("report") }}
                <i class="bi" :class="isOpenReport ? 'bi-dash' : 'bi-plus'"></i>
              </a>
            </li>
            <div class="sub-sidebar" v-if="isOpenReport">
              <!-- Sales report -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'salesreport' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subSalesReport"
                  class="nav-link"
                  to="/salesreport"
                  :disabled="activePage === 'salesreport'"
                  >{{ t("salesreport") }}</router-link
                >
              </li>
              <!-- Employee report -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'employeereport' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subEmployeeReport"
                  class="nav-link"
                  to="/employeereport"
                  :disabled="activePage === 'employeereport'"
                  >{{ t("employeereport") }}</router-link
                >
              </li>
            </div>
            <!-- Administrator Navigate -->
            <li
              v-if="searchNav === '' && userRole === 'SUPERUSER'"
              class="nav-item"
              @click="toggleSubSidebarAdmin"
              :class="{
                active:
                  activePage === 'rolemanage' ||
                  activePage === 'user' ||
                  activePage === 'about',
              }"
            >
              <a class="nav-link sidebar-expanded">
                {{ t("administrator") }}
                <!-- true:false -->
                <i class="bi" :class="isOpenAdmin ? 'bi-dash' : 'bi-plus'"></i>
              </a>
            </li>
            <div class="sub-sidebar" v-if="isOpenAdmin">
              <!-- Role -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'rolemanage' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleAdministrator"
                  class="nav-link"
                  to="/rolemanage"
                  :disabled="activePage === 'rolemanage'"
                  >{{ t("headerRole") }}</router-link
                >
              </li>
              <!-- Add user -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'user' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="subAdmin_register"
                  class="nav-link"
                  to="/user"
                  :disabled="activePage === 'user'"
                  >{{ t("headerManageUSer") }}</router-link
                >
              </li>
              <!-- About Business -->
              <li
                v-if="searchNav === ''"
                class="nav-item"
                :class="{ active: activePage === 'about' }"
                @click="handleSidebarToggleOnMobile"
              >
                <router-link
                  @click="handleAbout"
                  class="nav-link"
                  to="/aboutcompany"
                  :disabled="activePage === 'about'"
                  >{{ t("headerAbout") }}</router-link
                >
              </li>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  </div>
  <div>
    <!-- Popup for change profile -->
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <div class="mb-3 mt-3 div-for-formProfile">
        <label>{{ t("firstname") }}</label>
        <a v-if="isShowingF_name">{{ formDataUser.userF_name }}</a>
        <input
          class="form-control"
          v-if="isEditF_nameMode"
          v-model="formDataUser.userF_name"
          type="text"
          :class="{ error: inputError }"
        />
        <button class="btn btn-outline-secondary" @click="EditF_name">
          <div class="icon-edit"></div>
        </button>
      </div>
      <div class="mb-3 div-for-formProfile">
        <label>{{ t("lastname") }}</label>
        <a v-if="isShowingL_name">{{ formDataUser.userL_name }}</a>
        <input
          class="form-control"
          v-if="isEditL_nameMode"
          v-model="formDataUser.userL_name"
          type="text"
          :class="{ error: inputError }"
        />
        <button class="btn btn-outline-secondary" @click="EditL_name">
          <div class="icon-edit"></div>
        </button>
      </div>
      <div class="mb-3 div-for-formProfile">
        <label>{{ t("phoneNum") }}</label>
        <a v-if="isShowingPhone">{{ formDataUser.userPhone }}</a>
        <input
          class="form-control"
          v-if="isEdituserPhoneMode"
          v-model="formDataUser.userPhone"
          type="text"
          @keypress="validateInput"
          maxlength="10"
          :class="{ error: inputError }"
        />
        <button class="btn btn-outline-secondary" @click="EditPhone">
          <div class="icon-edit"></div>
        </button>
      </div>
      <div class="mb-3 div-for-formProfile">
        <label>{{ t("email") }}</label>
        <a v-if="isShowingEmail">{{ formDataUser.userEmail }}</a>
        <input
          class="form-control"
          v-if="isEdituserEmailMode"
          v-model="formDataUser.userEmail"
          type="text"
          :class="{ error: inputError }"
        />
        <button class="btn btn-outline-secondary" @click="EditEmail">
          <div class="icon-edit"></div>
        </button>
      </div>
      <div class="mb-3 div-for-formProfile">
        <label>{{ t("password") }}</label>
        <a v-if="isShowingPassword">{{ formDataUser.userPassword }}</a>
        <input
          class="form-control"
          v-if="isEdituserPasswordMode"
          v-model="formDataUser.userPassword"
          type="text"
          :class="{ error: inputError }"
        />
        <button class="btn btn-outline-secondary" @click="EditPassword">
          <div class="icon-edit"></div>
        </button>
      </div>
      <div class="mb-3 div-for-formProfile">
        <label>{{ t("role") }}</label>
        <a>{{ getRoleName(formDataUser.RoleID) }}</a>
        <div style="flex: 0.1"><a> </a></div>
      </div>
      <div
        style="display: flex; justify-content: flex-end"
        v-if="
          isEditF_nameMode ||
          isEditL_nameMode ||
          isEdituserPhoneMode ||
          isEdituserEmailMode ||
          isEdituserPasswordMode
        "
      >
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="editUser"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </button>
        <button class="btn btn-outline-secondary" @click="cancelAllEdit">
          {{ t("buttonCancel") }}
        </button>
      </div>
    </Popup>
    <div class="delete-popup">
      <Popup :isOpen="isConfirmPopup" :closePopup="closeConfirmPopup">
        <div class="mb-5">
          <a>{{ t("closeconfirm") }}</a>
        </div>
        <div class="modal-footer">
          <button
            :disabled="isLoading"
            class="btn btn-primary me-3"
            @click="ConfirmClose"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("buttonClose") }}</span>
          </button>
          <button class="btn btn-secondary" @click="closeConfirmPopup">
            {{ t("buttonCancel") }}
          </button>
        </div>
      </Popup>
    </div>
  </div>
  <!-- Popup success message -->
  <div v-if="isPopupVisible" class="popup-success">
    <div class="popup-content-success">
      <a>{{ popupMessage }}</a>
    </div>
  </div>
  <!-- Popup error message -->
  <!-- <div v-if="isPopupVisible_error" class="popup-success">
    <div class="popup-content-error">
      <a>{{ popupMessage_error }}</a>
    </div>
  </div> -->
  <div v-if="isPopupVisible_error" class="popup-error2">
    <div class="text-end">
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="closeErrorPopup"
        style="color: #9f9999"
      ></button>
    </div>
    <div class="popup-content-error2">
      <ul>
        <li v-for="(msg, index) in errorMessages" :key="index">
          {{ msg }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
const token = localStorage.getItem("@accessToken");
const userRoles = localStorage.getItem("RoleName");
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n"; //for switch language
import { watchEffect } from "vue";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");
const userID = localStorage.getItem("user_id");

export default {
  components: {
    Popup,
  },
  // Set up is for loanguage switch
  setup() {
    const { t, locale } = useI18n();

    const setLanguage = (newLang) => {
      locale.value = newLang;
      localStorage.setItem("lang", newLang);
    };

    watchEffect(() => {
      const storedLang = localStorage.getItem("lang");
      if (storedLang) {
        locale.value = storedLang;
      }
    });

    return {
      t,
      setLanguage,
      locale,
    };
  },
  data() {
    return {
      errorMessages: [],
      isSidebarVisible: window.innerWidth >= 992, // เปิดเมนูเมื่อจอใหญ่
      isConfirmPopup: false,
      isEditF_nameMode: false,
      isEditL_nameMode: false,
      isEdituserPhoneMode: false,
      isEdituserEmailMode: false,
      isEdituserPasswordMode: false,
      isShowingF_name: true,
      isShowingL_name: true,
      isShowingPhone: true,
      isShowingEmail: true,
      isShowingPassword: true,
      isPopupVisible_error: false,
      isPopupVisible: false,
      Roles: [],
      Users: [],
      userRole: userRoles,
      isPopupOpen: false,
      searchNav: "",
      filteredNavItems: [],
      isExpanded: false,
      isExpandedLanguage: false,
      userName: [],
      isOpen: false,
      isOpenSale: false,
      isOpenProduct: false,
      isOpenEmployee: false,
      isOpenAdmin: false,
      isOpenReport: false,
      isLoading: false,
      formData: {
        home: "Home",
        expenses: "Expenses",
        quotation: "Quotation",
        invoice: "Invoice",
        taxinvoice: "Tax Invoice",
        billingnote: "Billing Note",
        customer: "Customer",
        product: "Product",
        stock: "Stock Manage",
        category: "Product Category",
        employee: "Employee",
        leave: "Leave",
        department: "Department",
        salary: "Salary Management",
        roleMn: "Role Manage",
        userMn: "User Manage",
        about: "About",
        salesreport: "Sales Report",
        employeereport: "Employee Report",
      },
      formDataBusiness: {
        bus_id: 1,
        bus_name: "",
        bus_address: "",
        bus_website: "",
        bus_tel: "",
        bus_tax: "",
        bus_logo: "",
        bank_name: "",
        bank_account: "",
        bank_number: "",
      },
      formDataUser: {
        ID: "",
        userF_name: "",
        userL_name: "",
        userPhone: "",
        userEmail: "",
        userPassword: "",
        RoleID: "",
      },
      navItems: [
        {
          name: "home",
          displayName: "Home",
          path: "/home",
          displayNameTh: "หน้าหลัก",
        },
        {
          name: "expenses",
          displayName: "Expenses",
          path: "/expenses",
          displayNameTh: "รายจ่าย",
        },
        {
          name: "quotation",
          displayName: "Quotation",
          path: "/quotation",
          displayNameTh: "ใบเสนอราคา",
        },
        {
          name: "invoice",
          displayName: "Invoice",
          path: "/invoice",
          displayNameTh: "ใบวางบิล",
        },
        {
          name: "taxinvoice",
          displayName: "Tax Invoice",
          path: "/taxinvoice",
          displayNameTh: "ใบกํากับภาษี",
        },
        {
          name: "billingnote",
          displayName: "BillingNote",
          path: "/billingnote",
          displayNameTh: "ใบเสร็จรับเงิน",
        },
        {
          name: "customer",
          displayName: "Customer",
          path: "/customer",
          displayNameTh: "บุคคลติดต่อ",
        },
        {
          name: "product",
          displayName: "Product",
          path: "/product",
          displayNameTh: "สินค้าและบริการ",
        },
        {
          name: "stockmanage",
          displayName: "Stock Manage",
          path: "/stockmanage",
          displayNameTh: "จัดการคลังสินค้า",
        },
        {
          name: "category",
          displayName: "Product Category",
          path: "/category",
          displayNameTh: "หมวดหมู่สินค้า",
        },
        {
          name: "employee",
          displayName: "Employee",
          path: "/employee",
          displayNameTh: "พนักงาน",
        },
        {
          name: "leave",
          displayName: "Leave",
          path: "/leave",
          displayNameTh: "จัดการวันลา",
        },
        {
          name: "department",
          displayName: "Department",
          path: "/department",
          displayNameTh: "แผนก",
        },
        {
          name: "position",
          displayName: "Position",
          path: "/position",
          displayNameTh: "จัดการตําแหน่งงาน",
        },
        // {
        //   name: "salary",
        //   displayName: "Salary Management",
        //   path: "/salary",
        //   displayNameTh: "เงินเดือนพนักงาน",
        // },
        {
          name: "rolemanage",
          displayName: "Role Manage",
          path: "/rolemanage",
          displayNameTh: "สิทธิ์ผู้ใช้งาน",
        },
        {
          name: "user",
          displayName: "User Manage",
          path: "/user",
          displayNameTh: "การจัดการผู้ใช้งาน",
        },
        {
          name: "about",
          displayName: "About",
          path: "/aboutcompany",
          displayNameTh: "เกี่ยวกับธุรกิจ",
        },
        {
          name: "salesreport",
          displayName: "Sales Report",
          path: "/salesreport",
          displayNameTh: "รายงานการขาย",
        },
        {
          name: "employeereport",
          displayName: "Sales Report",
          path: "/employeereport",
          displayNameTh: "รายงานพนักงาน",
        },
      ],
    };
  },
  computed: {
    //for filter from search navigate input
    isThaiSearch() {
      return /[\u0E00-\u0E7F]/.test(this.searchNav);
    },
    filteredNavItems() {
      const search = this.searchNav.toLowerCase();
      const isThai = /[\u0E00-\u0E7F]/.test(search); // ตรวจสอบว่าเป็นภาษาไทยหรือไม่

      return this.navItems.filter((item) => {
        if (isThai) {
          return (
            item.displayNameTh &&
            item.displayNameTh.toLowerCase().includes(search)
          );
        } else {
          return (
            item.displayName.toLowerCase().includes(search) ||
            (item.displayNameTh &&
              item.displayNameTh.toLowerCase().includes(search))
          );
        }
      });
    },
    //get role of user from localstorage
    userRole() {
      return localStorage.getItem("RoleName");
    },
    //for chaeck current page
    activePage() {
      const currentPath = this.$route.path;

      if (currentPath === "/home") return "home";
      if (currentPath === "/expenses") return "expenses";
      if (currentPath === "/quotation") return "quotation";
      if (currentPath === "/invoice") return "invoice";
      if (currentPath === "/taxinvoice") return "taxinvoice";
      if (currentPath === "/billingnote") return "billingnote";
      if (currentPath === "/customer") return "customer";
      if (currentPath === "/product") return "product";
      if (currentPath === "/stockmanage") return "stockmanage";
      if (currentPath === "/category") return "category";
      if (currentPath === "/employee") return "employee";
      if (currentPath === "/leave") return "leave";
      if (currentPath === "/department") return "department";
      if (currentPath === "/position") return "position";
      // if (currentPath === "/salary") return "salary";
      if (currentPath === "/rolemanage") return "rolemanage";
      if (currentPath === "/user") return "user";
      if (currentPath === "/aboutcompany") return "about";
      if (currentPath === "/salesreport") return "salesreport";
      if (currentPath === "/employeereport") return "employeereport";
      if (currentPath === "/user") return "user";
    },
  },
  created() {
    this.getBusiness();
    this.checkActiveSubSidebar();
    this.userProfile();
    this.getRole();
    this.getUser();
  },
  mounted() {
    console.log("Sidebar:", this.$refs.sidebar); // ตรวจสอบค่า
  },
  methods: {
    isMobile() {
      return window.innerWidth <= 768; // กำหนดขนาดสำหรับ mobile
    },
    handleSidebarToggleOnMobile() {
      if (this.isMobile()) {
        this.toggleSidebarMenu();
      }
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numbers
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    toggleSidebarMenu() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    updateWidth() {
      this.isSidebarVisible = window.innerWidth >= 992;
    },
    mounted() {
      window.addEventListener("resize", this.updateWidth);
    },
    beforeUnmount() {
      window.removeEventListener("resize", this.updateWidth);
    },
    //validate Email format after @/. must be text
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    //for profile
    ConfirmClose() {
      this.isConfirmPopup = false;
      this.getUser();
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.isShowingF_name = true;
      this.isShowingL_name = true;
      this.isShowingPhone = true;
      this.isShowingEmail = true;
      this.isShowingPassword = true;
      this.isEditF_nameMode = false;
      this.isEditL_nameMode = false;
      this.isEdituserPhoneMode = false;
      this.isEdituserEmailMode = false;
      this.isEdituserPasswordMode = false;
    },
    //close popup profile
    closeConfirmPopup() {
      this.isConfirmPopup = false;
    },
    //action for click edit first name from profile popup
    EditF_name() {
      if (
        this.formDataUser.userL_name === "" ||
        this.formDataUser.userPhone === "" ||
        this.formDataUser.userEmail === "" ||
        this.formDataUser.userPassword === "" ||
        this.formDataUser.RoleID === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isEditF_nameMode = true;
        this.isEditL_nameMode = false;
        this.isEdituserPhoneMode = false;
        this.isEdituserEmailMode = false;
        this.isEdituserPasswordMode = false;
        this.isShowingF_name = false;
        this.isShowingL_name = true;
        this.isShowingPhone = true;
        this.isShowingEmail = true;
        this.isShowingPassword = true;
      }
    },
    //action for click edit last name from profile popup
    EditL_name() {
      if (
        this.formDataUser.userF_name === "" ||
        this.formDataUser.userPhone === "" ||
        this.formDataUser.userEmail === "" ||
        this.formDataUser.userPassword === "" ||
        this.formDataUser.RoleID === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isEditF_nameMode = false;
        this.isEditL_nameMode = true;
        this.isEdituserPhoneMode = false;
        this.isEdituserEmailMode = false;
        this.isEdituserPasswordMode = false;
        this.isShowingF_name = true;
        this.isShowingL_name = false;
        this.isShowingPhone = true;
        this.isShowingEmail = true;
        this.isShowingPassword = true;
      }
    },
    //action for click edit phone from profile popup
    EditPhone() {
      if (
        this.formDataUser.userF_name === "" ||
        this.formDataUser.userL_name === "" ||
        this.formDataUser.userEmail === "" ||
        this.formDataUser.userPassword === "" ||
        this.formDataUser.RoleID === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isEditF_nameMode = false;
        this.isEditL_nameMode = false;
        this.isEdituserPhoneMode = true;
        this.isEdituserEmailMode = false;
        this.isEdituserPasswordMode = false;
        this.isShowingF_name = true;
        this.isShowingL_name = true;
        this.isShowingPhone = false;
        this.isShowingEmail = true;
        this.isShowingPassword = true;
      }
    },
    //action for click edit email from profile popup
    EditEmail() {
      if (
        this.formDataUser.userF_name === "" ||
        this.formDataUser.userL_name === "" ||
        this.formDataUser.userPhone === "" ||
        this.formDataUser.userPassword === "" ||
        this.formDataUser.RoleID === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isEditF_nameMode = false;
        this.isEditL_nameMode = false;
        this.isEdituserPhoneMode = false;
        this.isEdituserEmailMode = true;
        this.isEdituserPasswordMode = false;
        this.isShowingF_name = true;
        this.isShowingL_name = true;
        this.isShowingPhone = true;
        this.isShowingEmail = false;
        this.isShowingPassword = true;
      }
    },
    //action for click edit password from profile popup
    EditPassword() {
      if (
        this.formDataUser.userF_name === "" ||
        this.formDataUser.userL_name === "" ||
        this.formDataUser.userPhone === "" ||
        this.formDataUser.userEmail === "" ||
        this.formDataUser.RoleID === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else if (!this.validateEmail(this.formDataUser.userEmail)) {
        this.inputError = true;
        this.showPopup_error("Invalid email format");
      } else {
        this.inputError = false;
        this.isEditF_nameMode = false;
        this.isEditL_nameMode = false;
        this.isEdituserPhoneMode = false;
        this.isEdituserEmailMode = false;
        this.isEdituserPasswordMode = true;
        this.isShowingF_name = true;
        this.isShowingL_name = true;
        this.isShowingPhone = true;
        this.isShowingEmail = true;
        this.isShowingPassword = false;
      }
    },
    //action of cancel button
    cancelAllEdit() {
      this.getUser();
      this.inputError = false;
      this.isEditF_nameMode = false;
      this.isEditL_nameMode = false;
      this.isEdituserPhoneMode = false;
      this.isEdituserEmailMode = false;
      this.isEdituserPasswordMode = false;
      this.isShowingF_name = true;
      this.isShowingL_name = true;
      this.isShowingPhone = true;
      this.isShowingEmail = true;
      this.isShowingPassword = true;
    },
    //open popup profile
    openPopup() {
      this.isExpanded = false;
      this.isExpandedLanguage = false;
      this.getUser();
      this.isPopupOpen = true;
      this.inputError = false;
      this.isShowingF_name = true;
      this.isShowingL_name = true;
      this.isShowingPhone = true;
      this.isShowingEmail = true;
      this.isShowingPassword = true;
      this.isEditF_nameMode = false;
      this.isEditL_nameMode = false;
      this.isEdituserPhoneMode = false;
      this.isEdituserEmailMode = false;
      this.isEdituserPasswordMode = false;
    },
    //close popup edit profile
    closePopup() {
      if (
        this.isEditF_nameMode === true ||
        this.isEditL_nameMode === true ||
        this.isEdituserPhoneMode === true ||
        this.isEdituserEmailMode === true ||
        this.isEdituserPasswordMode === true
      ) {
        this.isConfirmPopup = true;
      } else {
        this.isConfirmPopup = false;
        this.inputError = false;
        this.getUser();
        this.isPopupOpen = false;
        this.isAddingMode = false;
        this.isEditMode = false;
        this.isShowingF_name = true;
        this.isShowingL_name = true;
        this.isShowingPhone = true;
        this.isShowingEmail = true;
        this.isShowingPassword = true;
        this.isEditF_nameMode = false;
        this.isEditL_nameMode = false;
        this.isEdituserPhoneMode = false;
        this.isEdituserEmailMode = false;
        this.isEdituserPasswordMode = false;
        this.inputError = false;
      }
      this.isPopupVisible_error = false;
    },
    //set popup success
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // 5 seconds
    },
    //set popup error
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // 2 seconds
    },
    //action toggle for dropdown logout/open profile popup
    toggleDropdown() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        console.log("expanded");
        this.isExpandedLanguage = false;
      } else {
        console.log("Not expanded");
      }
    },
    //action toggle for dropdown change language
    toggleLanguage(lang) {
      if (lang === "EN") {
        this.setLanguage("th");
        localStorage.setItem("language", "th");
      } else {
        this.setLanguage("th");
        localStorage.setItem("language", "th");
      }
      //   this.isExpandedLanguage = !this.isExpandedLanguage;
      //   if (this.isExpandedLanguage) {
      //     console.log("expanded Lang");
      //     this.isExpanded = false;
      //   } else {
      //     console.log("Not expanded Lang");
      //   }
    },
    //check active sub sidebar for expanded sidebar
    checkActiveSubSidebar() {
      switch (this.activePage) {
        case "home":
          this.isOpenSale = false;
          this.isOpenProduct = false;
          this.isOpenEmployee = false;
          this.isOpenAdmin = false;
          break;
        case "expenses":
          this.isOpenSale = false;
          this.isOpenProduct = false;
          this.isOpenEmployee = false;
          this.isOpenAdmin = false;
          break;
        case "quotation":
          this.isOpenSale = true;
          break;
        case "invoice":
          this.isOpenSale = true;
          break;
        case "taxinvoice":
          this.isOpenSale = true;
          break;
        case "billingnote":
          this.isOpenSale = true;
          break;
        case "customer":
          this.isOpenSale = true;
          break;
        case "product":
          this.isOpenProduct = true;
          break;
        case "stockmanage":
          this.isOpenProduct = true;
          break;
        case "category":
          this.isOpenProduct = true;
          break;
        case "employee":
          this.isOpenEmployee = true;
          break;
        case "leave":
          this.isOpenEmployee = true;
          break;
        case "department":
          this.isOpenEmployee = true;
          break;
        case "position":
          this.isOpenEmployee = true;
          break;
          // case "salary":
          //   this.isOpenEmployee = true;
          break;
        case "rolemanage":
          this.isOpenAdmin = true;
          break;
        case "user":
          this.isOpenAdmin = true;
          break;
        case "about":
          this.isOpenAdmin = true;
          break;
        case "salesreport":
          this.isOpenReport = true;
          break;
        case "employeereport":
          this.isOpenReport = true;
          break;
        default:
          break;
      }
    },
    //get username from localStorage
    userProfile() {
      this.userName = localStorage.getItem("user_name");
    },
    Logout() {
      localStorage.removeItem("@accessToken");
      localStorage.removeItem("userRole");
      console.log("Logout success" + token);
      this.$router.push("/login");
    },
    //toggle for expaded sub sidebar
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    toggleSubSidebarProduct() {
      this.isOpenProduct = !this.isOpenProduct;
      if (this.isOpenProduct) {
        this.isOpenSale = false; // หุบ Product
        this.isOpenAdmin = false;
        this.isOpenEmployee = false;
        this.isOpenReport = false;
      }
    },
    toggleSubSidebarSale() {
      this.isOpenSale = !this.isOpenSale;
      if (this.isOpenSale) {
        this.isOpenProduct = false; // หุบ Product
        this.isOpenAdmin = false;
        this.isOpenEmployee = false;
        this.isOpenReport = false;
      }
    },
    toggleSubSidebarEmp() {
      this.isOpenEmployee = !this.isOpenEmployee;
      if (this.isOpenEmployee) {
        this.isOpenProduct = false; // หุบ Product
        this.isOpenAdmin = false;
        this.isOpenSale = false;
        this.isOpenReport = false;
      }
    },
    toggleSubSidebarAdmin() {
      this.isOpenAdmin = !this.isOpenAdmin;
      if (this.isOpenAdmin) {
        this.isOpenProduct = false; // หุบ Product
        this.isOpenEmployee = false;
        this.isOpenSale = false;
        this.isOpenReport = false;
      }
    },
    toggleSubSidebarReport() {
      this.isOpenReport = !this.isOpenReport;
      if (this.isOpenReport) {
        this.isOpenProduct = false; // หุบ Product
        this.isOpenEmployee = false;
        this.isOpenSale = false;
        this.isOpenAdmin = false;
      }
    },
    //handle to each page
    handleClicktoHome() {
      this.activePage = "home";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/home");
    },
    handleClicktoExpenses() {
      this.activePage = "expenses";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/expenses");
    },
    handleClicktoQuotation() {
      this.activePage = "quotation";
      this.isOpenSale = true;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/quotation");
    },
    handleClicktoInvoice() {
      this.activePage = "invoice";
      this.isOpenSale = true;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/invoice");
    },
    handleClicktoTaxInvoice() {
      this.activePage = "taxinvoice";
      this.isOpenSale = true;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/taxinvoice");
    },
    handleClicktoBillingNote() {
      this.activePage = "billingnote";
      this.isOpenSale = true;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/billingnote");
    },
    handleClicktoCustomer() {
      this.activePage = "customer";
      this.isOpenSale = true;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/customer");
    },
    handleAdministrator() {
      this.activePage = "rolemanage";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = true;
      this.isOpenReport = false;
      this.$router.push("/rolemanage");
    },
    handleAbout() {
      this.activePage = "aboutcompany";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = true;
      this.isOpenReport = false;
      this.$router.push("/aboutcompany");
    },
    subProduct() {
      this.activePage = "product";
      this.isOpenSale = false;
      this.isOpenProduct = true;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/product");
    },
    subProduct_category() {
      this.activePage = "category";
      this.isOpenSale = false;
      this.isOpenProduct = true;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/category");
    },
    subProduct_manageStock() {
      this.activePage = "stockmanage";
      this.isOpenSale = false;
      this.isOpenProduct = true;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/stockmanage");
    },
    subEmployee() {
      this.activePage = "employee";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = true;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/employee");
    },
    subLeave() {
      this.activePage = "employee";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = true;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/leave");
    },
    subSalesReport() {
      this.activePage = "salesreport";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = true;
      this.$router.push("/salesreport");
    },
    subEmployeeReport() {
      this.activePage = "employeereport";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = false;
      this.isOpenReport = true;
      this.$router.push("/employeereport");
    },
    subEmployee_department() {
      this.activePage = "department";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = true;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/department");
    },
    subEmployee_position() {
      this.activePage = "position";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = true;
      this.isOpenAdmin = false;
      this.isOpenReport = false;
      this.$router.push("/position");
    },
    // subEmployee_salary() {
    //   this.activePage = "salary";
    //   this.isOpenSale = false;
    //   this.isOpenProduct = false;
    //   this.isOpenEmployee = true;
    //   this.isOpenAdmin = false;
    //   this.isOpenReport = false;
    //   this.$router.push("/salary");
    // },
    subAdmin_register() {
      this.activePage = "user";
      this.isOpenSale = false;
      this.isOpenProduct = false;
      this.isOpenEmployee = false;
      this.isOpenAdmin = true;
      this.isOpenReport = false;
      this.$router.push("/user");
    },
    //get Role name from roleID
    getRoleName(roleID) {
      const role = this.Roles.find((r) => r.RoleID === roleID);
      return role ? role.RoleName : "Unknown";
    },
    //get data of business
    async getBusiness() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!accessToken) {
        console.error("JWT token is missing");
      }
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/Quotation/getBusinessByID`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.statusCode === 200 && json.data) {
          this.formDataBusiness = {
            bus_name: json.data.business.bus_name || "",
            bus_address: json.data.business.bus_address || "",
            bus_website: json.data.business.bus_website || "",
            bus_tel: json.data.business.bus_tel || "",
            bus_tax: json.data.business.bus_tax || "",
            bus_logo: json.data.business.bus_logo || "",
            bank_name:
              json.data.business.banks && json.data.business.banks[0]
                ? json.data.business.banks[0].bank_name
                : "",
            bank_account:
              json.data.business.banks && json.data.business.banks[0]
                ? json.data.business.banks[0].bank_account
                : "",
            bank_number:
              json.data.business.banks && json.data.business.banks[0]
                ? json.data.business.banks[0].bank_number
                : "",
          };
        } else {
          console.log("No data found:", json);
          this.showPopup_error("No data found"); // call popup error
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    //getrole of user
    async getRole() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/auth/GetRole`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Roles = json.data;
        } else {
          this.showPopup_error(json.data); // call popup error
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getUser() {
      const userID = localStorage.getItem("user_id");
      this.getRole();
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/auth/GetUserByID/${userID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.formDataUser = {
            ID: json.data.userID,
            userF_name: json.data.userF_name,
            userL_name: json.data.userL_name,
            userPhone: json.data.userPhone,
            userEmail: json.data.userEmail,
            userPassword: json.data.userPassword,
            RoleID: json.data.role.RoleID,
          };
          this.userName = this.formDataUser.userF_name;
        } else {
          this.showPopup_error(json.data); // call popup error
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async validateFormData() {
      const errorMessages = [];

      // รีเซ็ตค่าว่าง
      this.isEmpty = {
        userF_name: false,
        userL_name: false,
        userPhone: false,
        userEmail: false,
        userPassword: false,
      };

      // ตรวจชื่อจริง
      if (this.formDataUser.userF_name.trim() === "") {
        this.isEmpty.userF_name = true;
        errorMessages.push(this.$t("validation.F_name"));
      }

      // ตรวจนามสกุล
      if (this.formDataUser.userL_name.trim() === "") {
        this.isEmpty.userL_name = true;
        errorMessages.push(this.$t("validation.L_name"));
      }

      // ตรวจเบอร์โทร
      const phone = this.formDataUser.userPhone.trim();
      if (phone === "") {
        this.isEmpty.userPhone = true;

        errorMessages.push(this.$t("validation.userPhone"));
      } else if (!/^\d{9,10}$/.test(phone)) {
        this.isEmpty.userPhone = true;
        errorMessages.push(this.$t("validation.cus_tel_length"));
      }

      // ตรวจอีเมล
      const email = this.formDataUser.userEmail.trim();
      if (email === "") {
        this.isEmpty.userEmail = true;

        errorMessages.push(this.$t("validation.cus_email"));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.isEmpty.userEmail = true;
        errorMessages.push(this.$t("validation.cus_email2"));
      }

      // ตรวจรหัสผ่าน
      const password = this.formDataUser.userPassword;
      if (password === "") {
        this.isEmpty.userPassword = true;
        errorMessages.push(this.$t("validation.userPassword"));
      }

      if (password.length < 12) {
        this.isEmpty.userPassword = true;
        errorMessages.push(this.$t("validation.password_min_length"));
      }
      if (!/\d/.test(password)) {
        this.isEmpty.userPassword = true;
        errorMessages.push(this.$t("validation.password_number"));
      }
      if (password.toLowerCase() === password) {
        this.isEmpty.userPassword = true;
        errorMessages.push(this.$t("validation.password_uppercase"));
      }
      if (password.toUpperCase() === password) {
        this.isEmpty.userPassword = true;
        errorMessages.push(this.$t("validation.password_lowercase"));
      }

      // แสดง popup หากมี error
      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        return false;
      }

      return true;
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages; // เก็บข้อความใน errorMessages
        this.isPopupVisible_error = true;
      } else {
        this.showPopup_error(messages);
      }
    },
    async editUser() {
      //check empty input
      // if (
      //   this.formDataUser.userF_name === "" ||
      //   this.formDataUser.userL_name === "" ||
      //   this.formDataUser.userPhone === "" ||
      //   this.formDataUser.userEmail === "" ||
      //   this.formDataUser.userPassword === "" ||
      //   this.formDataUser.RoleID === ""
      // ) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill data"); // call popup error
      //   //check phone number
      // } else if (this.formDataUser.userPhone.length !== 10) {
      //   this.inputError = true;
      //   this.showPopup_error("Phone number must be 10 digits"); // call popup error
      //   //check Email
      // } else if (!this.validateEmail(this.formDataUser.userEmail)) {
      //   this.inputError = true;
      //   this.showPopup_error("Invalid email format"); // call popup error
      // } else {
      if (!(await this.validateFormData())) return;
      this.isEditF_nameMode = false;
      this.isEditL_nameMode = false;
      this.isEdituserPhoneMode = false;
      this.isEdituserEmailMode = false;
      this.isEdituserPasswordMode = false;
      this.inputError = false;
      this.isLoading = true; //call loading
      const userIds = this.formDataUser.ID;
      const accessToken = localStorage.getItem("@accessToken"); // get token from local storage
      try {
        const response = await fetch(`${API_CALL}/auth/EditUsers/${userIds}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userF_name: this.formDataUser.userF_name,
            userL_name: this.formDataUser.userL_name,
            userPhone: this.formDataUser.userPhone,
            userEmail: this.formDataUser.userEmail.toLowerCase().trim(),
            userPassword: this.formDataUser.userPassword,
            RoleID: this.formDataUser.RoleID,
          }),
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          this.userName = this.formDataUser.userF_name;

          console.log("Saved Profile");
          this.showPopup("Saved Profile");
          this.getUser();
          this.isShowingF_name = true;
          this.isShowingL_name = true;
          this.isShowingPhone = true;
          this.isShowingEmail = true;
          this.isShowingPassword = true;
        } else {
          this.showPopup_error(json.data);
          console.log("edit category error", json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false; //close loading
      }
    },
  },
  // },
};
</script>

<style>
/* ตั้งค่าขนาดและตำแหน่งของ Sidebar */
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #f8f9fa;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateX(-100%);
}

/* เมื่อ Sidebar ถูกเปิด */
.sidebar.open {
  transform: translateX(0);
}

/* ปรับปุ่ม Toggle */
.toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}
</style>
