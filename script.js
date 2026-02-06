// Định nghĩa lớp Student (Sinh viên)
class Student {
  constructor(studentId, fullName, birthDate, className, gpa) {
    this.studentId = studentId;
    this.fullName = fullName;
    this.birthDate = birthDate;
    this.className = className;
    this.gpa = parseFloat(gpa);
  }

  // Phương thức cập nhật thông tin sinh viên
  updateInfo(fullName, birthDate, className, gpa) {
    this.fullName = fullName;
    this.birthDate = birthDate;
    this.className = className;
    this.gpa = parseFloat(gpa);
  }

  // Phương thức lấy thông tin sinh viên dưới dạng chuỗi
  getInfo() {
    return `Mã SV: ${this.studentId}, Tên: ${this.fullName}, Ngày sinh: ${this.birthDate}, Lớp: ${this.className}, GPA: ${this.gpa}`;
  }

  // Phương thức format ngày sinh để hiển thị
  getFormattedBirthDate() {
    const date = new Date(this.birthDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Phương thức lấy điểm GPA đã được format
  getFormattedGPA() {
    return this.gpa.toFixed(2);
  }
}

// Lớp quản lý danh sách sinh viên
class StudentManager {
  constructor() {
    // Khởi tạo mảng sinh viên từ localStorage hoặc mảng rỗng
    this.students = this.loadFromStorage();
    this.editingStudentId = null;

    // Trạng thái sắp xếp: null (chưa sắp xếp), 'asc' (tăng dần), 'desc' (giảm dần)
    this.sortState = {
      byId: null,
      byGpa: null,
    };
  }

  // Thêm sinh viên mới
  addStudent(student) {
    // Kiểm tra xem mã sinh viên đã tồn tại chưa
    if (this.findStudentById(student.studentId)) {
      return false;
    }
    this.students.push(student);
    this.saveToStorage();
    return true;
  }

  // Tìm sinh viên theo mã
  findStudentById(studentId) {
    return this.students.find((s) => s.studentId === studentId);
  }

  // Cập nhật thông tin sinh viên
  updateStudent(studentId, fullName, birthDate, className, gpa) {
    const student = this.findStudentById(studentId);
    if (student) {
      student.updateInfo(fullName, birthDate, className, gpa);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Xóa sinh viên
  deleteStudent(studentId) {
    const index = this.students.findIndex((s) => s.studentId === studentId);
    if (index !== -1) {
      this.students.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Lấy tất cả sinh viên
  getAllStudents() {
    return this.students;
  }

  // Tìm kiếm sinh viên theo tên hoặc mã
  searchStudents(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return this.students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(lowerKeyword) ||
        s.studentId.toLowerCase().includes(lowerKeyword),
    );
  }

  // Sắp xếp theo mã sinh viên
  // direction: 'asc' cho tăng dần, 'desc' cho giảm dần
  sortByStudentId(direction = "asc") {
    const sorted = [...this.students];
    sorted.sort((a, b) => {
      if (direction === "asc") {
        return a.studentId.localeCompare(b.studentId);
      } else {
        return b.studentId.localeCompare(a.studentId);
      }
    });
    return sorted;
  }

  // Sắp xếp theo điểm GPA
  // direction: 'asc' cho tăng dần, 'desc' cho giảm dần
  sortByGPA(direction = "asc") {
    const sorted = [...this.students];
    sorted.sort((a, b) => {
      if (direction === "asc") {
        return a.gpa - b.gpa;
      } else {
        return b.gpa - a.gpa;
      }
    });
    return sorted;
  }

  // Lưu dữ liệu vào localStorage
  saveToStorage() {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  // Tải dữ liệu từ localStorage
  loadFromStorage() {
    const data = localStorage.getItem("students");
    if (data) {
      const parsedData = JSON.parse(data);
      // Chuyển đổi dữ liệu thành các đối tượng Student
      return parsedData.map(
        (s) =>
          new Student(s.studentId, s.fullName, s.birthDate, s.className, s.gpa),
      );
    }
    return [];
  }
}

// Khởi tạo quản lý sinh viên
const studentManager = new StudentManager();

// Các phần tử DOM
const studentForm = document.getElementById("student-form");
const studentIdInput = document.getElementById("student-id");
const fullNameInput = document.getElementById("full-name");
const birthDateInput = document.getElementById("birth-date");
const classNameInput = document.getElementById("class-name");
const gpaInput = document.getElementById("gpa");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const studentTbody = document.getElementById("student-tbody");
const searchInput = document.getElementById("search-input");
const studentCount = document.getElementById("student-count");
const noData = document.getElementById("no-data");
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const sortByIdBtn = document.getElementById("sort-by-id");
const sortByGpaBtn = document.getElementById("sort-by-gpa");

const requiredFields = [
  { input: studentIdInput, emptyMessage: 'Vui lòng nhập mã sinh viên.' },
  { input: fullNameInput, emptyMessage: 'Vui lòng nhập họ và tên.' },
  { input: birthDateInput, emptyMessage: 'Vui lòng chọn ngày sinh.' },
  { input: classNameInput, emptyMessage: 'Vui lòng nhập lớp.' },
  { input: gpaInput, emptyMessage: 'Vui lòng nhập điểm GPA.' },
];

function setFieldError(input, message) {
  const errorElement = document.getElementById(`${input.id}-error`);
  if (!errorElement) {
    return;
  }
  if (message) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
    input.classList.add("input-error");
  } else {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
    input.classList.remove("input-error");
  }
}

function validateField(input, emptyMessage) {
  const value = input.value.trim();
  if (!value) {
    setFieldError(input, emptyMessage);
    return false;
  }
  if (input === gpaInput) {
    const gpaValue = parseFloat(value);
    if (Number.isNaN(gpaValue)) {
      setFieldError(input, "Vui lòng nhập điểm GPA hợp lệ.");
      return false;
    }
    if (gpaValue < 0 || gpaValue > 4) {
      setFieldError(input, "Điểm GPA phải từ 0 đến 4.");
      return false;
    }
  }
  setFieldError(input, "");
  return true;
}

function validateForm() {
  let isValid = true;
  requiredFields.forEach(({ input, emptyMessage }) => {
    if (!validateField(input, emptyMessage)) {
      isValid = false;
    }
  });
  return isValid;
}

function clearFormErrors() {
  requiredFields.forEach(({ input }) => setFieldError(input, ""));
}

requiredFields.forEach(({ input, emptyMessage }) => {
  input.addEventListener("blur", () => {
    validateField(input, emptyMessage);
  });
  input.addEventListener("input", () => {
    if (input.classList.contains("input-error")) {
      validateField(input, emptyMessage);
    }
  });
});

let deleteStudentId = null;
let currentDisplayedStudents = []; // Lưu danh sách sinh viên hiện đang hiển thị

// Hàm hiển thị danh sách sinh viên
function displayStudents(students = studentManager.getAllStudents()) {
  currentDisplayedStudents = students; // Lưu lại danh sách đang hiển thị
  studentTbody.innerHTML = "";

  // Hiển thị thông báo nếu không có sinh viên
  if (students.length === 0) {
    noData.classList.add("show");
    studentTbody.parentElement.style.display = "none";
  } else {
    noData.classList.remove("show");
    studentTbody.parentElement.style.display = "table";

    // Thêm từng sinh viên vào bảng
    students.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.fullName}</td>
                <td>${student.getFormattedBirthDate()}</td>
                <td>${student.className}</td>
                <td>${student.getFormattedGPA()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning" onclick="editStudent('${student.studentId}')">Sửa</button>
                        <button class="btn btn-danger" onclick="showDeleteModal('${student.studentId}')">Xóa</button>
                    </div>
                </td>
            `;
      studentTbody.appendChild(row);
    });
  }

  // Cập nhật số lượng sinh viên
  updateStudentCount(students.length);
}

// Hàm cập nhật số lượng sinh viên
function updateStudentCount(count) {
  studentCount.textContent = `Tổng số: ${count} sinh viên`;
}

// Hàm reset trạng thái các nút sắp xếp
function resetSortButtons() {
  sortByIdBtn.classList.remove("active", "asc", "desc");
  sortByGpaBtn.classList.remove("active", "asc", "desc");
}

// Xử lý sắp xếp theo mã sinh viên
sortByIdBtn.addEventListener("click", function () {
  // Reset trạng thái nút GPA
  sortByGpaBtn.classList.remove("active", "asc", "desc");
  studentManager.sortState.byGpa = null;

  // Xác định hướng sắp xếp tiếp theo
  let direction;
  if (
    studentManager.sortState.byId === null ||
    studentManager.sortState.byId === "desc"
  ) {
    direction = "asc"; // Lần đầu hoặc sau khi giảm dần thì sắp xếp tăng dần
    studentManager.sortState.byId = "asc";
    this.classList.add("active", "asc");
    this.classList.remove("desc");
  } else {
    direction = "desc"; // Sau khi tăng dần thì sắp xếp giảm dần
    studentManager.sortState.byId = "desc";
    this.classList.add("active", "desc");
    this.classList.remove("asc");
  }

  // Thực hiện sắp xếp và hiển thị
  const sortedStudents = studentManager.sortByStudentId(direction);
  displayStudents(sortedStudents);
});

// Xử lý sắp xếp theo GPA
sortByGpaBtn.addEventListener("click", function () {
  // Reset trạng thái nút mã SV
  sortByIdBtn.classList.remove("active", "asc", "desc");
  studentManager.sortState.byId = null;

  // Xác định hướng sắp xếp tiếp theo
  let direction;
  if (
    studentManager.sortState.byGpa === null ||
    studentManager.sortState.byGpa === "asc"
  ) {
    direction = "desc"; // Lần đầu hoặc sau khi tăng dần thì sắp xếp giảm dần (GPA cao nhất trước)
    studentManager.sortState.byGpa = "desc";
    this.classList.add("active", "desc");
    this.classList.remove("asc");
  } else {
    direction = "asc"; // Sau khi giảm dần thì sắp xếp tăng dần
    studentManager.sortState.byGpa = "asc";
    this.classList.add("active", "asc");
    this.classList.remove("desc");
  }

  // Thực hiện sắp xếp và hiển thị
  const sortedStudents = studentManager.sortByGPA(direction);
  displayStudents(sortedStudents);
});

// Xử lý submit form
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const studentId = studentIdInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const birthDate = birthDateInput.value;
  const className = classNameInput.value.trim();
  const gpa = parseFloat(gpaInput.value);

  if (
    !studentManager.editingStudentId &&
    studentManager.findStudentById(studentId)
  ) {
    setFieldError(
      studentIdInput,
      "Mã sinh viên đã tồn tại. Vui lòng dùng mã khác.",
    );
    return;
  }

  // Kiểm tra xem đang ở chế độ thêm mới hay cập nhật
  if (studentManager.editingStudentId) {
    // Cập nhật sinh viên
    if (
      studentManager.updateStudent(
        studentManager.editingStudentId,
        fullName,
        birthDate,
        className,
        gpa,
      )
    ) {
      alert("Cập nhật thông tin sinh viên thành công!");
      resetForm();
      // Reset trạng thái sắp xếp và hiển thị lại danh sách
      resetSortButtons();
      studentManager.sortState.byId = null;
      studentManager.sortState.byGpa = null;
      displayStudents();
    }
  } else {
    // Thêm sinh viên mới
    const student = new Student(studentId, fullName, birthDate, className, gpa);
    if (studentManager.addStudent(student)) {
      alert("Thêm sinh viên thành công!");
      studentForm.reset();
      clearFormErrors();
      // Reset trạng thái sắp xếp và hiển thị lại danh sách
      resetSortButtons();
      studentManager.sortState.byId = null;
      studentManager.sortState.byGpa = null;
      displayStudents();
    }
  }
});

// Hàm chỉnh sửa sinh viên
function editStudent(studentId) {
  const student = studentManager.findStudentById(studentId);
  if (student) {
    // Điền thông tin vào form
    studentIdInput.value = student.studentId;
    studentIdInput.disabled = true; // Không cho phép thay đổi mã sinh viên
    fullNameInput.value = student.fullName;
    birthDateInput.value = student.birthDate;
    classNameInput.value = student.className;
    gpaInput.value = student.gpa;

    // Thay đổi tiêu đề và nút
    formTitle.textContent = "Cập Nhật Thông Tin Sinh Viên";
    submitBtn.textContent = "Cập Nhật";
    cancelBtn.style.display = "inline-block";

    // Lưu ID sinh viên đang được chỉnh sửa
    studentManager.editingStudentId = studentId;
    clearFormErrors();

    // Cuộn lên form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Hàm hiển thị modal xác nhận xóa
function showDeleteModal(studentId) {
  deleteStudentId = studentId;
  deleteModal.classList.add("show");
}

// Xử lý xác nhận xóa
confirmDeleteBtn.addEventListener("click", function () {
  if (deleteStudentId) {
    if (studentManager.deleteStudent(deleteStudentId)) {
      alert("Xóa sinh viên thành công!");
      // Reset trạng thái sắp xếp và hiển thị lại danh sách
      resetSortButtons();
      studentManager.sortState.byId = null;
      studentManager.sortState.byGpa = null;
      displayStudents();
      deleteModal.classList.remove("show");
      deleteStudentId = null;
    }
  }
});

// Xử lý hủy xóa
cancelDeleteBtn.addEventListener("click", function () {
  deleteModal.classList.remove("show");
  deleteStudentId = null;
});

// Đóng modal khi click bên ngoài
deleteModal.addEventListener("click", function (e) {
  if (e.target === deleteModal) {
    deleteModal.classList.remove("show");
    deleteStudentId = null;
  }
});

// Hàm reset form
function resetForm() {
  studentForm.reset();
  studentIdInput.disabled = false;
  formTitle.textContent = "Thêm Sinh Viên Mới";
  submitBtn.textContent = "Thêm Sinh Viên";
  cancelBtn.style.display = "none";
  studentManager.editingStudentId = null;
  clearFormErrors();
}

// Xử lý nút hủy
cancelBtn.addEventListener("click", resetForm);

// Xử lý tìm kiếm
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.trim();

  // Reset trạng thái sắp xếp khi tìm kiếm
  resetSortButtons();
  studentManager.sortState.byId = null;
  studentManager.sortState.byGpa = null;

  if (keyword) {
    const results = studentManager.searchStudents(keyword);
    displayStudents(results);
  } else {
    displayStudents();
  }
});

// Khởi tạo: Hiển thị danh sách sinh viên khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  displayStudents();

  // Thêm một số sinh viên mẫu nếu chưa có dữ liệu (chỉ để demo)
  if (studentManager.getAllStudents().length === 0) {
    const sampleStudents = [
      new Student("SV001", "Nguyễn Văn An", "2002-05-15", "CNTT-K15", 3.45),
      new Student("SV002", "Trần Thị Bình", "2002-08-20", "CNTT-K15", 3.78),
      new Student("SV003", "Lê Hoàng Cường", "2003-01-10", "KTPM-K16", 3.12),
      new Student("SV004", "Phạm Thu Hà", "2002-12-25", "CNTT-K15", 3.92),
      new Student("SV005", "Hoàng Minh Đức", "2003-03-08", "KTPM-K16", 2.88),
    ];

    sampleStudents.forEach((student) => {
      studentManager.addStudent(student);
    });

    displayStudents();
  }
});
