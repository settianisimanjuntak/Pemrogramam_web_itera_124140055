
"use strict";

// Mengamankan teks sebelum ditampilkan ke HTML
const escapeHTML = (value) => {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
};

// Class untuk membentuk objek tugas
class TaskItem {
    constructor({
        id = Date.now().toString() + Math.random().toString(16).slice(2),
        title,
        course,
        deadline,
        priority = "Sedang",
        completed = false
    }) {
        this.id = String(id);
        this.title = title;
        this.course = course;
        this.deadline = deadline;
        this.priority = priority;
        this.completed = completed;
    }
}

// Class utama untuk mengelola dashboard
class DashboardApp {
    constructor() {
        this.storageKey = "it er a_student_tasks".replaceAll(" ", "");
        this.tasks = this.loadTasks();

        this.form = document.querySelector("#task-form");
        this.taskList = document.querySelector("#task-list");
        this.taskIdInput = document.querySelector("#task-id");
        this.titleInput = document.querySelector("#task-title");
        this.courseInput = document.querySelector("#task-course");
        this.deadlineInput = document.querySelector("#task-deadline");
        this.priorityInput = document.querySelector("#task-priority");
        this.filterInput = document.querySelector("#task-filter");

        this.init();
    }

    // Mengambil data tugas dari localStorage
    loadTasks() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            const parsedData = savedData ? JSON.parse(savedData) : [];

            if (!Array.isArray(parsedData)) {
                return [];
            }

