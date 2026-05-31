// --- 1. LẤY DOM ELEMENTS ---
const btnOpenAddForm = document.getElementById('btnOpenAddForm');
const btnCloseForm = document.getElementById('btnCloseForm');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const modalTitle = document.getElementById('modalTitle');

const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const incompleteTasksEl = document.getElementById('incompleteTasks');

// Khởi tạo mảng dữ liệu từ LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// --- 2. CÁC HÀM XỬ LÝ LOGIC ---

// Hàm Cập nhật thống kê
function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const incomplete = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    incompleteTasksEl.textContent = incomplete;
}

// Hàm format class theo mức ưu tiên
function getPriorityClass(priority) {
    if (priority === 'Cao') return 'badge-cao';
    if (priority === 'Bình thường') return 'badge-binh-thuong';
    return 'badge-thap';
}

// Hàm Hiển thị danh sách công việc
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Chưa có công việc nào. Hãy thêm mới!</p>';
    } else {
        tasks.forEach((task, index) => {
            const card = document.createElement('div');
            card.className = `task-card ${task.isCompleted ? 'completed' : ''}`;
            
            card.innerHTML = `
                <h3>${task.title}</h3>
                <span class="task-badge ${getPriorityClass(task.priority)}">${task.priority}</span>
                <p><strong>Hạn:</strong> ${task.dueDate}</p>
                <p>${task.desc || 'Không có mô tả.'}</p>
                
                <div class="task-actions">
                    <button class="btn btn-sm ${task.isCompleted ? 'btn-secondary' : 'btn-success'}" onclick="toggleStatus(${index})">
                        ${task.isCompleted ? 'Đánh dấu Chưa xong' : '✔ Hoàn thành'}
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editTask(${index})">✏️ Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">🗑️ Xóa</button>
                </div>
            `;
            taskList.appendChild(card);
        });
    }
    updateStatistics();
}

// Lưu xuống LocalStorage và render lại
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Hàm Xóa công việc
function deleteTask(index) {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        tasks.splice(index, 1);
        saveTasks();
        alert("Xóa thành công!");
    }
}

// Hàm Đổi trạng thái Hoàn thành
function toggleStatus(index) {
    tasks[index].isCompleted = !tasks[index].isCompleted;
    saveTasks();
}

// Hàm Đẩy dữ liệu lên form để Sửa
function editTask(index) {
    const task = tasks[index];
    
    document.getElementById('editIndex').value = index;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.desc;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    
    modalTitle.textContent = "Cập nhật công việc";
    taskModal.classList.remove('hidden');
}

// Hàm Reset form
function resetForm() {
    taskForm.reset();
    document.getElementById('editIndex').value = '-1';
    modalTitle.textContent = "Thêm mới công việc";
}

// --- 3. GẮN SỰ KIỆN ---

// Bấm nút thêm
btnOpenAddForm.addEventListener('click', () => {
    resetForm();
    taskModal.classList.remove('hidden');
});

// Bấm hủy form
btnCloseForm.addEventListener('click', () => {
    taskModal.classList.add('hidden');
});

// Lưu form (Thêm hoặc Sửa)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        desc: document.getElementById('taskDesc').value.trim(),
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        isCompleted: false // Mặc định tạo mới là chưa hoàn thành
    };
    
    const editIndex = document.getElementById('editIndex').value;
    
    if (editIndex === '-1') {
        // Thêm mới
        tasks.push(taskData);
        alert("Đã thêm công việc!");
    } else {
        // Giữ lại trạng thái hoàn thành cũ nếu đang sửa
        taskData.isCompleted = tasks[editIndex].isCompleted;
        tasks[editIndex] = taskData;
        alert("Đã cập nhật công việc!");
    }
    
    saveTasks();
    taskModal.classList.add('hidden');
});

// --- 4. KHỞI CHẠY LẦN ĐẦU ---
renderTasks();