<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body page-category">
      <div class="mb-4">
        <h2>{{ t("headerCategory") }}</h2>
      </div>
      <!-- <div class="add-btn mb-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control me-3 custome-search-css"
          style="width: 20%"
          :placeholder="$t('Search')"
        />
        <a class="btn btn-success" @click="openPopup">{{ t("addCategory") }}</a>
      </div> -->
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <div class="col-6 col-sm-6 col-md-9 col-lg-9">
          <a
            class="btn btn-success size-font-sm float-right"
            @click="openPopup"
            >{{ t("addCategory") }}</a
          >
        </div>
      </div>
      <div>
        <CategoryList
          :initialTableData="filteredCategories"
          :tableHeaders="tableHeaders"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="Categories && Categories.length > 0"
          :isLoading="isLoading"
          :showAllowButton="true"
        />
      </div>
      <div
        v-if="isLoading"
        class="d-flex justify-content-center align-items-center"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
  <div>
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <h2 v-if="isAddingMode">{{ t("headerPopupAddCategory") }}</h2>
      <h2 v-if="isEditMode">{{ t("headerPopupEditCategory") }}</h2>
      <div class="add-btn mb-3">
        <div>{{ this.category_file.name }}</div>
        <input
          type="file"
          id="fileInput"
          @change="handleFileUpload"
          class="hidden"
        />
      </div>
      <div class="mb-3">
        <label class="col-sm-5 col-md-6 mb-3"><span style="color: red">*</span>{{ t("categoryName") }}</label>
        <input
          class="form-control"
          v-model="formData.categoryName"
          type="text"
          id="input-text"
          required
          maxlength="30"
          :class="{ error: isEmpty.categoryName }"
        />
      </div>
      <div class="modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addCategory"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonAdd") }}</span>
        </button>
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isEditMode"
          @click="editCategory"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </button>
        <button class="btn btn-secondary" @click="closePopup">
          {{ t("buttonCancel") }}
        </button>
      </div>
    </Popup>
    <div class="delete-popup">
      <Popup
        :isOpen="isDeleteConfirmPopupOpen"
        :closePopup="closeDeleteConfirmPopup"
      >
        <div class="mb-5">
          <a>{{ t("deleteConfirmSentence") }}</a>
        </div>
        <div class="modal-footer">
          <button
            :disabled="isLoading"
            class="btn btn-danger me-3"
            @click="deleteCategory"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>{{ t("buttonDelete") }}</span>
          </button>
          <button class="btn btn-secondary" @click="closeDeleteConfirmPopup">
            Cancel {{ t("") }}
          </button>
        </div>
      </Popup>
    </div>
    <div v-if="isPopupVisible" class="popup-success">
      <div class="popup-content-success">
        <a>{{ popupMessage }}</a>
      </div>
    </div>
    <!-- <div v-if="isPopupVisible_error" class="popup-success">
      <div class="popup-content-error">
        <h3>{{ $t("validate_popupError") }}</h3>
        <ul>
          <li v-for="(msg, index) in errorMessages" :key="index">{{ msg }}</li>
        </ul>
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
  </div>
</template>