            return parsedData.map((task) => new TaskItem(task));
        } catch (error) {
            console.error("Gagal membaca data tugas:", error);
            return [];
        }
    }

    // Menyimpan data ke localStorage
    saveTasks() {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(this.tasks)
        );
    }

    // Menyiapkan event dan tampilan awal
    init() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        this.filterInput.addEventListener("change", () => {
            this.renderTasks();
        });

        document.querySelector("#cancel-edit").addEventListener("click", () => {
            this.resetForm();
        });

        document.querySelector("#refresh-weather").addEventListener("click", () => {
            this.loadWeather();
        });

        document.querySelector("#current-date").textContent =
            new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(new Date());

        this.renderTasks();
        this.loadWeather();
    }

    // Menambah atau mengedit tugas
    handleSubmit() {
        const id = this.taskIdInput.value;

        const taskData = {
            title: this.titleInput.value.trim(),
            course: this.courseInput.value.trim(),
            deadline: this.deadlineInput.value,
            priority: this.priorityInput.value
        };

        if (!taskData.title || !taskData.course || !taskData.deadline) {
            alert("Silakan lengkapi semua data tugas.");
            return;
        }

        if (id) {
            this.tasks = this.tasks.map((task) =>
                task.id === id
                    ? new TaskItem({
                        ...task,
                        ...taskData,
                        id: task.id,
                        completed: task.completed
                    })
                    : task
            );
        } else {
            this.tasks = [
                ...this.tasks,
                new TaskItem(taskData)
            ];
        }

        this.saveTasks();
        this.renderTasks();
        this.resetForm();
    }

    // Menampilkan tugas berdasarkan filter
    renderTasks() {
        const filter = this.filterInput.value;

        const filteredTasks = this.tasks.filter((task) => {
            if (filter === "belum") return !task.completed;
            if (filter === "selesai") return task.completed;
            return true;
        });

        this.taskList.innerHTML = filteredTasks.length
            ? filteredTasks.map((task) => this.createTaskHTML(task)).join("")
            : `<div class="empty-state">
                   <p>Belum ada tugas pada kategori ini.</p>
                   <p>Tambahkan tugas melalui formulir.</p>
               </div>`;

        this.updateStats();
    }

    // Membentuk tampilan setiap tugas
    createTaskHTML({
        id,
        title,
        course,
        deadline,
        priority,
        completed
    }) {
        const safeId = escapeHTML(id);
        const safeTitle = escapeHTML(title);
        const safeCourse = escapeHTML(course);
        const safeDeadline = escapeHTML(deadline);
        const safePriority = escapeHTML(priority);

        const deadlineText = deadline
            ? new Date(deadline + "T00:00:00").toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
            : "-";

        const safeDeadlineText = escapeHTML(deadlineText);

        return `
            <article class="task-item ${completed ? "completed" : ""}">
                <div class="task-top">
                    <div>
                        <h3>${safeTitle}</h3>
                        <p class="task-meta">
                            Mata kuliah: ${safeCourse}
                        </p>
                    </div>
                    <span class="priority ${safePriority}">
                        ${safePriority}
                    </span>
                </div>

                <p class="task-meta">
                    Deadline: ${safeDeadlineText}
                </p>

                <div class="task-actions">
                    <button class="complete-button"
                        data-action="toggle" data-id="${safeId}">
                        ${completed ? "Batalkan selesai" : "Tandai selesai"}
                    </button>

                    <button class="edit-button"
                        data-action="edit" data-id="${safeId}">
                        Edit
                    </button>

                    <button class="delete-button"
                        data-action="delete" data-id="${safeId}">
                        Hapus
                    </button>
                </div>
            </article>
        `;
    }

    // Menangani klik tombol pada daftar tugas
    handleTaskAction(action, id) {
        if (action === "toggle") {
            this.tasks = this.tasks.map((task) =>
                task.id === id
                    ? new TaskItem({
                        ...task,
                        completed: !task.completed
                    })
                    : task
            );
        }

        if (action === "delete") {
            const confirmed = confirm("Yakin ingin menghapus tugas ini?");

            if (!confirmed) return;

            this.tasks = this.tasks.filter((task) => task.id !== id);
        }

        if (action === "edit") {
            const task = this.tasks.find((item) => item.id === id);

            if (!task) return;

            this.taskIdInput.value = task.id;
            this.titleInput.value = task.title;
            this.courseInput.value = task.course;
            this.deadlineInput.value = task.deadline;
            this.priorityInput.value = task.priority;

            document.querySelector("#form-title").textContent = "Edit Tugas";
            document.querySelector("#submit-button").textContent = "Simpan Perubahan";
            document.querySelector("#cancel-edit").hidden = false;

            this.titleInput.focus();
            return;
        }

        this.saveTasks();
        this.renderTasks();
    }

    // Memperbarui jumlah tugas
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter((task) => task.completed).length;
        const pending = total - completed;

        document.querySelector("#total-tasks").textContent = total;
        document.querySelector("#pending-tasks").textContent = pending;
        document.querySelector("#completed-tasks").textContent = completed;
    }

    // Mengembalikan formulir ke kondisi awal
    resetForm() {
        this.form.reset();
        this.taskIdInput.value = "";

        document.querySelector("#form-title").textContent = "Tambah Tugas";
        document.querySelector("#submit-button").textContent = "Simpan Tugas";
        document.querySelector("#cancel-edit").hidden = true;

        this.priorityInput.value = "Sedang";
    }

    // Mengambil cuaca dari API Open-Meteo menggunakan async/await
    async loadWeather() {
        const tempElement = document.querySelector("#weather-temp");
        const descElement = document.querySelector("#weather-desc");
        const iconElement = document.querySelector(".weather-icon");

        tempElement.textContent = "Memuat cuaca...";
        descElement.textContent = "Bandar Lampung, Lampung";

        try {
            const url =
                "https://api.open-meteo.com/v1/forecast" +
                "?latitude=-5.36&longitude=105.31&current_weather=true";

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Gagal mengambil data cuaca.");
            }

            const data = await response.json();
            const { temperature, weathercode, windspeed } = data.current_weather;

            tempElement.textContent = `${temperature} °C`;
            descElement.textContent =
                `${this.getWeatherDescription(weathercode)} | Angin ${windspeed} km/jam`;

            iconElement.textContent = this.getWeatherIcon(weathercode);
        } catch (error) {
            console.error("Cuaca tidak dapat dimuat:", error);
            tempElement.textContent = "Tidak tersedia";
            descElement.textContent = "Periksa koneksi internet lalu coba lagi.";
            iconElement.textContent = "🌤️";
        }
    }

    // Mengubah kode cuaca menjadi deskripsi
    getWeatherDescription(code) {
        if (code === 0) return "Cerah";
        if ([1, 2].includes(code)) return "Cerah berawan";
        if (code === 3) return "Berawan";
        if ([45, 48].includes(code)) return "Berkabut";
        if ([51, 53, 55, 56, 57].includes(code)) return "Gerimis";
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Hujan";
        if ([71, 73, 75, 77, 85, 86].includes(code)) return "Salju";
        if ([95, 96, 99].includes(code)) return "Badai petir";
        return "Kondisi cuaca lainnya";
    }

    // Memilih ikon berdasarkan kode cuaca
    getWeatherIcon(code) {
        if (code === 0) return "☀️";
        if ([1, 2, 3].includes(code)) return "🌤️";
        if ([45, 48].includes(code)) return "🌫️";
        if ([95, 96, 99].includes(code)) return "⛈️";
        if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
        if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
            return "🌧️";
        }

        return "🌥️";
    }
}

// Membuat aplikasi setelah halaman HTML siap
document.addEventListener("DOMContentLoaded", () => {
    const app = new DashboardApp();

    // Event delegation untuk tombol dalam daftar tugas
    app.taskList.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const { action, id } = button.dataset;
        app.handleTaskAction(action, id);
    });
});
