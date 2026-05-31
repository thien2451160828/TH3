// --- 1. LẤY CÁC PHẦN TỬ DOM ---
const btnOpenAddForm = document.getElementById('btnOpenAddForm');
const btnCloseForm = document.getElementById('btnCloseForm');
const studentModal = document.getElementById('studentModal');
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const modalTitle = document.getElementById('modalTitle');

const totalStudentsEl = document.getElementById('totalStudents');
const avgScoreEl = document.getElementById('avgScore');

// Mảng lưu dữ liệu, đọc từ localStorage khi khởi tạo
let students = JSON.parse(localStorage.getItem('students')) || [];

// --- 2. CÁC HÀM XỬ LÝ (LOGIC & RENDER) ---

// Cập nhật thống kê
function updateStatistics() {
    totalStudentsEl.textContent = students.length;
    
    if (students.length === 0) {
        avgScoreEl.textContent = '0.0';
        return;
    }
    
    const totalGpa = students.reduce((sum, student) => sum + parseFloat(student.gpa), 0);
    const avg = (totalGpa / students.length).toFixed(2);
    avgScoreEl.textContent = avg;
}

// Render dữ liệu ra bảng
function renderStudents() {
    studentTableBody.innerHTML = ''; // Xóa sạch bảng cũ
    
    if (students.length === 0) {
        studentTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Chưa có sinh viên nào.</td></tr>`;
    } else {
        students.forEach((student, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.dob}</td>
                <td>${student.className}</td>
                <td>${student.email}</td>
                <td>${parseFloat(student.gpa).toFixed(1)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editStudent(${index})">✏️ Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">🗑️ Xóa</button>
                </td>
            `;
            studentTableBody.appendChild(tr);
        });
    }
    updateStatistics(); // Cập nhật luôn thống kê sau khi render
}

// Lưu dữ liệu xuống LocalStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
}

// Hàm Xóa sinh viên
function deleteStudent(index) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) { // Xác nhận trước khi xóa
        students.splice(index, 1);
        saveStudents();
        alert("Xóa thành công!");
    }
}

// Hàm Đẩy dữ liệu lên form để Sửa
function editStudent(index) {
    const student = students[index];
    
    // Đổ dữ liệu vào input
    document.getElementById('editIndex').value = index;
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullName').value = student.name;
    document.getElementById('dob').value = student.dob;
    document.getElementById('className').value = student.className;
    document.getElementById('email').value = student.email;
    document.getElementById('gpa').value = student.gpa;
    
    // Đổi tiêu đề và mở popup
    modalTitle.textContent = "Cập nhật sinh viên";
    studentModal.classList.remove('hidden');
}

// Reset Form về mặc định
function resetForm() {
    studentForm.reset();
    document.getElementById('editIndex').value = '-1';
    modalTitle.textContent = "Thêm mới sinh viên";
}


// --- 3. GẮN SỰ KIỆN (EVENT LISTENERS) ---

// Mở form
btnOpenAddForm.addEventListener('click', () => {
    resetForm();
    studentModal.classList.remove('hidden');
});

// Đóng form
btnCloseForm.addEventListener('click', () => {
    studentModal.classList.add('hidden');
});

// Xử lý khi Submit form (Dùng chung cho cả Thêm và Sửa)
studentForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Chặn hành vi tải lại trang mặc định của form
    
    // Lấy dữ liệu từ các ô input
    const studentData = {
        id: document.getElementById('studentId').value.trim(),
        name: document.getElementById('fullName').value.trim(),
        dob: document.getElementById('dob').value,
        className: document.getElementById('className').value.trim(),
        email: document.getElementById('email').value.trim(),
        gpa: document.getElementById('gpa').value
    };
    
    const editIndex = document.getElementById('editIndex').value;
    
    // Kiểm tra xem là Thêm mới hay Sửa
    if (editIndex === '-1') {
        // Thêm mới
        students.push(studentData);
        alert("Thêm sinh viên thành công!");
    } else {
        // Cập nhật
        students[editIndex] = studentData;
        alert("Cập nhật thông tin thành công!");
    }
    
    saveStudents();
    studentModal.classList.add('hidden'); // Đóng form
});

// --- 4. KHỞI CHẠY KHI TẢI TRANG ---
renderStudents();