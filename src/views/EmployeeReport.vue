<template>
  <div class="main-page">
    <!-- call navigate tab -->
    <!-- <navigate /> -->
    <div class="page-body">
      <div class="mb-3">
        <h2>{{ t("employeereport") }}</h2>
      </div>
      <div class="row text-center">
        <div class="col-md-12">
          <div class="card bg-light">
            <div class="card-body">
              <div class="card-body-detail">
                <div class="card-body-left">
                  <div class="card-body-left-sale">
                    <div class="sale-card">
                      <p>{{ t("allDepaer") }}</p>
                    </div>
                    <p>{{ totalDepart }}</p>
                  </div>
                  <div class="card-body-left-cost">
                    <div class="cost-card">
                      <p>{{ t("allPos") }}</p>
                    </div>
                    <p>{{ totalPosition }}</p>
                  </div>
                </div>
                <div class="card-body-right">
                  <div class="card-body-right-profit">
                    <div class="profit-card">
                      <p>{{ t("allEmp") }}</p>
                    </div>
                    <p>{{ this.totalEmployee }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12 col-md-5 col-lg-5 col-sm-12">
          <div class="card bg-light">
            <div class="card-body">
              <p class="card-body-p">{{ t("numberofemp") }}</p>
              <div class="card-body-barchart-detail">
                <div class="menu-barchart">
                  <div class=""></div>
                </div>
              </div>
              <div class="card-body-detail">
                <div
                  ref="hiringRateChart"
                  style="width: 100%; height: 400px"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-5 col-lg-5 col-sm-12">
          <div class="card bg-light">
            <div class="card-body">
              <p class="card-body-p">{{ t("AbsentRate") }}</p>
              <div class="card-body-detail">
                <div
                  ref="leaveDonutChart"
                  style="width: 500px; height: 400px"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2 col-lg-2 col-sm-12">
          <div class="card bg-light" style="height: auto">
            <div class="card-body">
              <p class="card-body-p">{{ t("filter") }}</p>
              <div class="card-body-column">
                <div
                  class="filter-box-content"
                  style="padding-top: 0px !important"
                >
                  <div>{{ t("years") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedYear"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option value="thisyear">{{ t("thisyear") }}</option>
                    <option value="lastyear">{{ t("lastyear") }}</option>
                    <option v-for="year in years" :value="year" :key="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <div class="filter-box-content">
                  <div>{{ t("departs") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedDepartment"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option
                      v-for="department in Departments"
                      :value="department.departmentID"
                      :key="department.departmentID"
                    >
                      {{ department.departmentName }}
                    </option>
                  </select>
                </div>
                <div class="filter-box-content">
                  <div>{{ t("posis") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedPosition"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option
                      v-for="position in Positions"
                      :value="position.positionID"
                      :key="position.positionID"
                    >
                      {{ position.Position }}
                    </option>
                  </select>
                </div>
                <div class="filter-box-content">
                  <div>{{ t("empTypes") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedEmployeeType"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option value="Full-time">{{ t("fulltime") }}</option>
                    <option value="Part-time">{{ t("parttime") }}</option>
                    <option value="Contract">{{ t("contract") }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-5 body-dashboard">
          <!-- <div class="card bg-light" style="height: 50%">
            <div class="card-body">
              <p class="card-body-p">{{ t("ageRange") }}</p>
              <div class="card-body-barchart-detail">
                <div class="menu-barchart">
                  <div class=""></div>
                </div>
              </div>
              <div class="card-body-detail">
                <div ref="barChart" style="width: 100%; height: 400px"></div>
              </div>
            </div>
          </div> -->
          <!-- <div
            class="card bg-light"
            style="height: 50%; margin-top: calc(var(--bs-gutter-x) * 1)"
          >
            <div class="card-body">
              <p class="card-body-p">{{ t("AbsentRate") }}</p>
              <div class="card-body-detail">
                <div
                  ref="leaveDonutChart"
                  style="width: 500px; height: 400px"
                ></div>
              </div>
            </div>
          </div> -->
        </div>
        <div class="col-md-5 body-dashboard">
          <!-- <div class="card bg-light" style="height: 50%">
            <div class="card-body">
              <p class="card-body-p">{{ t("numberofemp") }}</p>
              <div class="card-body-barchart-detail">
                <div class="menu-barchart">
                  <div class=""></div>
                </div>
              </div>
              <div class="card-body-detail">
                <div
                  ref="hiringRateChart"
                  style="width: 100%; height: 400px"
                ></div>
              </div>
            </div>
          </div> -->
          <!-- <div
            class="card bg-light"
            style="height: 50%; margin-top: calc(var(--bs-gutter-x) * 1)"
          >
            <div class="card-body">
              <p class="card-body-p">{{ t("OvertimeRate") }}</p>
              <div class="card-body-barchart-detail">
                <div class="menu-barchart">
                  <div class=""></div>
                </div>
              </div>
              <div class="card-body-detail">
                <div
                  ref="overtimeDonutChart"
                  style="width: 100%; height: 400px"
                ></div>
              </div>
            </div>
          </div> -->
        </div>
        <!-- <div class="col-md-2 body-dashboard">
          <div class="card bg-light" style="height: auto">
            <div class="card-body">
              <p class="card-body-p">{{ t("filter") }}</p>
              <div class="card-body-column">
                <div
                  class="filter-box-content"
                  style="padding-top: 0px !important"
                >
                  <div>{{ t("years") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedYear"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option value="thisyear">{{ t("thisyear") }}</option>
                    <option value="lastyear">{{ t("lastyear") }}</option>
                    <option v-for="year in years" :value="year" :key="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
                <div class="filter-box-content">
                  <div>{{ t("departs") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedDepartment"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option
                      v-for="department in Departments"
                      :value="department.departmentID"
                      :key="department.departmentID"
                    >
                      {{ department.departmentName }}
                    </option>
                  </select>
                </div>
                <div class="filter-box-content">
                  <div>{{ t("posis") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedPosition"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option
                      v-for="position in Positions"
                      :value="position.positionID"
                      :key="position.positionID"
                    >
                      {{ position.Position }}
                    </option>
                  </select>
                </div>
                <div class="filter-box-content">
                  <div>{{ t("empTypes") }}</div>
                  <select
                    class="form-control form-select"
                    v-model="selectedEmployeeType"
                    @change="filterEmployees"
                  >
                    <option value="all">{{ t("all") }}</option>
                    <option value="Full-time">{{ t("fulltime") }}</option>
                    <option value="Part-time">{{ t("parttime") }}</option>
                    <option value="Contract">{{ t("contract") }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
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
</template>

<script>
import navigate from "../components/Navigation.vue";
import * as echarts from "echarts";
import { config } from "../../constant.js";
import { useI18n } from "vue-i18n";
import datepicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

const API_CALL = config["url"];
const accessToken = localStorage.getItem("@accessToken");

export default {
  name: "Sale Report",
  components: {
    navigate,
    datepicker,
  },
  setup() {
    const { t, locale } = useI18n();

    // Define destroyCharts inside setup

    return {
      t,
      locale,
    };
  },
  data() {
    return {
      totalDepart: "",
      totalPosition: "",
      totalEmployee: "",
      productTypeA: [],
      productTypeB: [],
      Positions: [],
      Departments: [],
      Employees: [],
      originalBillings: [],
      originalProductFilter: [],
      Overtimes: [],
      Leaving: [],
      startDate: "",
      endDate: "",
      isLoading: false,
      selectedOption: "all",
      filteredEmployees: [], // สำหรับเก็บข้อมูลพนักงานที่ถูกกรอง
      filteredOvertimes: [],
      filteredLeaves: [],
      years: [], // สำหรับเก็บช่วงปีที่มีในข้อมูลพนักงาน
      selectedYear: "all",
      selectedDepartment: "all",
      selectedPosition: "all",
      selectedEmployeeType: "all",
    };
  },
  methods: {
    filterEmployees() {
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;

      let filteredEmployees = [...this.Employees];

      if (this.selectedYear !== "all") {
        if (this.selectedYear === "thisyear") {
          filteredEmployees = filteredEmployees.filter((item) => {
            const itemYear = new Date(item.start_working_date).getFullYear();
            return itemYear === currentYear;
          });
        } else if (this.selectedYear === "lastyear") {
          filteredEmployees = filteredEmployees.filter((item) => {
            const itemYear = new Date(item.start_working_date).getFullYear();
            return itemYear === lastYear;
          });
        } else {
          // ฟิลเตอร์ตามปีที่ผู้ใช้เลือก (หากมีปีอื่นที่เลือกได้)
          filteredEmployees = filteredEmployees.filter((item) => {
            const itemYear = new Date(item.start_working_date).getFullYear();
            return itemYear === parseInt(this.selectedYear);
          });
        }
      }

      // ฟิลเตอร์ตามแผนกที่เลือก
      if (this.selectedDepartment !== "all") {
        filteredEmployees = filteredEmployees.filter(
          (item) => item.departmentID === this.selectedDepartment
        );
      }

      // ฟิลเตอร์ตามตำแหน่งที่เลือก
      if (this.selectedPosition !== "all") {
        filteredEmployees = filteredEmployees.filter(
          (item) => item.positionID === this.selectedPosition
        );
      }

      // ฟิลเตอร์ตามประเภทพนักงานที่เลือก
      if (this.selectedEmployeeType !== "all") {
        filteredEmployees = filteredEmployees.filter(
          (item) => item.employeeType === this.selectedEmployeeType
        );
      }

      // อัพเดตผลลัพธ์หลังการกรอง
      this.filteredEmployees = filteredEmployees;

      this.createAgeGroupBarChart();
      this.createHiringRateChart();
      this.createLeaveDonutChart();
      this.createOvertimeDonutChart();
    },
    async filterEmployee() {
      this.filteredEmployees = this.Employees.filter((employee) => {
        const yearMatch =
          this.selectedYear === "all" ||
          new Date(employee.start_working_date).getFullYear() ==
            this.selectedYear;
        const departmentMatch =
          this.selectedDepartment === "all" ||
          employee.departmentID == this.selectedDepartment;
        const positionMatch =
          this.selectedPosition === "all" ||
          employee.positionID == this.selectedPosition;
        const typeMatch =
          this.selectedEmployeeType === "all" ||
          employee.type == this.selectedEmployeeType;

        return yearMatch && departmentMatch && positionMatch && typeMatch;
      });
      await this.getOvertime();
      // console.log("filteredOvertimes", this.Overtimes);
      // หลังจากกรองข้อมูลแล้ว เรียกใช้ฟังก์ชันสร้างกราฟ
      this.filteredOvertimes = this.Overtimes.filter((overtime) => {
        return this.filteredEmployees.some(
          (employee) => employee.employeeID === overtime.employeeID
        );
      });
      await this.getLeave();

      // กรองข้อมูลการลา (Leave) ตามพนักงานที่ถูกกรอง
      this.filteredLeaves = this.Leaving.filter((leave) => {
        return this.filteredEmployees.some(
          (employee) => employee.employeeID === leave.employeeID
        );
      });

      // หลังจากกรองข้อมูลแล้ว เรียกใช้ฟังก์ชันสร้างกราฟใหม่
      this.createAgeGroupBarChart();
      this.createHiringRateChart();
      this.createLeaveDonutChart();
      this.createOvertimeDonutChart();
    },
    async getYears() {
      const years = this.Employees.map((employee) =>
        new Date(employee.start_working_date).getFullYear()
      );
      this.years = [...new Set(years)]; // กรองปีที่ซ้ำออก
    },
    calculateAge(birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    formatDateForPicker(date) {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null; // ตรวจสอบว่าเป็นวันที่ถูกต้อง
      return d;
    },
    async getDepartment() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getDepartment`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Departments = json.data;

          this.totalDepart = this.Departments.filter(
            (item) => item.departmentID != null
          ).length;
          this.filterEmployees();
        } else {
          this.showPopup_error(json.data);
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getPosition() {
      const accessToken = localStorage.getItem("@accessToken");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_CALL}/employee/getPosition`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();

        if (json.statusCode === 200) {
          this.Positions = json.data;

          this.totalPosition = this.Positions.filter(
            (item) => item.PositionID != null
          ).length;
          this.filterEmployees();
        } else {
          this.showPopup_error(json.data);
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
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
          this.Employees = json.data;
          this.getLeave();
          this.filterEmployee();
          this.totalEmployee = this.Employees.filter(
            (item) => item.employeeID != null
          ).length;
          this.filteredEmployees = json.data;

          this.filterEmployees();
          // this.createAgeGroupBarChart();
          // this.createHiringRateChart();
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
            const formatDate = {
              day: "2-digit",
              month: "short",
              year: "numeric",
            };
            const DateLeaving = DateLeave.toLocaleDateString(
              "en-GB",
              formatDate
            );

            let initialTableData = {
              ID: item.leaving_id,
              employeeID: item.employeeID,
              detail: item.detail,
              date: DateLeaving,
            };
            return initialTableData;
          });
          this.filterEmployees();
          // console.log("this.Leaving", this.Leaving);
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

            let initialTableData = {
              ID: item.leaving_id,
              employeeID: item.employeeID,
              detail: item.detail,
              date: DateLeaving,
              hours: item.hours,
            };
            return initialTableData;
          });
          this.filterEmployees();
          this.createOvertimeDonutChart();
        } else {
          console.log(json);
          this.showPopup_error(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    createAgeGroupBarChart() {
      if (!this.filteredEmployees || this.filteredEmployees.length === 0)
        return;

      const ageGroups = {
        "18-30": 0,
        "31-45": 0,
        "46-60": 0,
      };

      this.filteredEmployees.forEach((employee) => {
        const age = this.calculateAge(employee.Birthdate);
        if (age >= 18 && age <= 30) {
          ageGroups["18-30"]++;
        } else if (age >= 31 && age <= 45) {
          ageGroups["31-45"]++;
        } else if (age >= 46 && age <= 60) {
          ageGroups["46-60"]++;
        }
      });

      const chartDom = this.$refs.barChart;
      if (!chartDom) return;

      let chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.dispose(); // ทำลาย instance เก่า
      }

      chart = echarts.init(chartDom);
      const option = {
        title: {
          text: this.t("ageRange"),
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          data: ["18-30", "31-45", "46-60"],
          top: "bottom",
        },
        xAxis: {
          type: "value", // แกน X เป็นจำนวนพนักงาน
        },
        yAxis: {
          type: "category", // แกน Y เป็นประเภทแผนก หรือกลุ่มอื่นๆ ตามต้องการ
          data: ["พนักงานทั้งหมด"], // สมมุติว่ามีแผนกเดียว ถ้าต้องการหลายแผนก เพิ่มใน array
        },
        series: [
          {
            name: "18-30",
            type: "bar",
            stack: "total", // ระบุว่าต้องการ stack กราฟ
            label: {
              show: true,
            },
            data: [ageGroups["18-30"]],
            itemStyle: {
              color: "#FF69B4", // สีสำหรับช่วงอายุ 18-30
            },
          },
          {
            name: "31-45",
            type: "bar",
            stack: "total", // ระบุว่าเป็น stack เดียวกัน
            label: {
              show: true,
            },
            data: [ageGroups["31-45"]],
            itemStyle: {
              color: "#6495ED", // สีสำหรับช่วงอายุ 31-45
            },
          },
          {
            name: "46-60",
            type: "bar",
            stack: "total", // ระบุว่าเป็น stack เดียวกัน
            label: {
              show: true,
            },
            data: [ageGroups["46-60"]],
            itemStyle: {
              color: "#FFD700", // สีสำหรับช่วงอายุ 46-60
            },
          },
        ],
      };
      chart.setOption(option);
    },
    createHiringRateChart() {
      const hiringData = {};

      this.filteredEmployees.forEach((employee) => {
        const startDate = new Date(employee.start_working_date);
        const monthYear = `${
          startDate.getMonth() + 1
        }/${startDate.getFullYear()}`; // ได้รูปแบบเดือน/ปี เช่น "01/2024"

        if (!hiringData[monthYear]) {
          hiringData[monthYear] = 0;
        }
        hiringData[monthYear]++; // เพิ่มจำนวนพนักงานที่เริ่มงานในเดือนนี้
      });

      const months = Object.keys(hiringData); // รายชื่อเดือน
      const hiringRates = Object.values(hiringData); // จำนวนพนักงานในแต่ละเดือน

      const chartDom = this.$refs.hiringRateChart;
      if (!chartDom) return;

      let chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.dispose(); // ทำลาย instance เก่า
      }

      chart = echarts.init(chartDom);
      const legendName = this.t("newEmp"); // ดึงค่าชื่อของ legend

      const option = {
        title: {
          text: this.t("EmployRate"),
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [legendName], // ต้องเป็น array
          top: "bottom",
        },
        xAxis: {
          type: "category",
          data: months, // เดือนที่แสดงบนแกน X
        },
        yAxis: {
          type: "value",
          name: this.t("numEmp"),
        },
        series: [
          {
            name: legendName, // ตรงกับชื่อที่ใช้ใน legend
            type: "line", // กำหนดประเภทเป็นกราฟเส้น
            data: hiringRates, // จำนวนพนักงานใหม่ในแต่ละเดือน
            itemStyle: {
              color: "#6495ED", // สีของเส้น
            },
          },
        ],
      };

      chart.setOption(option);
    },
    // createLeaveDonutChart() {
    //  // ฉันต้องการ filter ตามแผนกพนักงาน
    //   console.log(this.selectedDepartment); // ข้อมูลที่ได้จาก filter รับ department ID มา
    //   console.log("this.Employees", this.Employees[0].departmentID); // ข้อมูลไอดีแผนกพนักงาน

    //   console.log("createLeaveDonutChart", this.filteredLeaves);
    //   if (!this.filteredLeaves || this.filteredLeaves.length === 0) return;
    //   const leaveTypes = {};
    //   this.filteredLeaves.forEach((leave) => {
    //     const detail = leave.detail;
    //     if (!leaveTypes[detail]) {
    //       leaveTypes[detail] = 0;
    //     }
    //     leaveTypes[detail]++;
    //   });
    //   const leaveData = Object.keys(leaveTypes).map((type) => ({
    //     name: type,
    //     value: leaveTypes[type],
    //   }));

    //   const chartDom = this.$refs.leaveDonutChart;
    //   if (!chartDom) return;

    //   let chart = echarts.getInstanceByDom(chartDom);
    //   if (chart) {
    //     chart.dispose(); // ทำลาย instance เก่า
    //   }

    //   chart = echarts.init(chartDom);
    //   const option = {
    //     title: {
    //       text: this.t("detailLeave"),
    //       left: "center",
    //     },
    //     tooltip: {
    //       trigger: "item",
    //     },
    //     legend: {
    //       top: "bottom",
    //     },
    //     series: [
    //       {
    //         name: this.t("leave"),
    //         type: "pie",
    //         radius: ["50%", "70%"], // ทำให้เป็นกราฟโดนัท
    //         avoidLabelOverlap: false,
    //         label: {
    //           show: false,
    //           position: "center",
    //         },
    //         emphasis: {
    //           label: {
    //             show: true,
    //             fontSize: "20",
    //             fontWeight: "bold",
    //           },
    //         },
    //         labelLine: {
    //           show: false,
    //         },
    //         data: leaveData, // ข้อมูลการลา
    //       },
    //     ],
    //   };
    //   chart.setOption(option);
    // },
    createLeaveDonutChart() {
      if (!this.filteredLeaves || this.filteredLeaves.length === 0) return;

      const chartDom = this.$refs.leaveDonutChart;
      if (!chartDom) return;

      // ทำลายกราฟเก่า
      let chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.dispose();
      }
      chart = echarts.init(chartDom);

      // ✅ กรองข้อมูลตามแผนกที่เลือก
      const departmentLeaves =
        this.selectedDepartment === "all"
          ? this.filteredLeaves
          : this.filteredLeaves.filter((leave) => {
              const employee = this.Employees.find(
                (emp) => emp.employeeID === leave.employeeID
              );
              return (
                employee && employee.departmentID === this.selectedDepartment
              );
            });

      if (!departmentLeaves || departmentLeaves.length === 0) {
        chart.clear(); // ล้างกราฟถ้าไม่มีข้อมูล
        return;
      }

      // ประมวลผลข้อมูลลา
      const leaveTypes = {};
      departmentLeaves.forEach((leave) => {
        const detail = leave.detail;
        if (!leaveTypes[detail]) {
          leaveTypes[detail] = 0;
        }
        leaveTypes[detail]++;
      });

      const leaveData = Object.keys(leaveTypes).map((type) => ({
        name: type,
        value: leaveTypes[type],
      }));

      const option = {
        title: {
          text: this.t("detailLeave"),
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            name: this.t("leave"),
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: leaveData,
          },
        ],
      };

      chart.setOption(option);
    },

    createOvertimeDonutChart() {
      if (!this.filteredOvertimes || this.filteredOvertimes.length === 0)
        return;

      const totalOvertimeHours = this.filteredOvertimes.reduce(
        (total, overtime) => total + overtime.hours,
        0
      );

      const chartDom = this.$refs.overtimeDonutChart;
      if (!chartDom) return;

      let chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.dispose(); // ทำลาย instance เก่า
      }

      chart = echarts.init(chartDom);
      const option = {
        title: {
          text: this.t("hrsOT"),
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            name: "OT",
            type: "pie",
            radius: ["50%", "70%"], // ทำให้เป็นกราฟโดนัท
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [{ value: totalOvertimeHours, name: this.t("hrsOT") }],
          },
        ],
      };
      chart.setOption(option);
    },
    destroyCharts() {
      if (this.$refs.leaveDonutChart) {
        const leaveDonutChart = echarts.getInstanceByDom(
          this.$refs.leaveDonutChart
        );
        if (leaveDonutChart) leaveDonutChart.dispose(); // ทำลาย instance เดิม
      }

      if (this.$refs.barChart) {
        const barChart = echarts.getInstanceByDom(this.$refs.barChart);
        if (barChart) barChart.dispose(); // ทำลาย instance เดิม
      }

      if (this.$refs.overtimeDonutChart) {
        const overtimeDonutChart = echarts.getInstanceByDom(
          this.$refs.overtimeDonutChart
        );
        if (overtimeDonutChart) overtimeDonutChart.dispose(); // ทำลาย instance เดิม
      }

      if (this.$refs.hiringRateChart) {
        const hiringRateChart = echarts.getInstanceByDom(
          this.$refs.hiringRateChart
        );
        if (hiringRateChart) hiringRateChart.dispose(); // ทำลาย instance เดิม
      }
    },
  },
  watch: {
    locale() {
      this.destroyCharts();
      this.$nextTick(() => {
        this.createAgeGroupBarChart();
        this.createHiringRateChart();
        this.createLeaveDonutChart();
        this.createOvertimeDonutChart();
      });
    },
  },
  created() {
    this.getLeave();
    this.getDepartment();
    this.getPosition();
    this.getEmployee();
    // this.getYears();
    // this.filterEmployee();
    this.$nextTick(() => {
      this.getYears();
      // this.filterEmployee();
    });
  },
};
</script>
