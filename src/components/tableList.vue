<template>
  <div>
    <div class="table-contain table-responsive table-form">
      <table class="table table-bordered table-striped">
        <thead>
          <tr class="text-nowrap">
            <!-- Column checkbox -->
            <th
              v-if="columnforCheckbox"
              style="min-width: 60px !important"
            ></th>
            <th style="min-width: 60px !important">
              {{ t("NumberHeaderTable") }}
            </th>

            <!-- คอลัมน์แก้ไข ลบ -->
            <th
              style="min-width: 100px !important"
              v-if="columnEditAndDelete || columnforManage"
            ></th>
            <!-- คอลัมน์ส่งออก -->
            <th style="min-width: 100px !important" v-if="columnforExport"></th>

            <!-- หัวตารางอื่นๆ -->
            <th v-for="header in tableHeaders" :key="header.key">
              {{ header.label }}
              <div class="dropdown d-inline">
                <button
                  @click="sortBy(header.key)"
                  class="btn btn-link icon-sort"
                  type="button"
                ></button>
              </div>
            </th>

            <!-- <th
              style="min-width: 100px !important"
              v-if="columnEditAndDelete || columnforManage"
            ></th>
            <th style="min-width: 100px !important" v-if="columnforExport"></th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-if="!paginatedItems || paginatedItems.length === 0">
            <td :colspan="totalColspan" class="text-center text-muted py-4">
              {{ documentName }}
            </td>
          </tr>

          <tr v-else v-for="(item, index) in paginatedItems" :key="index">
            <!-- Column checkbox -->
            <td class="align-middle" v-if="columnforCheckbox">
              <input type="checkbox" id="checkbox" @click="selectItem(item)" />
            </td>

            <!-- Column number of row  -->
            <td class="align-middle">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>

            <!-- Column handle edit and delete button -->

            <td class="align-middle button-table" v-if="columnEditAndDelete">
              <div class="icon-table">
                <span
                  v-if="item.showAllowButton"
                  class="mdi mdi-check-circle-outline"
                  @click="handleAllow(item)"
                  style="margin-right: 10px !important; cursor: pointer"
                ></span>
                <div class="icon-edit me-4" @click="handleEdit(item)"></div>
                <div
                  v-if="item.showAllowButton || showAllowButton"
                  class="icon-delete"
                  @click="handleDelete(item)"
                ></div>
              </div>
            </td>

            <!-- Column manage button -->
            <td class="align-middle button-table" v-if="columnforManage">
              <button
                class="btn btn-outline-secondary"
                @click="handleManage(item)"
              >
                {{ t("managerbtn") }}
              </button>
            </td>

            <!-- Column preview and export button -->
            <td v-if="columnforExport" class="align-middle button-table">
              <div class="icon-table">
                <div
                  class="icon-preview me-4"
                  @click="handlePreview(item)"
                ></div>
                <div class="icon-download" @click="handleExport(item)"></div>
              </div>
            </td>

            <!-- คอลัมน์ข้อมูลอื่นๆ -->
            <td
              class="align-middle"
              v-for="(column, colIndex) in visibleColumns"
              :key="colIndex"
            >
              <!-- Column for Image -->
              <div v-if="column.value === 'productImg'" class="image-table">
                <img
                  v-if="isImageURL(item[column.value])"
                  :src="item[column.value]"
                  style="max-width: 100px; max-height: 100px"
                />
              </div>
              <div
                v-else-if="column.value === 'Employee Name'"
                @click="handleNameClick(item)"
              >
                <a class="name-clickable" style="cursor: pointer">
                  {{ item[column.value] }}
                </a>
              </div>
              <!-- Column for Data table -->
              <div v-else :class="getStatusClass(item[column.value])">
                {{ item[column.value] }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-start" style="padding-top: 5px">
        {{ t("pagenationShow") }}
        <a
          style="margin: 0 10px"
          href="#"
          v-for="option in rowsPerPageOptions"
          :key="option"
          :class="{ active: option === itemsPerPage, 'ng-star-inserted': true }"
          @click="setItemsPerPage(option)"
        >
          {{ option }}
        </a>
      </div>
    </div>
    <div class="footer">
      <!-- Pagination -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="prevPage"
              aria-label="Previous"
            >
              <span aria-hidden="true">{{ t("Previous") }}</span>
            </a>
          </li>
          <li
            class="page-item"
            v-for="pageNumber in totalPages"
            :key="pageNumber"
            :class="{ active: pageNumber === currentPage }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="goToPage(pageNumber)"
              >{{ pageNumber }}</a
            >
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="nextPage"
              aria-label="Next"
            >
              <span aria-hidden="true">{{ t("Next") }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import Popup from "../components/popup.vue";
import { useI18n } from "vue-i18n";

export default {
  props: {
    showAllowButton: {
      type: Boolean,
      default: false,
    },
    initialTableData: {
      type: Array,
      required: true,
    },
    tableHeaders: {
      type: Array,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 5,
    },
    documentName: {
      type: String,
      default: "เอกสาร",
    },
    columnEditAndDelete: Boolean,
    columnforManage: Boolean,
    columnforCheckbox: Boolean,
    columnforExport: Boolean,
  },
  //set language
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  components: {
    Popup,
  },
  computed: {
    totalColspan() {
      let count = this.tableHeaders.length;

      if (this.columnforCheckbox) count += 1; // สำหรับ checkbox
      count += 1; // คอลัมน์ลำดับ

      if (this.columnEditAndDelete) count += 1;
      if (this.columnforManage) count += 1;
      if (this.columnforExport) count += 1;

      return count;
    },
    totalPages() {
      return Math.ceil(this.tableData.length / this.itemsPerPage);
    },
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.tableData.slice(startIndex, endIndex);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tableData.slice(start, end);
    },
    //for check key data
    hasVisibleColumns() {
      for (let column of this.visibleColumns) {
        if (!this.shouldHideColumn(column.value)) {
          return true;
        }
      }
      return false;
    },
    // visibleColumns() {
    //   return Object.keys(this.tableData[0])
    //     .filter((key) => !this.shouldHideColumn(key))
    //     .map((key) => ({ label: key, value: key }));
    // },
    visibleColumns() {
      if (!this.tableData || this.tableData.length === 0) {
        // ถ้าไม่มีข้อมูล ให้คืนค่าเป็นอาเรย์ว่าง
        return [];
      }

      return Object.keys(this.tableData[0])
        .filter((key) => !this.shouldHideColumn(key))
        .map((key) => ({ label: key, value: key }));
    },
  },
  methods: {
    getStatusClass(status) {
      if (typeof status !== "string") return "";

      const orangeKeywords = [
        "ยังไม่มีใบวางบิล",
        "Invoice not Issued",
        "ยังไม่มีใบกํากับภาษี",
        "Tax Invoice not Issued",
        "ยังไม่มีใบเสร็จรับเงิน",
        "Receipt not Issued",
      ];

      const greenKeywords = [
        "สร้างใบวางบิลแล้ว",
        "Invoice Issued",
        "สร้างใบกํากับภาษีแล้ว",
        "Tax Invoice Issued",
        "สร้างใบเสร็จรับเงินแล้ว",
        "Receipt Issued",
      ];

      const redKeywords = ["Not Active", "เกินกําหนด", "expired"];

      // เช็คว่า status มีคำใดคำหนึ่งใน orangeKeywords
      if (orangeKeywords.some((keyword) => status.includes(keyword))) {
        return "orange-text";
      }

      // เช็คว่า status มีคำใดคำหนึ่งใน greenKeywords
      if (greenKeywords.some((keyword) => status.includes(keyword))) {
        return "green-text";
      }

      if (redKeywords.some((keyword) => status.includes(keyword))) {
        return "red-text";
      }

      return "";
    },
    setItemsPerPage(option) {
      this.itemsPerPage = option; // อัปเดตค่า itemsPerPage ใน component นี้
      this.currentPage = 1; // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนจำนวนแถว
    },
    handleNameClick(item) {
      this.$emit("employee-name-clicked", item); // ส่ง event กลับไปยัง parent
    },
    //sort data table
    sortBy(key) {
      this.sortByKey = key;
      this.sortDesc = !this.sortDesc;
      this.showSortedItems();
    },
    showSortedItems() {
      const sortedArray = [...this.tableData];
      if (this.sortByKey) {
        sortedArray.sort((a, b) => {
          const modifier = this.sortDesc ? 1 : -1;
          const valueA = a[this.sortByKey];
          const valueB = b[this.sortByKey];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return valueA.localeCompare(valueB) * modifier;
          } else if (typeof valueA === "number" && typeof valueB === "number") {
            return (valueA - valueB) * modifier;
          } else {
            return 0; // ไม่เป็นไปตามเงื่อนไข ไม่ต้องเรียงลำดับ
          }
        });
      }
      this.tableData = sortedArray;
    },
    //Pagination
    //set to go page
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
    },
    //set to go prev page
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    //set to go next page
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    openPopup() {
      this.isPopupOpen = true;
    },
    closePopup() {
      this.isPopupOpen = false;
    },
    data() {
      return {
        isPopupOpen: false,
      };
    },
    sortByID() {
      this.tableData.sort((a, b) => a.ID - b.ID); // เรียงตาม ID
    },
    //button edit
    handleEdit(item) {
      const index = this.tableData.findIndex((i) => i.ID === item.ID);
      if (index !== -1) {
        this.tableData.splice(index, 1, item); // อัพเดต row ที่ถูกแก้ไข
      }
      this.sortByID(); // เรียงข้อมูลตาม ID หลังจากอัพเดต
      this.$emit("handleEdit", item);
    },
    //button delete
    handleDelete(item) {
      this.$emit("handleDelete", item);
    },
    handleAllow(item) {
      this.$emit("handleAllow", item);
    },
    //button manage
    handleManage(item) {
      this.$emit("handleManage", item);
    },
    //button preview
    handlePreview(item) {
      this.$emit("handlePreview", item);
    },
    //button export
    handleExport(item) {
      this.$emit("handleExport", item);
    },
    //for checkbox each table
    selectItem(item) {
      this.$emit("selectItem", item);
    },
    //set image url for show within table
    isImageURL(url) {
      return url && (url.startsWith("http://") || url.startsWith("https://"));
    },
    //function for hide column in table table
    shouldHideColumn(value) {
      const columnsToHide = [
        "billing_id",
        "productID",
        "transaction_id",
        "invoice_id",
        "cus_id",
        "employeeID",
        "sale_id",
        "productForms",
        "Employee ID",
        "ID",
        "categoryID",
        "productTypeID",
        "PositionID",
        "departmentID",
      ]; // เปลี่ยนเป็นชื่อคอลัมน์ที่ต้องการซ่อน
      return columnsToHide.includes(value);
    },
    toggleDropdown(key) {
      if (!this.dropdownVisible[key]) {
        // ถ้า dropdown ยังไม่มีค่า ให้กำหนดเป็น true
        this.$data.dropdownVisible = { ...this.dropdownVisible, [key]: true };
      } else {
        // ถ้ามีค่าอยู่แล้ว ให้กำหนดเป็น false
        this.$data.dropdownVisible = { ...this.dropdownVisible, [key]: false };
      }
    },

    // ฟังก์ชันสำหรับ sort ข้อมูล
    sortData(key, direction) {
      this.sortColumn = key;
      this.sortDirection = direction;

      this.tableData.sort((a, b) => {
        let modifier = direction === "asc" ? 1 : -1;
        if (typeof a[key] === "string" && typeof b[key] === "string") {
          return a[key].localeCompare(b[key]) * modifier;
        } else if (typeof a[key] === "number" && typeof b[key] === "number") {
          return (a[key] - b[key]) * modifier;
        }
        return 0;
      });

      this.toggleDropdown(key); // ปิด dropdown หลังจากเลือกเสร็จ
    },
  },
  data() {
    return {
      isPopupOpen: false,
      currentPage: 1,
      tableData: this.initialTableData,
      dropdownVisible: {},
      sortColumn: "",
      sortDirection: "asc",
      rowsPerPageOptions: [20, 50, 100], // ตัวเลือกจำนวนแถว
      itemsPerPage: 10, // ค่าเริ่มต้นสำหรับจำนวนแถวที่แสดง
      currentPage: 1, // ค่าเริ่มต้นของหน้าปัจจุบัน
    };
  },
  //watch if data change
  watch: {
    initialTableData(newData) {
      this.tableData = newData;
      this.sortByID();
    },
  },
  //call function when loading page
  created() {
    this.tableData = this.initialTableData.slice();
    this.sortByID();
    this.setItemsPerPage(20);
    // this.sortBy('ID');
  },
};
</script>

<style>
.orange-text {
  color: orange;
}
.green-text {
  color: green;
}
.red-text {
  color: rgb(255, 0, 0);
}
</style>
