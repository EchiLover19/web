const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));

let items = [
  {
    id: 1,
    subjectName: "Математика",
    teacher: "Иванов И.И.",
    semester: 1,
    hours: 120,
  },
  {
    id: 2,
    subjectName: "Программирование",
    teacher: "Петров П.П.",
    semester: 2,
    hours: 180,
  },
];

app.get("/", (req, res) => {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.subjectName}</td>
          <td>${item.teacher}</td>
          <td>${item.semester}</td>
          <td>${item.hours}</td>
          <td>
            <form method="POST" action="/delete/${item.id}" style="display:inline">
              <button type="submit">❌ Удалить</button>
            </form>
          </td>
        </tr>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Учебные дисциплины</title>
      <style>
        table { border-collapse: collapse; width: 700px; }
        td, th { border: 1px solid #ccc; padding: 8px; }
        button { cursor: pointer; }
        form { margin: 0; }
        input { margin-right: 5px; }
      </style>
    </head>
    <body>
      <h2>Список учебных дисциплин</h2>

      <table>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Преподаватель</th>
          <th>Семестр</th>
          <th>Часы</th>
          <th>Действия</th>
        </tr>
        ${rows}
      </table>

      <form method="POST" action="/add">
        <h3>Добавить дисциплину</h3>
        <input name="subjectName" placeholder="Название" required />
        <input name="teacher" placeholder="Преподаватель" required />
        <input name="semester" type="number" placeholder="Семестр" required />
        <input name="hours" type="number" placeholder="Часы" required />
        <button type="submit">Добавить</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/add", (req, res) => {
  const { subjectName, teacher, semester, hours } = req.body;

  items.push({
    id: items.length + 1, // уникальный id
    subjectName,
    teacher,
    semester: Number(semester),
    hours: Number(hours),
  });

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  items = items.filter((item) => item.id !== id);

  res.redirect("/");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
