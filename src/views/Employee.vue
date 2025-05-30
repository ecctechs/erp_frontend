<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <Navigate /> -->
    <div class="page-body">
      <div class="mb-4">
        <h2>{{ t("headerEmployee") }}</h2>
      </div>
      <div class="row mb-3">
        <div class="col-4 col-sm-4 col-md-2 col-lg-2">
          <!-- <select
            class="form-control form-select size-font-sm"
            v-model="formData.status"
          >
            <option
              v-for="status in [...new Set(employees.map((emp) => emp.status))]"
              :key="status"
              :value="status"
            >
              {{ t(status === "active" ? "statusActive" : "statusNotActive") }}
            </option>
          </select> -->
          <select
            class="form-control form-select size-font-sm"
            v-model="dropDownStatus"
            aria-label="Status select"
            hidden
          >
            <option value="">{{ t("filter") }}</option>
            <option value="active">{{ t("statusActive") }}</option>
            <option value="not_active">{{ t("statusNotActive") }}</option>
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-5 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <!-- <div class="col-1 col-sm-1 col-md-7 col-lg-7"></div> -->
        <div class="col-7 col-sm-6 col-md-9 col-lg-9 text-end">
          <a
            class="btn btn-success me-3 size-font-sm me-2"
            @click="openPopup"
            >{{ t("addEmployee") }}</a
          >
          <button
            class="btn btn-outline-secondary mdi mdi-export-variant size-font-sm"
            @click="exportEmployee"
          ></button>
        </div>
      </div>
      <!-- <div class="top-table-for-filter">
        <div class="col-sm-3">
          <select class="form-control form-select" v-model="formData.status">
            <option
              v-for="status in [...new Set(employees.map((emp) => emp.status))]"
              :key="status"
              :value="status"
            >
              {{ t(status === "active" ? "statusActive" : "statusNotActive") }}
            </option>
          </select>
        </div>
        <div class="add-btn mb-3" style="flex: 1">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control me-3"
            style="width: 20%"
            :placeholder="$t('Search')"
          />
          <a class="btn btn-success me-3" @click="openPopup">{{
            t("addEmployee")
          }}</a>
          <button class="btn btn-outline-secondary" @click="exportEmployee">
            Export
          </button>
        </div>
      </div> -->
      <div class="show-only-desktop">
        <employeeList
          :initialTableData="filteredEmp"
          :tableHeaders="tableHeaders"
          :columnEditAndDelete="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          v-if="employees"
          :isLoading="isLoading"
          :documentName="documentName"
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
      <!-- <div class="mb-4">
        <h2>{{ t("manageLeave") }}</h2>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <label class="me-1 size-font-sm">{{ t("month") }}</label>
          <select
            v-model="selectedMonthFilter"
            class="me-3 form-control form-select size-font-sm"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="month in months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
        </div>
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <label class="me-1 size-font-sm">{{ t("year") }}</label>
          <select
            v-model="selectedYearFilter"
            class="me-3 form-control form-select size-font-sm"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6 col-sm-6 col-md-3 col-lg-3">
          <input
            v-model="searchQueryLeave"
            type="text"
            class="form-control me-3 size-font-sm"
            :placeholder="$t('Search')"
          />
        </div>
        <div class="col-1 col-sm-1 col-md-7 col-lg-7"></div>
        <div class="col-5 col-sm-5 col-md-2 col-lg-2 text-end">
          <button class="btn btn-primary size-font-sm" @click="openPopupLeave">
            {{ t("manageLeave") }}
          </button>
        </div>
      </div> -->
      <!-- <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <label class="me-1">{{ t("month") }}</label>
          <select
            v-model="selectedMonthFilter"
            class="me-3 form-control form-select"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="month in months" :value="month" :key="month">
              {{ month }}
            </option>
          </select>
          <label class="me-1">{{ t("year") }}</label>
          <select
            v-model="selectedYearFilter"
            class="me-3 form-control form-select"
            :class="{ error: inputError } + ' form-control'"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="d-flex align-items-center">
          <input
            v-model="searchQueryLeave"
            type="text"
            class="form-control me-3"
            style="width: 200px"
            placeholder="Search..."
          /> -->
      <!-- <button class="btn btn-outline-secondary me-2" @click="exportSalary">
            Export
          </button> -->
      <!-- <button class="btn btn-primary" @click="openPopupLeave">
            {{ t("manageLeave") }}
          </button>
        </div>
      </div> -->
      <!-- <div class="card-body-detail">
        <div style="display: flex; flex-direction: column; width: 100%">
          <div
            class="add-btn mb-3"
            style="
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
            "
          ></div>
          <div style="height: auto; overflow-x: auto">
            <employeeList
              :initialTableData="filteredleave"
              :tableHeaders="tableHeadersLeave"
              :columnEditAndDelete="true"
              @handleEdit="openPopupLeaveEdit"
              @handleDelete="handleDeleteLeave"
              v-if="Leaving && Leaving.length > 0"
              :isLoading="isLoading"
            />
          </div>
        </div>
      </div> -->
    </div>
  </div>
  <div>
    <Popup :isOpen="isPopupOpen" :closePopup="closePopup">
      <div class="mb-3">
        <h2 v-if="isAddingMode">{{ t("headerPopupAddEmployee") }}</h2>
        <h2 v-if="isEditMode">{{ t("headerPopupEditEmployee") }}</h2>
      </div>
      <h5 style="text-decoration: underline">{{ t("employeeInformation") }}</h5>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("title") }}</label
        >
        <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formData.title"
          required
          :class="{ error: isEmpty.title }"
        >
          <option value="Mr.">{{ t("mister") }}</option>
          <option value="Mrs.">{{ t("missis") }}</option>
          <option value="Miss">{{ t("miss") }}</option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("firstname") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.F_name"
          type="text"
          required
          :class="{ error: isEmpty.F_name }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("lastname") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.L_name"
          type="text"
          required
          :class="{ error: isEmpty.L_name }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <div class="col-6 col-sm-6 col-md-6">
          <label class="col-sm-6 col-md-6"
            ><span style="color: red">*</span>{{ t("birthdate") }}</label
          >
        </div>
        <div class="col-6 col-sm-6 col-md-6">
          <!-- <DatePicker
            v-model:value="formData.Birthdate"
            format="DD/MM/YYYY"
            value-type="date"
            placeholder="DD/MM/YYYY"
            class="form-control"
            :formatter="momentFormat"
            :lang="currentLocale"
            :disabled-date="disabledBeforeToday"
            :class="{ error: isEmpty.Birthdate }"
          /> -->
          <v-date-picker
            v-model="formData.Birthdate"
            locale="th-TH"
            :format="formatDatePicker"
          >
            <template v-slot="{ inputEvents }">
              <input
                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                :value="formatDatePicker(formData.Birthdate)"
                v-on="inputEvents"
                placeholder="เลือกวันที่"
                style="width: 100%"
              />
            </template>
          </v-date-picker>
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("address") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Address"
          type="text"
          required
          :class="{ error: isEmpty.Address }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("phoneNum") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Phone_num"
          type="text"
          required
          :class="{ error: isEmpty.Phone_num }"
          @keypress="validateInput"
          maxlength="10"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("NID") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.NID_num"
          type="text"
          required
          :class="{ error: isEmpty.NID_num }"
          @keypress="validateInput"
          maxlength="13"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("email") }}</label
        >
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Email"
          type="text"
          required
          :class="{ error: isEmpty.Email }"
        />
      </div>
      <h5 style="text-decoration: underline">{{ t("headerAboutJob") }}</h5>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("empType") }}</label
        >
        <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formData.employeeType"
          required
          :class="{ error: isEmpty.employeeType }"
        >
          <option value="Full-time">{{ t("fulltime") }}</option>
          <option value="Part-time">{{ t("parttime") }}</option>
          <option value="Contract">{{ t("contract") }}</option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("department") }}</label
        >
        <div class="col-sm-9 col-md-6">
          <select
            class="form-control form-select"
            v-model="formData.departmentID"
            :disabled="Departments.length === 0"
            :class="{ error: isEmpty.departmentID || Departments.length === 0 }"
            style="width: 100%"
          >
            <option
              v-for="employ in Departments"
              :key="employ.departmentID"
              :value="employ.departmentID"
            >
              {{ employ.departmentName }}
            </option>
          </select>

          <!-- แสดงข้อความใต้ select -->
          <div v-if="Departments.length === 0" class="text-danger mt-1">
            {{ t("pleaseDepartment") }}
          </div>
        </div>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6"
          ><span style="color: red">*</span>{{ t("position") }}</label
        >
        <div class="col-sm-9 col-md-6">
          <select
            class="form-control form-select"
            v-model="formData.PositionID"
            required
            :disabled="Positions.length === 0"
            :class="{ error: isEmpty.PositionID || Positions.length === 0 }"
            style="width: 100%"
          >
            <option
              v-for="employ in Positions"
              :key="employ.PositionID"
              :value="employ.PositionID"
            >
              {{ employ.Position }}
            </option>
          </select>
          <!-- แสดงข้อความใต้ select -->
          <div v-if="Positions.length === 0" class="text-danger mt-1">
            {{ t("pleasePosition") }}
          </div>
        </div>
      </div>
      <!-- <div class="mb-3 div-for-formControl" v-if="isEditMode">
        <label class="col-sm-5 col-md-6">{{ t("position") }}</label>
        <div class="col-sm-9 col-md-6">
          <select
            class="form-control col-sm-9 col-md-6 form-select"
            v-model="formData.PositionID"
            required
            :disabled="Positions.length === 0"
            :class="{ error: isEmpty.PositionID }"
            style="width: 100%"
          >
            <option
              v-for="employ in Positions"
              :key="employ.PositionID"
              :value="employ.PositionID"
            >
              {{ employ.Position }}
            </option>
          </select> -->

      <!-- แสดงข้อความใต้ select -->
      <!-- <div v-if="Positions.length === 0" class="text-danger mt-1">
            {{ t("pleasePosition") }}
          </div>
        </div> -->
      <!-- </div> -->
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("salary") }}</label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.Salary"
          type="text"
          required
          :class="{ error: isEmpty.Salary }"
          @keypress="validateInput"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <div class="col-6 col-sm-6 col-md-6">
          <label class="col-sm-6 col-md-6">{{ t("startWorking") }}</label>
        </div>
        <!-- <input id="date-input" class="form-control col-sm-9 col-md-6" v-model="formData.start_working_date" type="date" required :class="{ 'error': inputError }"> -->
        <div class="col-6 col-sm-6 col-md-6">
          <!-- <DatePicker
            v-model:value="formData.start_working_date"
            format="DD/MM/YYYY"
            value-type="date"
            placeholder="DD/MM/YYYY"
            class="form-control"
            :formatter="momentFormat"
            :lang="currentLocale"
            :disabled-date="disabledBeforeToday"
            :class="{ error: isEmpty.start_working_date }"
          ></DatePicker> -->
          <v-date-picker
            v-model="formData.start_working_date"
            locale="th-TH"
            :format="formatDatePicker"
          >
            <template v-slot="{ inputEvents }">
              <input
                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                :value="formatDatePicker(formData.start_working_date)"
                v-on="inputEvents"
                placeholder="เลือกวันที่"
                style="width: 100%"
              />
            </template>
          </v-date-picker>
        </div>
      </div>
      <h5 style="text-decoration: underline">{{ t("headerAboutBank") }}</h5>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("bankname") }}</label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.bankName"
          type="text"
          required
          :class="{ error: isEmpty.bankName }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("bankaccount") }}</label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formData.bankAccountID"
          type="text"
          required
          :class="{ error: isEmpty.bankAccountID }"
          maxlength="15"
          @keypress="validateInput"
        />
      </div>
      <div class="mb-3 modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          v-if="isAddingMode"
          @click="addEmployee"
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
          @click="editEmployee"
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
    <Popup :isOpen="isPopupOpenLeave" :closePopup="closePopupLeave">
      <div class="mb-3">
        <h2>จัดการวันลา</h2>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("empname") }}</label>
        <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formDataLeave.employeeID"
          type="text"
          required
          :class="{ error: isEmpty.employeeID }"
        >
          <option
            v-for="employ in employeesSalaries"
            :key="employ.ID"
            :value="employ.ID"
          >
            {{ employ.Name }}
          </option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("leavetype") }}</label>
        <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formDataLeave.detail"
          type="text"
          required
          :class="{ error: isEmpty.detail }"
        >
          <option>ลาป่วย</option>
          <option>ลากิจ</option>
          <option>ลาพักร้อน</option>
          <option>ลาครอด</option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-6 col-sm-6 col-md-6">{{ t("date") }}</label>
        <div class="row">
          <div class="col-md-5">
            <DatePicker
              v-model:value="formDataLeave.date"
              format="DD/MM/YYYY"
              value-type="date"
              placeholder="DD/MM/YYYY"
              class="form-control"
              :class="{ error: isEmpty.date }"
              :formatter="momentFormat"
              :lang="currentLocale"
            />
          </div>
          -
          <div class="col-md-5">
            <DatePicker
              v-model:value="formDataLeave.dateEnd"
              format="DD/MM/YYYY"
              value-type="date"
              placeholder="DD/MM/YYYY"
              class="form-control"
              :class="{ error: isEmpty.dateEnd }"
              :formatter="momentFormat"
              :lang="currentLocale"
            />
          </div>
        </div>
      </div>
      <div class="mb-3 modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="AddLeave"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </button>
        <button class="btn btn-secondary" @click="closePopupLeave">
          {{ t("buttonCancel") }}
        </button>
      </div>
    </Popup>
    <Popup :isOpen="isPopupOpenOvertime" :closePopup="closePopupOvertime">
      <div class="mb-3">
        <h2>จัดการการทำงานล่วงเวลา</h2>
      </div>

      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("empname") }}</label>
        <select
          class="form-control col-sm-9 col-md-6 form-select"
          v-model="formDataOvertime.employeeID"
          type="text"
          required
          :class="{ error: inputError }"
        >
          <option
            v-for="employ in employeesSalaries"
            :key="employ.ID"
            :value="employ.ID"
          >
            {{ employ.Name }}
          </option>
        </select>
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("quotationRemark") }}</label>
        <textarea
          class="col-sm-5 col-md-6 label-textarea"
          v-model="formDataOvertime.detail"
          type="text"
          required
          :class="{ error: inputError }"
          maxlength="255"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">{{ t("date") }}</label>
        <DatePicker
          v-model:value="formDataOvertime.date"
          format="DD/MM/YYYY"
          value-type="date"
          placeholder="DD/MM/YYYY"
          class="form-control"
          :class="{ error: inputError }"
        />
      </div>
      <div class="mb-3 div-for-formControl">
        <label class="col-sm-5 col-md-6">จำนวนชั่วโมง: </label>
        <input
          class="form-control col-sm-9 col-md-6"
          v-model="formDataOvertime.hours"
          type="text"
          required
          :class="{ error: inputError }"
        />
      </div>

      <div class="mb-3 modal-footer">
        <button
          :disabled="isLoading"
          class="btn btn-primary me-3"
          @click="AddOvertime"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>{{ t("buttonSave") }}</span>
        </button>
        <button class="btn btn-secondary" @click="closePopupOvertime">
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
        <div class="modal-footer mb-5">
          <button class="btn btn-danger me-2" @click="deleteEmployee">
            {{ t("buttonDelete") }}
          </button>
          <button class="btn btn-secondary" @click="closeDeleteConfirmPopup">
            {{ t("buttonCancel") }}
          </button>
        </div>
      </Popup>
    </div>
    <div class="delete-popup">
      <Popup
        :isOpen="isDeleteLeaveConfirmPopupOpen"
        :closePopup="closeDeleteLeaveConfirmPopup"
      >
        <div class="mb-5">
          <a>{{ t("deleteConfirmSentence") }}</a>
        </div>
        <div class="modal-footer mb-5">
          <button class="btn btn-danger me-2" @click="deleteLeave">
            {{ t("buttonDelete") }}
          </button>
          <button
            class="btn btn-secondary"
            @click="closeDeleteLeaveConfirmPopup"
          >
            {{ t("buttonCancel") }}
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
    <!-- <div v-if="isPopupVisible_error2" class="popup-success">
      <div class="popup-content-error">
        <h3>{{ $t("validate_popupError") }}</h3>
        <ul>
          <li v-for="(msg, index) in errorMessages2" :key="index">{{ msg }}</li>
        </ul>
      </div>
    </div> -->
    <div v-if="isPopupVisible_error2" class="popup-error2">
      <div class="text-end">
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closeErrorPopup2"
          style="color: #9f9999"
        ></button>
      </div>
      <div class="popup-content-error2">
        <ul>
          <li v-for="(msg, index) in errorMessages2" :key="index">
            {{ msg }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import Navigate from "../components/Navigation.vue";
import employeeList from "../components/tableList.vue";
import Popup from "../components/popup.vue";
import { config } from "../../constant.js";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useI18n } from "vue-i18n";
import th from "vue-datepicker-next/locale/th.es";
import en from "vue-datepicker-next/locale/en.es";
import moment from "moment";

