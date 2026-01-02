const express = require('express');
const router = express.Router();

// In-memory Student Data
let students = [
  { id: 1, name: "Aryaa", department: "ECE", age: 20 },
  { id: 2, name: "Balaji", department: "CSE", age: 21 }
];

/* ---------------- READ ---------------- */

// Get all students
router.get('/', (req, res) => {
  res.status(200).json(students);
});

/* ---------------- CREATE ---------------- */

// Create single student
router.post('/', (req, res) => {
  const { id, name, department, age } = req.body;

  if (id === undefined || name === undefined || department === undefined || age === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (students.some(s => s.id === Number(id))) {
    return res.status(409).json({ message: "Student ID already exists" });
  }

  const student = {
    id: Number(id),
    name,
    department,
    age: Number(age)
  };

  students.push(student);

  res.status(201).json({
    message: "Student added successfully",
    student
  });
});

// Create multiple students
router.post('/bulk', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: "Expected array of students" });
  }

  let added = [];
  let skipped = [];

  req.body.forEach(({ id, name, department, age }) => {
    if (
      id === undefined ||
      name === undefined ||
      department === undefined ||
      age === undefined ||
      students.some(s => s.id === Number(id))
    ) {
      skipped.push({ id, name, department, age });
    } else {
      const student = {
        id: Number(id),
        name,
        department,
        age: Number(age)
      };
      students.push(student);
      added.push(student);
    }
  });

  res.status(201).json({
    message: "Bulk insert completed",
    added,
    skipped
  });
});

/* ---------------- UPDATE ---------------- */

// Update student by ID (partial update)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, department, age } = req.body;

  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  if (name !== undefined) student.name = name;
  if (department !== undefined) student.department = department;
  if (age !== undefined) student.age = Number(age);

  res.status(200).json({
    message: "Student updated successfully",
    student
  });
});

// Update multiple students
router.put('/', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: "Expected array of students" });
  }

  let updated = [];
  let notFound = [];

  req.body.forEach(({ id, name, department, age }) => {
    const student = students.find(s => s.id === Number(id));
    if (student) {
      if (name !== undefined) student.name = name;
      if (department !== undefined) student.department = department;
      if (age !== undefined) student.age = Number(age);
      updated.push(student);
    } else {
      notFound.push(id);
    }
  });

  res.status(200).json({
    message: "Students updated",
    updated,
    notFound
  });
});

/* ---------------- DELETE ---------------- */

// Delete single student by ID
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deleted = students.splice(index, 1);

  res.status(200).json({
    message: "Student deleted successfully",
    deleted: deleted[0]
  });
});

// Delete multiple students
router.delete('/', (req, res) => {
  const ids = Array.isArray(req.body) ? req.body : req.body?.ids;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ message: "Expected array of IDs" });
  }

  const idSet = ids.map(Number);
  const before = students.length;

  students = students.filter(s => !idSet.includes(s.id));

  res.status(200).json({
    message: "Students deleted successfully",
    removedCount: before - students.length
  });
});

// Export router
module.exports = router;