<script>
import Navigate from "../components/Navigation.vue";
import CategoryList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "ProductCategory",
  components: {
    Navigate,
    CategoryList,
    Popup,
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      errorMessages: [],
      category_file: "",
      isPopupVisible_error: false,
      Categories: [],
      isPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isLoading: false,
      isPopupVisible: false,
      inputValue: "",
      inputError: false,
      formData: {
        categoryID: "",
        categoryName: "",
      },
      isEmpty: {
        categoryID: "",
        categoryName: "",
      },
      searchQuery: "",
    };
  },
  computed: {
    tableHeaders() {
      return [
        { label: this.t("categoryNameHeaderTable"), key: "Category Name" },
      ];
    },
    filteredCategories() {
      // กรองข้อมูล Categories โดยเปรียบเทียบกับ searchQuery
      if (this.searchQuery.trim()) {
        return this.Categories.filter((category) =>
          category["Category Name"]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }
      return this.Categories; // ถ้าไม่มีการค้นหาแสดงทั้งหมด
    },
  },
  methods: {
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    validateFormData() {
      // ตั้งค่า isEmpty ของทุกฟิลด์เป็น false ก่อนเริ่มการตรวจสอบ
      this.isEmpty.categoryName = false;

      const errorMessages = [];

      if (this.formData.categoryName === "") {
        this.isEmpty.categoryName = true;
        errorMessages.push(this.$t("validation.categoryName"));
      }
      const isDuplicateName = this.Categories.some(
        (item) =>
          item["Category Name"].trim() === this.formData.categoryName.trim() &&
          item.ID !== this.formData.categoryID // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      );
      if (isDuplicateName) {
        this.isEmpty.categoryName = true;
        errorMessages.push(this.$t("validation.duplicatecategoryName"));
      }

      if (errorMessages.length > 0) {
        this.showPopup_validate(errorMessages);
        return false;
      } else {
        return true;
      }
    },
    showPopup_validate(messages) {
      if (Array.isArray(messages)) {
        this.errorMessages = messages; // เก็บข้อความใน errorMessages
        // this.showErrorPopup = true; // แสดง Popup
        this.isPopupVisible_error = true;
        // setTimeout(() => {
        //   this.isPopupVisible_error = false; // ซ่อน Popup หลังจากหน่วงเวลา
        // }, 3000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
      } else {
        this.showPopup_error(messages);
      }
    },
    // This function handles the file upload process.
    // It assigns the uploaded file to `category_file`.
    handleFileUpload(event) {
      this.category_file = event.target.files[0];
      console.log("Selected file:", this.category_file.name);
    },

    // Opens the popup for adding a new category.
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
    },

    // Closes the popup and resets form data.
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        categoryID: "",
        categoryName: "",
      };
      this.category_file = "";
      this.inputError = false;
      this.isPopupVisible_error = false;
    },

    // Closes the delete confirmation popup.
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
    },

    // This function opens the edit popup and populates the form with the selected item's data.
    handleEdit(item) {
      console.log("Edit item:", item);
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formData = {
        categoryID: item.ID,
        categoryName: item["Category Name"],
      };
    },

    // This function triggers the delete confirmation popup for the selected category.
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        categoryID: item.ID,
      };
    },

    // Displays a popup with a success message for 2 seconds.
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000);
    },

    // Displays a popup with an error message for 2 seconds.
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible_error = false;
      }, 2000);
    },

    // This function handles the process of importing categories from a file via an API call.
    // It sends the file to the server and updates the category list upon success.
    async importCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const formDataFile = new FormData();
        formDataFile.append("file", this.category_file);

        const response = await fetch(`${API_CALL}/migrate/importcsv`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataFile,
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getProductCategory();
          console.log("Category imported successfully");
          this.category_file = "";
        } else {
          console.log("Import category error:", json);
        }
      } catch (error) {
        console.error("Error importing category:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Fetches the list of categories from the server and updates the `Categories` array.
    async getProductCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/getCategory`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Categories = json.data.map((item) => ({
            ID: item.categoryID,
            "Category Name": item.categoryName,
          }));
          console.log(json);
        } else {
          this.showPopup_error(json.data);
          console.log(this.Categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // This function adds a new category via an API call. It validates the input and then
    // makes a POST request. If successful, the category list is updated.
    async addCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessages = [];
      this.isLoading = true;
      // if (this.formData.categoryName === "") {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill data");
      // } else {
      //   this.inputError = false;
      //   this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/product/Addcategory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            categoryName: this.formData.categoryName,
          }),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getProductCategory();
          this.showPopup(this.$t("validation.AddSucc"));
          this.formData = {
            categoryID: "",
            categoryName: "",
          };
        } else {
          this.showPopup_error(json.data);
          console.log("Add category error", json);
        }
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        this.isLoading = false;
        this.isPopupOpen = false;
      }
      // }
    },

    // This function edits an existing category via an API call. It sends a PUT request with the updated data.
    async editCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateFormData())) return;
      this.errorMessages = [];
      this.isLoading = true;
      // if (this.formData.categoryName === "") {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill data");
      // } else {
      //   this.inputError = false;
      //   this.isLoading = true;
      const categoryID = this.formData.categoryID;
      try {
        const response = await fetch(
          `${API_CALL}/product/EditCategory/${categoryID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              categoryName: this.formData.categoryName,
            }),
          }
        );
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getProductCategory();
          this.showPopup(this.$t("validation.EditSucc"));
          this.closePopup();
        } else {
          this.showPopup_error(json.data);
          console.log("Edit category error", json);
        }
      } catch (error) {
        console.error("Error editing category:", error);
      } finally {
        this.isLoading = false;
        this.isPopupOpen = false;
      }
      // }
    },

    // This function deletes a category via an API call. It sends a DELETE request and removes the category from the list.
    async deleteCategory() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const categoryID = this.formData.categoryID;
      let errorMessages = [];
      try {
        const response = await fetch(
          `${API_CALL}/product/DeleteCategory/${categoryID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Categories = this.Categories.filter(
            (item) => item.categoryID !== categoryID
          );
          this.getProductCategory();
          this.showPopup(this.$t("validation.DelateSucc"));
          this.closeDeleteConfirmPopup();
        } else {
          // alert(json.data);
          errorMessages.push(json.data);
          this.showPopup_validate(errorMessages);
          console.log("Delete category error", json);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        this.isLoading = false;
        this.isPopupOpen = false;
      }
    },
  },
  // Fetch categories when the component is created
  created() {
    this.getProductCategory();
  },
};
</script>
