function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "123") {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    renderGantt();
  } else {
    alert("Login gagal!");
  }
}

function logout() {
  location.reload();
}

function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "timeline") {
    loadCalendar();
  }
}

// INTERACTIVE GANTT
const tasks = [
  { name: "Pelatihan", duration: 30 },
  { name: "Workshop", duration: 50 },
  { name: "Evaluasi", duration: 70 }
];

function renderGantt() {
  const gantt = document.getElementById("gantt");
  gantt.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "gantt-task";

    const label = document.createElement("p");
    label.innerText = task.name;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = task.duration + "%";

    // drag feature
    bar.onmousedown = function (e) {
      document.onmousemove = function (e) {
        let newWidth = e.clientX - bar.getBoundingClientRect().left;
        bar.style.width = newWidth + "px";
      };
      document.onmouseup = function () {
        document.onmousemove = null;
      };
    };

    div.appendChild(label);
    div.appendChild(bar);
    gantt.appendChild(div);
  });
}

// Upload file
function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const list = document.getElementById("fileList");

  if (fileInput.files.length > 0) {
    const li = document.createElement("li");
    li.textContent = fileInput.files[0].name;
    list.appendChild(li);
  }
}

// Evaluasi
function saveEvaluasi() {
  const text = document.getElementById("evaluasiText").value;
  document.getElementById("result").innerText = "Tersimpan: " + text;
}

// DARK MODE
function toggleMode() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}


function login() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

async function loadCalendar() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhdfDh-auPwqbmyD1A9n8tjzihyS-HgxgQidL9VMYX9sWjlU_yKvQuReR-MWdcrcjZpBOOVZxSH7Ci/pub?gid=0&single=true&output=csv";

  const res = await fetch(url);
  const data = await res.text();

  const rows = data.split("\n").slice(1);
  const calendar = document.getElementById("calendar");

  calendar.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let events = {};

  rows.forEach(row => {
    const cols = row.split(",");
    if (cols.length >= 3) {
      const date = new Date(cols[1]);
      const day = date.getDate();

      if (!events[day]) events[day] = [];
      events[day].push(cols[0]);
    }
  });

  // kosong sebelum tanggal 1
  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  // isi kalender
  for (let d = 1; d <= totalDays; d++) {
    let html = `<div class="day">
      <div class="day-number">${d}</div>`;

    if (events[d]) {
      events[d].forEach(ev => {
        html += `<div class="event-item">${ev}</div>`;
      });
    }

    html += `</div>`;
    calendar.innerHTML += html;
  }
}