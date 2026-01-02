const express = require('express');
const router = express.Router();

// In-Memory Student Data
let students = [
  { id: 1, name: "Aryaa", department: "ECE", age: 20 },
  { id: 2, name: "Balaji", department: "CSE", age: 21 }
];

/* ---------------- READ ---------------- */

router.get('/', (req, res) => {
  res.json(students);
});

/* ---------------- CREATE ---------------- */

router.post('/', (req, res) => {
  const { id, name, department, age } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  if (students.some(s => s.id === id)) {
    return res.status(409).json({ message: "Student ID already exists" });
  }

  students.push({ id, name, department, age });

  res.status(201).json({
    message: "Student added successfully",
    students
  });
});

router.post('/bulk', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: "Expected array of students" });
  }

  req.body.forEach(({ id, name, department, age }) => {
    if (id && !students.some(s => s.id === id)) {
      students.push({ id, name, department, age });
    }
  });

  res.status(201).json({
    message: "Students added successfully",
    students
  });
});

/* ---------------- UPDATE ---------------- */

// ✅ Update Student By ID (ANY field)
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, department, age } = req.body;

  const index = students.findIndex(student => student.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  if (name !== undefined) students[index].name = name;
  if (department !== undefined) students[index].department = department;
  if (age !== undefined) students[index].age = age;

  res.json({
    message: "Student updated successfully",
    students
  });
});

// ✅ Update Multiple Students (ANY fields)
router.put('/', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: "Expected array of students" });
  }

  req.body.forEach(({ id, name, department, age }) => {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      if (name !== undefined) students[index].name = name;
      if (department !== undefined) students[index].department = department;
      if (age !== undefined) students[index].age = age;
    }
  });

  res.json({
    message: "Students updated successfully",
    students
  });
});

/* ---------------- DELETE ---------------- */

// DELETE single Student
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const before = students.length;

  students = students.filter(student => student.id !== id);

  if (students.length === before) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json({
    message: "Student deleted successfully",
    students
  });
});
 // DELETE Multiple Students
router.delete('/', (req, res) => {
  const ids = Array.isArray(req.body) ? req.body : req.body?.ids;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ message: "Expected array of IDs" });
  }

  const before = students.length;
  students = students.filter(student => !ids.includes(student.id));

  res.json({
    message: "Students deleted successfully",
    removedCount: before - students.length,
    students
  });
});

// Export Router
module.exports = router;