// var today = new Date().toISOString().split('T')[0];
// document.getElementById("date-input").setAttribute("max", today);

const API_CALL = config["url"];
// const API_CALL = 'https://erp-backend-9w1r.onrender.com'
const accessToken = localStorage.getItem("@accessToken");
export default {
  name: "Employee",
  components: {
    Navigate,
    employeeList,
    Popup,
    DatePicker,
  },
  setup() {
    const { t } = useI18n();
    const { locale } = useI18n(); // ดึงค่า locale จาก i18n
    const lang = computed(() => t("lang"));
    // const currentLocale = computed(() => (locale.value === "th" ? th : en));
    const currentLocale = computed(() => {
      return {
        ...(locale.value === "th" ? th : en), // ✅ ใช้ค่าจาก locale ปัจจุบัน
        yearFormat:
          locale.value === "en" ? moment().year() : moment().year() + 543, // ✅ แปลงปี พ.ศ. หรือ ค.ศ.
      };
    });

    const momentFormat = computed(() => ({
      // 📌 Date → String (แสดงผลเป็น พ.ศ. ถ้าภาษาเป็นไทย)
      stringify: (date) => {
        if (!date) return "";
        const yearOffset = lang.value === "en" ? 543 : 0; // ✅ ตรวจสอบภาษาผ่าน computed
        return moment(date).add(yearOffset, "years").format("DD/MM/YYYY");
      },
      // 📌 String → Date (แปลงกลับเป็น ค.ศ. ถ้าภาษาเป็นไทย)
      parse: (value) => {
        if (!value) return null;
        const yearOffset = lang.value === "en" ? 543 : 0;
        return moment(value, "DD/MM/YYYY")
          .subtract(yearOffset, "years")
          .toDate();
      },
      // 📌 ใช้ moment คำนวณเลขสัปดาห์ (ถ้าจำเป็น)
      getWeek: (date) => {
        return moment(date).week();
      },
    }));

    // ✅ รายการเดือนแบบสองภาษา (อังกฤษ - ไทย)
    const monthList = {
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      th: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
    };

    // ✅ Computed สำหรับเปลี่ยนรายการเดือนตามภาษาที่เลือก
    const months = computed(() => monthList[locale.value] || monthList.en);

    const documentName = computed(() => t("dontHaveEmployee"));

    return {
      momentFormat,
      currentLocale,
      months,
      t,
      lang,
      documentName,
    };
  },
  data() {
    return {
      dropDownStatus: "active",
      errorMessages: [],
      errorMessages2: [],
      isPopupVisible_error: false,
      isPopupVisible_error2: false,
      isPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isDeleteLeaveConfirmPopupOpen: false,
      isPopupOpenLeave: false,
      isPopupOpenOvertime: false,
      isEditMode: false,
      EditIdLeaveHandle: "",
      employees: [],
      Departments: [],
      Positions: [],
      selectedMonthFilter: [],
      selectedYearFilter: [],
      isLoading: false,
      isPopupVisible: false,
      inputValue: "",
      inputError: false,
      Leaving: [],
      Overtimes: [],
      employeesSalaries: [],
      leaving_id: "",
      formData: {
        employeeID: "",
        title: "",
        F_name: "",
        L_name: "",
        Address: "",
        Birthdate: new Date(),
        NID_num: "",
        Phone_num: "",
        Email: "",
        departmentID: "",
        PositionID: "",
        start_working_date: new Date(),
        Salary: "",
        employeeType: "",
        bankName: "",
        bankAccountID: "",
        positions: "",
        status: "active",
      },
      isEmpty: {
        employeeID: "",
        title: "",
        F_name: "",
        L_name: "",
        Address: "",
        Birthdate: "",
        NID_num: "",
        Phone_num: "",
        Email: "",
        departmentID: "",
        PositionID: "",
        start_working_date: "",
        Salary: "",
        employeeType: "",
        bankName: "",
        bankAccountID: "",
        positions: "",
        status: "active",
      },
      formDataLeave: {
        ID: "",
        employeeID: "",
        detail: "",
        date: "",
        dateEnd: "",
      },
      isEmpty: {
        ID: "",
        employeeID: "",
        detail: "",
        date: "",
        dateEnd: "",
      },
      formDataOvertime: {
        ID: "",
        employeeID: "",
        detail: "",
        date: "",
        hours: "",
      },
      years: this.generateYears(1900, 2100), // Generates a list of years from 1900 to 2100
      // months: [
      //   "January",
      //   "February",
      //   "March",
      //   "April",
      //   "May",
      //   "June",
      //   "July",
      //   "August",
      //   "September",
      //   "October",
      //   "November",
      //   "December",
      // ], // List of months for selection
      searchQuery: "",
      searchQueryLeave: "",
    };
  },
  computed: {
    tableHeaders() {
      return [
        { label: this.t("titleHeaderTable"), key: "Title" },
        { label: this.t("employeeNameFirstandLastHeaderTable"), key: "Name" },
        { label: this.t("addressHeaderTable"), key: "Address" },
        { label: this.t("birthdateHeaderTable"), key: "Birthdate" },
        { label: this.t("NIDHeaderTable"), key: "National ID" },
        { label: this.t("telHeaderTable"), key: "Tel." },
        { label: this.t("emailHeaderTable"), key: "Email" },
        {
          label: this.t("startworkingdateHeaderTable"),
          key: "Start Working Date",
        },
        { label: this.t("salaryHeaderTable"), key: "Salary" },
        { label: this.t("emptypeHeaderTable"), key: "Emp. type" },
        { label: this.t("bankNameHeaderTable"), key: "Bank Name" },
        { label: this.t("bankaccHeaderTable"), key: "Bank Account ID" },
        { label: this.t("departNameHeaderTable"), key: "Department" },
        { label: this.t("positionHeaderTable"), key: "Position" },
        { label: this.t("onlystatusHeaderTable"), key: "status" },
      ];
    },
    tableHeadersLeave() {
      return [
        { label: this.t("employeeNameFirstandLastHeaderTable"), key: "Name" },
        { label: this.t("productDetailHeaderTable"), key: "detail" },
        { label: this.t("datepaysalaryHeaderTable"), key: "date" },
        { label: this.t("dateEnd"), key: "dateEnd" },
      ];
    },
    tableHeadersOvertime() {
      return [
        {
          label: this.t("employeeNameFirstandLastHeaderTable"),
          key: "employeeID",
        },
        { label: this.t("productDetailHeaderTable"), key: "detail" },
        { label: this.t("datepaysalaryHeaderTable"), key: "date" },
        { label: this.t("hours"), key: "hours" },
      ];
    },
    filteredEmp() {
      let filteredEmployees = [...this.employees];
      console.log("filteredEmployees");
      console.log(filteredEmployees);

      const monthMapping = {
        Jan: "ม.ค.",
        Feb: "ก.พ.",
        Mar: "มี.ค.",
        Apr: "เม.ย.",
        May: "พ.ค.",
        Jun: "มิ.ย.",
        Jul: "ก.ค.",
        Aug: "ส.ค.",
        Sep: "ก.ย.",
        Oct: "ต.ค.",
        Nov: "พ.ย.",
        Dec: "ธ.ค.",
      };

      const titleMapping = {
        Miss: "นางสาว",
        "Mr.": "นาย",
        "Mrs.": "นาง", // หรือ "นางสาว" ตามที่คุณต้องการ
      };
      // กรองตามสถานะ
      // if (this.formData.status) {
      //   filteredEmployees = filteredEmployees.filter(
      //     (emp) =>
      //       emp.status.toLowerCase() === this.formData.status.toLowerCase()
      //   );
      // }
      if (this.t("headerLang") === "TH") {
        // แปลง invoice_date ให้เป็นชื่อเดือนภาษาไทย
        console.log("filteredEmployees++", filteredEmployees);
        filteredEmployees = filteredEmployees.map((emp) => ({
          ...emp,
          Birthdate: emp.Birthdate
            ? String(emp.Birthdate)
                .replace(
                  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
                  (match) => monthMapping[match]
                )
                .replace(/(\d{4})/, (match) =>
                  (parseInt(match) + 543).toString()
                )
            : "", // ✅ ถ้า null หรือ undefined ให้เป็นค่าว่าง
          ["Start Working Date"]: String(emp["Start Working Date"])
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match] // ✅ แปลงชื่อเดือนเป็นไทย
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()), // ✅ เพิ่มปี ค.ศ. + 543 (เป็น พ.ศ.)

          Title: titleMapping[emp.Title] || emp.Title,
        }));
      }

      // กรองตามการค้นหาชื่อ
      if (this.searchQuery.trim()) {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp["Name"]
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            emp["Position"]
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );
      }
      filteredEmployees.forEach((cus) => {
        const lang = this.t("headerLang");

        if (lang === "TH") {
          if (cus.status === "Active" || cus.status === "active") {
            cus.status = "เปิดใช้งาน";
          } else if (
            cus.status === "Not Active" ||
            cus.status === "not active"
          ) {
            cus.status = "ปิดใช้งาน";
          }
        } else {
          // กรณีภาษาอังกฤษหรือภาษาอื่นๆ อยากแสดงกลับเป็น status เดิม (กรณีมีการแปลงไปแล้ว)
          if (cus.status === "เปิดใช้งาน" || cus.status === "active") {
            cus.status = "Active";
          } else if (
            cus.status === "ปิดใช้งาน" ||
            cus.status === "not active"
          ) {
            cus.status = "Not Active";
          }
        }
      });

      if (this.dropDownStatus === "active") {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.status.toLowerCase() === "active" ||
            emp.status.toLowerCase() === "เปิดใช้งาน"
        );
      } else if (this.dropDownStatus === "not_active") {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.status.toLowerCase() === "not active" ||
            emp.status.toLowerCase() === "ปิดใช้งาน"
        );
      }

      return filteredEmployees; // คืนค่าข้อมูลที่ผ่านการกรองแล้ว
    },
    filteredleave() {
      let filteredLeaving = [...this.Leaving];

      // กรองตามการค้นหาชื่อ
      if (this.searchQueryLeave.trim()) {
        filteredLeaving = filteredLeaving.filter((emp) =>
          emp["Name"]
            .toLowerCase()
            .includes(this.searchQueryLeave.toLowerCase())
        );
      }

      if (this.t("headerLang") === "TH") {
        const monthMapping = {
          Jan: "ม.ค.",
          Feb: "ก.พ.",
          Mar: "มี.ค.",
          Apr: "เม.ย.",
          May: "พ.ค.",
          Jun: "มิ.ย.",
          Jul: "ก.ค.",
          Aug: "ส.ค.",
          Sep: "ก.ย.",
          Oct: "ต.ค.",
          Nov: "พ.ย.",
          Dec: "ธ.ค.",
        };
        // แปลง invoice_date ให้เป็นชื่อเดือนภาษาไทย
        filteredLeaving = filteredLeaving.map((sale) => ({
          ...sale,
          date: String(sale.date)
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()), // ✅ เพิ่มปี ค.ศ. + 543 (เป็น พ.ศ.),

          dateEnd: String(sale.dateEnd)
            .replace(
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,
              (match) => monthMapping[match]
            )
            .replace(/(\d{4})/, (match) => (parseInt(match) + 543).toString()), // ✅ เพิ่มปี ค.ศ. + 543 (เป็น พ.ศ.),
        }));
      }

      // if (
      //   this.selectedYearFilter.toString() !== "" &&
      //   this.selectedMonthFilter.toString() !== ""
      // ) {
      //   const selectedMonthShort = monthMap[this.selectedMonthFilter];
      //   filteredLeaving = filteredLeaving.filter(
      //     (data) =>
      //       data["date"]?.toString().includes(this.selectedYearFilter) &&
      //       data["date"]?.toString().includes(selectedMonthShort)
      //   );
      // } else if (this.selectedYearFilter.toString() !== "") {
      //   filteredLeaving = filteredLeaving.filter((data) =>
      //     data["date"]?.toString().includes(this.selectedYearFilter)
      //   );
      // }

      return filteredLeaving; // คืนค่าข้อมูลที่ผ่านการกรองแล้ว
    },
  },
  methods: {
    formatDatePicker(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;

      return `${day}/${month}/${buddhistYear}`; // 🔸 แสดงเป็น พ.ศ.
    },
    closeErrorPopup() {
      this.isPopupVisible_error = false;
    },
    closeErrorPopup2() {
      this.isPopupVisible_error2 = false;
    },
    generateYears(start, end) {
      const years = [];
      for (let year = start; year <= end; year++) {
        years.push(year);
      }
      return years;
    },
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numbers
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    //validate Email format after @/. must be text
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    // disabledBeforeToday(date) {
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);

    //   return date > today;
    // },
    disabledBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let inputDate = new Date(date);

      // ตรวจสอบว่าปีเป็น พ.ศ. หรือไม่ (ถ้ามากกว่า 2500 แสดงว่าเป็น พ.ศ.)
      if (inputDate.getFullYear() > 2500) {
        inputDate.setFullYear(inputDate.getFullYear() - 543); // แปลง พ.ศ. เป็น ค.ศ.
      }

      return inputDate > today;
    },
    openPopup() {
      this.isPopupOpen = true;
      this.isAddingMode = true;
      this.isEditMode = false;
      const currentDate = new Date();

      this.formData.Birthdate =
        this.t("lang") === "en"
          ? new Date(
              new Date(currentDate).setFullYear(currentDate.getFullYear())
            )
          : currentDate;

      this.formData.start_working_date =
        this.t("lang") === "en"
          ? new Date(
              new Date(currentDate).setFullYear(currentDate.getFullYear())
            )
          : currentDate;
    },
    openPopupLeave() {
      this.isPopupOpenLeave = true;
      this.isEditMode = false;
      const currentDate = new Date();

      this.formDataLeave.date =
        this.t("lang") === "en"
          ? new Date(
              new Date(currentDate).setFullYear(currentDate.getFullYear())
            )
          : currentDate;

      this.formDataLeave.dateEnd = (() => {
        let newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1); // เพิ่ม 1 วัน

        if (this.t("lang") === "en") {
          newDate.setFullYear(newDate.getFullYear()); // ถ้าเป็นภาษาอังกฤษให้ +543 ปี
        }
        return newDate;
      })();
    },
    openPopupLeaveEdit(item) {
      console.log(item);
      this.isPopupOpenLeave = true;
      this.isEditMode = true;
      this.EditIdLeaveHandle = item.ID;

      this.formDataLeave.ID = item.ID;
      const employee = this.employees.find((emp) => emp.Name === item.Name);
      this.formDataLeave.employeeID = employee.ID;
      this.formDataLeave.detail = item.detail;

      // const formatDateForPicker = (date) => {
      //   if (!date) return null;
      //   const d = new Date(date);
      //   if (isNaN(d.getTime())) return null; // Check if the date is valid
      //   return d;
      // };
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง

        // 🔹 ถ้าภาษาเป็น "th" (ไทย) ให้เพิ่ม 543 ปี
        if (this.t("lang") === "en") {
          d.setFullYear(d.getFullYear());
        }

        return d;
      };

      const filteredLevea = this.Leaving.filter((emp) => emp.ID === item.ID);

      // const formattedDateStart = formatDateForPicker(item["date"]);
      // const formattedDateEnd = formatDateForPicker(item["dateEnd"]);

      const formattedDateStart = formatDateForPicker(filteredLevea[0]["date"]);
      const formattedDateEnd = formatDateForPicker(filteredLevea[0]["dateEnd"]);

      this.formDataLeave.date = formattedDateStart;
      this.formDataLeave.dateEnd = formattedDateEnd;
    },
    openPopupOvertime() {
      this.isPopupOpenOvertime = true;
    },
    closePopup() {
      this.isPopupOpen = false;
      this.isAddingMode = false;
      this.isEditMode = false;
      this.formData = {
        employeeID: "",
        title: "",
        F_name: "",
        L_name: "",
        Address: "",
        Birthdate: "",
        NID_num: "",
        Phone_num: "",
        Email: "",
        departmentID: "",
        PositionID: "",
        start_working_date: "",
        Salary: "",
        employeeType: "",
        bankName: "",
        bankAccountID: "",
        positions: "",
        status: "",
      };

      this.isEmpty.title = false;
      this.isEmpty.F_name = false;
      this.isEmpty.L_name = false;
      this.isEmpty.Address = false;
      this.isEmpty.Birthdate = false;
      this.isEmpty.NID_num = false;
      this.isEmpty.Phone_num = false;
      this.isEmpty.Email = false;
      this.isEmpty.departmentID = false;
      this.isEmpty.PositionID = false;
      this.isEmpty.start_working_date = false;
      this.isEmpty.Salary = false;
      this.isEmpty.employeeType = false;
      this.isEmpty.bankName = false;
      this.isEmpty.bankAccountID = false;

      this.formData.status = "active";
      this.inputError = false;
      this.isPopupVisible_error = false;
    },
    closePopupLeave() {
      this.isPopupOpenLeave = false;
      this.formDataLeave = {
        ID: "",
        employeeID: "",
        detail: "",
        date: "",
      };

      this.isEmpty.employeeID = false;
      this.isEmpty.detail = false;
      this.isEmpty.date = false;
      this.isEmpty.dateEnd = false;

      this.inputError = false;
    },
    closePopupOvertime() {
      this.isPopupOpenOvertime = false;
      this.formDataOvertime = {
        ID: "",
        employeeID: "",
        detail: "",
        date: "",
        hours: "",
      };
      this.inputError = false;
    },
    closeDeleteConfirmPopup() {
      this.isDeleteConfirmPopupOpen = false;
      this.formData.status = "active";
    },
    closeDeleteLeaveConfirmPopup() {
      this.isDeleteLeaveConfirmPopupOpen = false;
    },
    handleEdit(item) {
      let departments = Array.isArray(item.department)
        ? item.department.map((department) => department.departmentName)
        : [];
      let positions = Array.isArray(item.position)
        ? item.position.map((position) => position.Position)
        : [];

      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const formatDateForPicker = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง

        // 🔹 ถ้าภาษาเป็น "th" (ไทย) ให้เพิ่ม 543 ปี
        if (this.t("lang") === "en") {
          d.setFullYear(d.getFullYear());
        }

        return d;
      };

      if (item.Title === "นาย") {
        item.Title = "Mr.";
      } else if (item.Title === "นาง") {
        item.Title = "Mrs.";
      } else if (item.Title === "นางสาว") {
        item.Title = "Miss";
      }

      const filteredEmp = this.employees.filter((emp) => emp.ID === item.ID);

      let Birthdate = [];
      let startingworkdate = [];
      if (filteredEmp[0].Birthdate) {
        Birthdate = new Date(filteredEmp[0].Birthdate + " GMT+0700"); // เพิ่มเขตเวลา
        Birthdate.toString();
      } else {
        Birthdate = new Date();
      }
      if (filteredEmp[0]["Start Working Date"]) {
        startingworkdate = new Date(
          filteredEmp[0]["Start Working Date"] + " GMT+0700"
        ); // เพิ่มเขตเวลา
        startingworkdate.toString();
      } else {
        startingworkdate = new Date();
      }

      console.log("Edit item:", filteredEmp);
      this.isPopupOpen = true;
      this.isAddingMode = false;
      this.isEditMode = true;
      this.formData = {
        employeeID: item.ID,
        title: item.Title,
        F_name: item.Name.split(" ")[0],
        L_name: item.Name.split(" ")[1],
        Address: item.Address,
        // Birthdate: formattedBirthdate,
        Birthdate: Birthdate,
        NID_num: item["National ID"],
        Phone_num: item["Tel."],
        Email: item.Email,
        departmentID: item.departmentID,
        PositionID: item.PositionID,
        // start_working_date: formattedStartWorking,
        start_working_date: startingworkdate,
        Salary: item.Salary,
        employeeType: item["Emp. type"],
        bankName: item["Bank Name"],
        bankAccountID: item["Bank Account ID"],
        departments: departments.join(", "),
        positions: positions.join(", "),
        status: item.status,
      };
      this.getEmployee();
    },
    handleDelete(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteConfirmPopupOpen = true;
      this.formData = {
        employeeID: item.ID,
      };
    },
    handleDeleteLeave(item) {
      console.log("Delete button clicked for item:", item);
      this.isDeleteLeaveConfirmPopupOpen = true;
      // this.formDataLeve = {
      //   leaving_id: item.ID,
      // };
      this.leaving_id = item.ID;
    },
    showPopup(message) {
      this.popupMessage = message;
      this.isPopupVisible = true;
      setTimeout(() => {
        this.isPopupVisible = false;
      }, 2000); // 5 seconds
    },
    showPopup_error(message) {
      this.popupMessage_error = message;
      this.isPopupVisible = false;
      this.isPopupVisible_error = true;
      setTimeout(() => {
        this.isPopupVisible = false;
        this.isPopupVisible_error = false;
      }, 2000); // 2 seconds
    },
    // async exportEmployee() {
    //   const accessToken = localStorage.getItem("@accessToken");
    //   this.isLoading = true;
    //   // return;
    //   try {
    //     const response = await fetch(
    //       `${API_CALL}/migrate/export-csv/employees`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       }
    //     )
    //       .then((response) => {
    //         if (!response.ok) {
    //           throw new Error("Network response was not ok");
    //         }
    //         return response.blob();
    //       })
    //       .then((blob) => {
    //         const url = window.URL.createObjectURL(new Blob([blob]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute("download", "Employees.csv"); // ตั้งชื่อไฟล์ที่ต้องการดาวน์โหลด
    //         document.body.appendChild(link);
    //         link.click();
    //         window.URL.revokeObjectURL(url);
    //       });
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    // exportEmployee() {
    //   this.isLoading = true;

    //   try {
    //     if (this.formData.status === "") {
    //       this.formData.status = "active";
    //     }
    //     // กรองข้อมูลเฉพาะพนักงานที่มีสถานะ active
    //     const activeEmployees = this.employees.filter(
    //       (employee) => employee.status === this.formData.status
    //     );

    //     // แปลงข้อมูลที่กรองแล้วเป็น CSV
    //     const csvContent = this.convertToCSV(activeEmployees);

    //     // สร้าง Blob และดาวน์โหลดไฟล์ CSV
    //     const blob = new Blob([csvContent], { type: "text/csv" });
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "Employees_export.csv");
    //     document.body.appendChild(link);
    //     link.click();
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error("Error exporting data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    exportEmployee() {
      this.isLoading = true;

      try {
        if (this.formData.status === "") {
          this.formData.status = "active";
        }

        // กรองเฉพาะพนักงานที่มีสถานะตามที่เลือก
        const activeEmployees = this.employees.filter(
          (employee) => employee.status === this.formData.status
        );

        // แปลงข้อมูลเป็น CSV
        const csvContent = this.convertToCSV(activeEmployees);

        // ดาวน์โหลดไฟล์ CSV
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "รายงานพนักงาน.csv");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error exporting data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    convertToCSV(data) {
      if (!data || data.length === 0) return "";

      // หัวคอลัมน์ภาษาไทย (ไม่มี employeeID และ status)
      const headers = [
        "คำนำหน้า", // title
        "ชื่อ-นามสกุล", // F_name
        "ที่อยู่", // Address
        "วันเกิด", // Birthdate
        "เลขบัตรประชาชน", // NID_num
        "เบอร์โทรศัพท์", // Phone_num
        "อีเมล", // Email
        "แผนก", // departmentID (ชื่อแผนกควรถูก resolve ถ้าเป็น ID)
        "ตำแหน่ง", // PositionID (ชื่อควรดึงจากตำแหน่งจริง ถ้าเป็น ID)
        "วันเริ่มงาน", // start_working_date
        "เงินเดือน (บาท)", // Salary
        "ประเภทพนักงาน", // employeeType
        "ธนาคาร", // bankName
        "เลขบัญชีธนาคาร", // bankAccountID
      ];
      console.log("item", data);

      const rows = data.map((item) => {
        // แปลงคำนำหน้าชื่อ (Title)
        if (item.Title === "Mr.") {
          item.Title = "นาย";
        } else if (item.Title === "Mrs.") {
          item.Title = "นาง";
        } else if (item.Title === "Miss") {
          item.Title = "นางสาว";
        }

        return [
          item.Title || "",
          item.Name || "",
          item.Address || "",
          this.formatDateToThai(item.Birthdate),
          item["National ID"] || "",
          item["Tel."] || "",
          item.Email || "",
          item.Department || "",
          item.Position || "",
          this.formatDateToThai(item["Start Working Date"]),
          String(item.Salary).replace(/,/g, "") || "",
          this.translateEmpType(item["Emp. type"]),
          item["Bank Name"] || "",
          item["Bank Account ID"] || "",
        ];
      });

      const csvRows = [headers.join(","), ...rows.map((r) => r.join(","))];

      return "\uFEFF" + csvRows.join("\n"); // เพิ่ม BOM สำหรับภาษาไทย
    },

    translateEmpType(type) {
      switch (type) {
        case "Full-time":
          return "พนักงานประจำ";
        case "Part-time":
          return "พนักงานพาร์ทไทม์";
        case "Contract":
          return "พนักงานสัญญาจ้าง";
        default:
          return "ไม่ระบุ";
      }
    },

    formatDateToThai(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      return `${day}/${month}/${year}`;
    },

    // ฟังก์ชันแปลงข้อมูล JSON เป็น CSV
    // convertToCSV(arr) {
    //   const header = Object.keys(arr[0]);
    //   const rows = arr.map((row) =>
    //     header
    //       .map((fieldName) =>
    //         JSON.stringify(row[fieldName], (key, value) =>
    //           value === null ? "" : value
    //         )
    //       )
    //       .join(",")
    //   );
    //   return [header.join(","), ...rows].join("\r\n");
    // },

    async getEmployee() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployee`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          console.log("-----", json.data);
          this.employees = json.data.map((item) => {
            let departments = item.department
              ? [item.department.departmentName]
              : [];
            let positions = item.position ? [item.position.Position] : [];

            const BD = new Date(item.Birthdate);
            const startWorkingDate = new Date(item.start_working_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            // const Birthdate = BD.toLocaleDateString("en-GB", formatDate);
            // const startWorking = startWorkingDate.toLocaleDateString(
            //   "en-GB",
            //   formatDate
            // );

            const Birthdate =
              item.Birthdate && item.Birthdate !== ""
                ? new Date(item.Birthdate).toLocaleDateString(
                    "en-GB",
                    formatDate
                  )
                : "";

            const startWorking =
              item.start_working_date && item.start_working_date !== ""
                ? new Date(item.start_working_date).toLocaleDateString(
                    "en-GB",
                    formatDate
                  )
                : "";

            function formatSalary(salary) {
              if (salary !== null && typeof salary !== "undefined") {
                return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              return "";
            }

            let initialTableData = {
              ID: item.employeeID,
              Title: item.title,
              Name: item.F_name + " " + item.L_name,
              Address: item.Address,
              Birthdate: Birthdate,
              "National ID": item.NID_num,
              "Tel.": item.Phone_num,
              Email: item.Email,
              "Start Working Date": startWorking,
              Salary: formatSalary(item.Salary),
              "Emp. type": item.employeeType,
              "Bank Name": item.bankName,
              "Bank Account ID": item.bankAccountID,
              Department: departments.join(", "),
              Position: positions.join(", "),
              departmentID: item.departmentID,
              PositionID: item.PositionID,
              status: item.Status,
            };
            return initialTableData;
          });
          this.getLeave();
          this.getOvertime();
        } else {
          console.log("Employee ", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getemployeesSalary() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getEmployeeSalary`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          console.log("+++++", json.data);
          this.employeesSalaries = json.data.map((item) => {
            let departments = item.department
              ? [item.department.departmentName]
              : [];
            let positions = item.position ? [item.position.Position] : [];

            const BD = new Date(item.Birthdate);
            const startWorkingDate = new Date(item.start_working_date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const Birthdate = BD.toLocaleDateString("en-GB", formatDate);
            const startWorking = startWorkingDate.toLocaleDateString(
              "en-GB",
              formatDate
            );

            function formatSalary(salary) {
              if (salary !== null && typeof salary !== "undefined") {
                return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              return "";
            }

            let initialTableData = {
              ID: item.employeeID,
              Name: item.name,
            };
            return initialTableData;
          });
        } else {
          console.log("Employee ", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getDepartment`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Departments = json.data;
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getPosition`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Positions = json.data;
          // console.log("this.Positions", this.Positions);
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getLeave() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getLeave`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Leaving = json.data.map((item) => {
            const DateLeave = new Date(item.date);
            const DateLeaveEnd = new Date(item.dateEnd);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const DateLeaving = DateLeave.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const DateLeavingEnd = DateLeaveEnd.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const employee = this.employees.find(
              (emp) => emp.ID === item.employeeID
            );
            const employeeName = employee ? employee.Name : "Unknown";

            let initialTableData = {
              ID: item.leaving_id,
              Name: employeeName,
              detail: item.detail,
              date: DateLeaving,
              dateEnd: DateLeavingEnd,
            };
            return initialTableData;
          });
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async getOvertime() {
      const accessToken = localStorage.getItem("@accessToken");
      try {
        const response = await fetch(`${API_CALL}/employee/getOvertime`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.statusCode === 200) {
          this.Overtimes = json.data.map((item) => {
            const DateLeave = new Date(item.date);
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const DateLeaving = DateLeave.toLocaleDateString(
              "en-GB",
              formatDate
            );
            const employeeName = `${item.employee.F_name} ${item.employee.L_name}`;

            let initialTableData = {
              ID: item.leaving_id,
              Name: employeeName,
              detail: item.detail,
              date: DateLeaving,
              hours: item.hours,
            };
            return initialTableData;
          });
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    validateLeave() {
      this.isEmpty.employeeID = false;
      this.isEmpty.detail = false;
      this.isEmpty.date = false;
      this.isEmpty.dateEnd = false;

      let errorMessages2 = [];

      if (this.formDataLeave.employeeID === "") {
        this.isEmpty.employeeID = true;
        errorMessages2.push(this.$t("validation.employeeID"));
      }

      // ตรวจสอบฟิลด์ categoryID
      if (this.formDataLeave.detail === "") {
        this.isEmpty.detail = true;
        errorMessages2.push(this.$t("validation.detail"));
      }

      if (this.formDataLeave.date === "") {
        this.isEmpty.date = true;
        errorMessages2.push(this.$t("validation.date"));
      }

      if (this.formDataLeave.dateEnd === "") {
        this.isEmpty.dateEnd = true;
        errorMessages2.push(this.$t("validation.dateEnd"));
      } else {
        // ตรวจสอบว่า dateEnd ต้องไม่น้อยกว่า date
        const dateStart = new Date(this.formDataLeave.date);
        const dateEnd = new Date(this.formDataLeave.dateEnd);
        if (dateEnd < dateStart) {
          this.isEmpty.dateEnd = true;
          errorMessages2.push(this.$t("validation.dateEnd_invalid"));
        }
      }

      console.log(errorMessages2);
      if (errorMessages2.length > 0) {
        this.showPopup_validate2(errorMessages2);
        return false;
      } else {
        return true;
      }
    },
    showPopup_validate2(messages) {
      if (Array.isArray(messages)) {
        this.isPopupVisible_error2 = true;
        this.errorMessages2 = messages; // เก็บข้อความใน errorMessages
        console.log(" this.errorMessages2", this.errorMessages2);
        // this.showErrorPopup = true; // แสดง Popup
        // this.isPopupVisible_error2 = true;
        // setTimeout(() => {
        //   this.isPopupVisible_error2 = false; // ซ่อน Popup หลังจากหน่วงเวลา
        // }, 3000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
      } else {
        this.showPopup_error(messages);
      }
    },
    validateFormData() {
      // ตั้งค่า isEmpty ของทุกฟิลด์เป็น false ก่อนเริ่มการตรวจสอบ
      this.isEmpty.title = false;
      this.isEmpty.F_name = false;
      this.isEmpty.L_name = false;
      this.isEmpty.Address = false;
      this.isEmpty.Birthdate = false;
      this.isEmpty.NID_num = false;
      this.isEmpty.Phone_num = false;
      this.isEmpty.Email = false;
      this.isEmpty.departmentID = false;
      this.isEmpty.PositionID = false;
      this.isEmpty.start_working_date = false;
      this.isEmpty.Salary = false;
      this.isEmpty.employeeType = false;
      this.isEmpty.bankName = false;
      this.isEmpty.bankAccountID = false;

      // ตรวจสอบแต่ละฟิลด์ว่ามีค่าว่างหรือไม่
      let errorMessages = []; // กำหนดค่าเริ่มต้นว่าฟอร์มถูกต้อง

      // ตรวจสอบฟิลด์ productTypeID
      if (this.formData.title === "") {
        this.isEmpty.title = true;
        errorMessages.push(this.$t("validation.title"));
      }

      // ตรวจสอบฟิลด์ categoryID
      if (this.formData.F_name === "") {
        this.isEmpty.F_name = true;
        errorMessages.push(this.$t("validation.F_name"));
      }

      // ตรวจสอบฟิลด์ productname
      if (this.formData.L_name === "") {
        this.isEmpty.L_name = true;
        errorMessages.push(this.$t("validation.L_name"));
      }

      // ตรวจสอบฟิลด์ price
      if (this.formData.Address === "") {
        this.isEmpty.Address = true;
        errorMessages.push(this.$t("validation.Address"));
      }

      // ตรวจสอบฟิลด์ productcost
      if (this.formData.Birthdate === "") {
        this.isEmpty.Birthdate = true;
        errorMessages.push(this.$t("validation.Birthdate"));
      }

      if (this.formData.NID_num === "") {
        this.isEmpty.NID_num = true;
        errorMessages.push(this.$t("validation.NID_num"));
      } else if (this.formData.NID_num.length !== 13) {
        this.isEmpty.NID_num = true;
        errorMessages.push(this.$t("validation.NID_num_length"));
      }

      const isDuplicateNID_num = this.employees.some(
        (item) =>
          item["National ID"].trim() === this.formData.NID_num.trim() &&
          item.ID !== this.formData.employeeID // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      );
      if (isDuplicateNID_num) {
        this.isEmpty.NID_num = true;
        errorMessages.push(this.$t("validation.duplicateNID_num"));
      }

      if (this.formData.Phone_num === "") {
        this.isEmpty.Phone_num = true;
        errorMessages.push(this.$t("validation.Phone_num"));
      } else if (
        !this.formData.Phone_num ||
        this.formData.Phone_num.length < 9 ||
        this.formData.Phone_num.length > 10
      ) {
        this.isEmpty.Phone_num = true;
        errorMessages.push(this.$t("validation.Phone_num_length"));
      }

      const isDuplicatePhone = this.employees.some(
        (item) =>
          item["Tel."].trim() === this.formData.Phone_num.trim() &&
          item.ID !== this.formData.employeeID // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      );
      if (isDuplicatePhone) {
        this.isEmpty.Phone_num = true;
        errorMessages.push(this.$t("validation.duplicatePhone"));
      }

      if (this.formData.Email === "") {
        this.isEmpty.Email = true;
        errorMessages.push(this.$t("validation.Email"));
      }

      if (
        this.formData.departmentID === "" ||
        this.formData.departmentID === null
      ) {
        this.isEmpty.departmentID = true;
        errorMessages.push(this.$t("validation.departmentID"));
      }

      if (
        this.formData.PositionID === "" ||
        this.formData.PositionID === null
      ) {
        this.isEmpty.PositionID = true;
        errorMessages.push(this.$t("validation.PositionID"));
      }

      if (this.formData.start_working_date === "") {
        this.isEmpty.start_working_date = true;
        errorMessages.push(this.$t("validation.start_working_date"));
      }

      // if (this.formData.Salary === "") {
      //   this.isEmpty.Salary = true;
      //   errorMessages.push(this.$t("validation.Salary"));
      // }

      if (this.formData.employeeType === "") {
        this.isEmpty.employeeType = true;
        errorMessages.push(this.$t("validation.employeeType"));
      }

      // if (this.formData.bankName === "") {
      //   this.isEmpty.bankName = true;
      //   errorMessages.push(this.$t("validation.bankName"));
      // }

      // if (this.formData.bankAccountID === "") {
      //   this.isEmpty.bankAccountID = true;
      //   errorMessages.push(this.$t("validation.bankAccountID"));
      // } else if (this.formData.bankAccountID.length < 10) {
      //   this.isEmpty.bankAccountID = true;
      //   errorMessages.push(this.$t("validation.bankAccountID_length"));
      // }

      // const isDuplicateBankAcc = this.employees.some(
      //   (item) =>
      //     item["Bank Account ID"].trim() ===
      //       this.formData.bankAccountID.trim() &&
      //     item.ID !== this.formData.employeeID // ตรวจสอบว่าข้อมูลไม่ได้เป็นตัวเอง
      // );
      // if (isDuplicateBankAcc) {
      //   this.isEmpty.bankAccountID = true;
      //   errorMessages.push(this.$t("validation.duplicateBankAcc"));
      // }

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
    async addEmployee() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!this.validateFormData()) return;
      // if (
      //   this.formData.title === "" ||
      //   this.formData.F_name === "" ||
      //   this.formData.L_name === "" ||
      //   this.formData.Address === "" ||
      //   this.formData.Birthdate === "" ||
      //   this.formData.NID_num === "" ||
      //   this.formData.Phone_num === "" ||
      //   this.formData.Email === "" ||
      //   this.formData.departmentID === "" ||
      //   this.formData.PositionID === "" ||
      //   this.formData.start_working_date === "" ||
      //   this.formData.Salary === "" ||
      //   this.formData.employeeType === "" ||
      //   this.formData.bankName === "" ||
      //   this.formData.bankAccountID === ""
      // ) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill all data");
      // } else if (!this.validateEmail(this.formData.Email)) {
      //   this.inputError = true;
      //   this.showPopup_error("Invalid email format");
      // } else if (this.formData.NID_num.length !== 13) {
      //   this.inputError = true;
      //   this.showPopup_error("National ID must be 13 digits");
      // } else if (this.formData.Phone_num.length !== 10) {
      //   this.inputError = true;
      //   this.showPopup_error("Phone number must be 10 digits");
      // } else if (this.formData.bankAccountID.length !== 10) {
      //   this.inputError = true;
      //   this.showPopup_error("Bank account ID must be 10 digits");
      // } else {
      //   this.inputError = false;
      this.isLoading = true;

      const date_Birthdate = new Date(this.formData.Birthdate); // ค่าที่ได้
      date_Birthdate.setFullYear(date_Birthdate.getFullYear() - 543); // ลบ 543 ปี

      // const date_start_working_date = new Date(
      //   this.formData.start_working_date
      // ); // ค่าที่ได้
      // date_start_working_date.setFullYear(
      //   date_start_working_date.getFullYear() - 543
      // ); // ลบ 543 ปี
      try {
        const response = await fetch(`${API_CALL}/employee/AddEmployee`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: this.formData.title,
            F_name: this.formData.F_name,
            L_name: this.formData.L_name,
            Address: this.formData.Address,
            Birthdate: this.formData.Birthdate,
            // Birthdate:
            //   this.t("lang") === "en"
            //     ? date_Birthdate
            //     : this.formData.Birthdate,
            NID_num: this.formData.NID_num,
            Phone_num: this.formData.Phone_num,
            Email: this.formData.Email,
            departmentID: this.formData.departmentID,
            PositionID: this.formData.PositionID,
            start_working_date: this.formData.start_working_date,
            // start_working_date:
            //   this.t("lang") === "en"
            //     ? date_start_working_date
            //     : this.formData.start_working_date,
            Salary: this.formData.Salary,
            employeeType: this.formData.employeeType,
            bankName: this.formData.bankName,
            bankAccountID: this.formData.bankAccountID,
          }),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.isPopupVisible_error = false;
          this.getEmployee();
          this.closePopup();
          this.showPopup(this.$t("validation.AddSucc"));
          console.log("Add employee success");
          this.formData = {
            employeeID: "",
            title: "",
            F_name: "",
            L_name: "",
            Address: "",
            Birthdate: "",
            NID_num: "",
            Phone_num: "",
            Email: "",
            departmentID: "",
            PositionID: "",
            start_working_date: "",
            Salary: "",
            employeeType: "",
            bankName: "",
            bankAccountID: "",
            status: "",
          };
        } else {
          console.log("Add employee error", json);

          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    async AddLeave() {
      const accessToken = localStorage.getItem("@accessToken");
      if (!(await this.validateLeave())) return;
      this.isLoading = true;
      // const dataStart = new Date(this.formDataLeave.date); // ค่าที่ได้
      // dataStart.setFullYear(dataStart.getFullYear() - 543); // ลบ 543 ปี
      // const dateEnd = new Date(this.formDataLeave.dateEnd); // ค่าที่ได้
      // dateEnd.setFullYear(dateEnd.getFullYear() - 543); // ลบ 543 ปี
      // if (
      //   this.formDataLeave.employeeID === "" ||
      //   this.formDataLeave.date === "" ||
      //   this.formDataLeave.detail === ""
      // ) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill data");
      // } else {
      // this.inputError = false;
      // this.isLoading = true;
      if (this.isEditMode === false) {
        try {
          const response = await fetch(`${API_CALL}/employee/AddLeave`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              employeeID: this.formDataLeave.employeeID,
              detail: this.formDataLeave.detail,
              date: this.formDataLeave.date,
              dateEnd: this.formDataLeave.dateEnd,
              // date:
              //   this.t("lang") === "en" ? dataStart : this.formDataLeave.date,
              // // dateEnd: this.formDataLeave.dateEnd,
              // dateEnd:
              //   this.t("lang") === "en" ? dateEnd : this.formDataLeave.dateEnd,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getLeave();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
            this.formDataLeave = {
              employeeID: "",
              date: "",
              detail: "",
              dateEnd: "",
            };
          } else {
            // this.showPopup_error(json.data);
            this.isPopupVisible_error2 = true;
            this.errorMessages2.push(this.$t("validation.duplicateLeaveDate"));
            setTimeout(() => {
              this.isPopupVisible_error2 = false; // ซ่อน Popup หลังจากหน่วงเวลา
            }, 3000); // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที)
            console.log("Manage Leave error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false;
        }
      } else {
        try {
          const response = await fetch(
            `${API_CALL}/employee/EditLeave/` + this.EditIdLeaveHandle,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                employeeID: this.formDataLeave.employeeID,
                detail: this.formDataLeave.detail,
                date: this.formDataLeave.date,
                // date:
                // this.t("lang") === "en" ? dataStart : this.formDataLeave.date,
                dateEnd: this.formDataLeave.dateEnd,
                // dateEnd:
                // this.t("lang") === "en"
                //   ? dateEnd
                //   : this.formDataLeave.dateEnd,
              }),
            }
          );
          const json = await response.json();
          if (json.statusCode === 200) {
            console.log("Edit successfully");
            this.showPopup(this.$t("validation.EditSucc"));
            this.getLeave();
            this.closePopupLeave();
            this.formDataLeave = {
              employeeID: "",
              date: "",
              detail: "",
              dateEnd: "",
            };
          } else {
            this.showPopup_error(json.data);
            console.log("Edit Leave error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false;
        }
      }
      // }
    },
    async AddOvertime() {
      const accessToken = localStorage.getItem("@accessToken");
      if (
        this.formDataOvertime.employeeID === "" ||
        this.formDataOvertime.date === "" ||
        this.formDataOvertime.detail === "" ||
        this.formDataOvertime.hours === ""
      ) {
        this.inputError = true;
        this.showPopup_error("Please fill data");
      } else {
        this.inputError = false;
        this.isLoading = true;

        try {
          const response = await fetch(`${API_CALL}/employee/AddOvertime`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              employeeID: this.formDataOvertime.employeeID,
              detail: this.formDataOvertime.detail,
              date: this.formDataOvertime.date,
              hours: this.formDataOvertime.hours,
            }),
          });
          const json = await response.json();
          if (json.statusCode === 200) {
            this.getOvertime();
            console.log("Manage successfully");
            this.showPopup(this.$t("validation.AddSucc"));
            this.formDataOvertime = {
              employeeID: "",
              date: "",
              detail: "",
              hours: "",
            };
          } else {
            this.showPopup_error(json.data);
            console.log("Manage Overtime error", json);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    async editEmployee() {
      if (!this.validateFormData()) return;
      this.isLoading = true;
      // console.log("==========",this.formData.departmentID)
      const accessToken = localStorage.getItem("@accessToken");
      // if (
      //   this.formData.title === "" ||
      //   this.formData.F_name === "" ||
      //   this.formData.L_name === "" ||
      //   this.formData.Address === "" ||
      //   this.formData.Birthdate === "" ||
      //   this.formData.NID_num === "" ||
      //   this.formData.Phone_num === "" ||
      //   this.formData.Email === "" ||
      //   this.formData.departmentID === "" ||
      //   this.formData.PositionID === "" ||
      //   this.formData.start_working_date === "" ||
      //   this.formData.Salary === "" ||
      //   this.formData.employeeType === "" ||
      //   this.formData.bankName === "" ||
      //   this.formData.bankAccountID === ""
      // ) {
      //   this.inputError = true;
      //   this.showPopup_error("Please fill all data");
      // } else if (!this.validateEmail(this.formData.Email)) {
      //   this.inputError = true;
      //   this.showPopup_error("Invalid email format");
      // } else if (this.formData.NID_num.length !== 13) {
      //   this.inputError = true;
      //   this.showPopup_error("National ID must be 13 digits");
      // } else if (this.formData.Phone_num.length !== 10) {
      //   this.inputError = true;
      //   this.showPopup_error("Phone number must be 10 digits");
      // } else if (this.formData.bankAccountID.length < 10) {
      //   this.inputError = true;
      //   this.showPopup_error("Bank account ID must be 10-13 digits");
      // } else {
      //   this.inputError = false;
      //   this.isLoading = true;

      function parseSalary(salaryString) {
        if (salaryString !== null && typeof salaryString !== "undefined") {
          return parseFloat(salaryString.replace(/,/g, ""));
        }
        return null;
      }
      const employee = this.formData.employeeID;
      const date_Birthdate = new Date(this.formData.Birthdate); // ค่าที่ได้
      date_Birthdate.setFullYear(date_Birthdate.getFullYear() - 543); // ลบ 543 ปี

      const date_start_working_date = new Date(
        this.formData.start_working_date
      ); // ค่าที่ได้
      date_start_working_date.setFullYear(
        date_start_working_date.getFullYear() - 543
      ); // ลบ 543 ปี

      try {
        const response = await fetch(
          `${API_CALL}/employee/EditEmployee/${employee}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            // body: JSON.stringify(this.formData),
            body: JSON.stringify({
              title: this.formData.title,
              F_name: this.formData.F_name,
              L_name: this.formData.L_name,
              Address: this.formData.Address,
              Birthdate: this.formData.Birthdate,
              // Birthdate:
              //   this.t("lang") === "en"
              //     ? date_Birthdate
              //     : this.formData.Birthdate,
              NID_num: this.formData.NID_num,
              Phone_num: this.formData.Phone_num,
              Email: this.formData.Email,
              departmentID: this.formData.departmentID,
              PositionID: this.formData.PositionID,
              start_working_date: this.formData.start_working_date,
              // start_working_date:
              //   this.t("lang") === "en"
              //     ? date_start_working_date
              //     : this.formData.start_working_date,
              Salary: parseSalary(this.formData.Salary),
              employeeType: this.formData.employeeType,
              bankName: this.formData.bankName,
              bankAccountID: this.formData.bankAccountID,
            }),
          }
        );
        const json = await response.json();
        //   console.log(json);

        if (json.statusCode === 200) {
          this.getEmployee();
          this.showPopup(this.$t("validation.EditSucc"));
          console.log("Edit employee success");
          this.closePopup();
        } else {
          console.log("edit employee error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
      // }
    },
    async deleteEmployee() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const employeeID = this.formData.employeeID;
      try {
        const response = await fetch(
          `${API_CALL}/employee/DeleteEmployee/${employeeID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              employeeID: employeeID,
            }),
          }
        );
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getEmployee();
          this.employees = this.employees.filter(
            (item) => item.employeeID !== employeeID
          );
          this.showPopup(this.$t("validation.DelateSucc"));
          console.log("delete employee success");
          this.closeDeleteConfirmPopup();
        } else {
          console.log("delete employee error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteLeave() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      const id = this.leaving_id;
      try {
        const response = await fetch(`${API_CALL}/employee/DeleteLeave/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            leaving_id: id,
          }),
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.getLeave();
          this.getOvertime();
          this.closeDeleteLeaveConfirmPopup();
          this.showPopup(this.$t("validation.DelateSucc"));
          console.log("delete Leave success");
        } else {
          console.log("delete Leave error", json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getPosition();
    this.getDepartment();
    this.getEmployee();
    // this.getemployeesSalary();
    this.getOvertime();
  },
};
</script>

<style>
.show-only-desktop table thead tr th:nth-child(17),
.show-only-desktop table tbody tr td:nth-child(17) {
  display: none;
}
</style>
