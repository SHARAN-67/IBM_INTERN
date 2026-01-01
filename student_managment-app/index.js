const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

//Adding Routers
const studentRouters = require('./routers/studentRouters');
app.use('/students', studentRouters);

app.get('/', (req, res) => {
    res.send('Student Management API is running');
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
