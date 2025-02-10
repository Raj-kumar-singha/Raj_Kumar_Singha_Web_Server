
const express = require("express"),
    app = express(),
    { connectDB } = require("./config/dbConfig"),
    { PORT } = require("./config/serverConfig"),
    rateLimit = require('express-rate-limit'),
    allRoutes = require("./routes/index");

// Create a limiter
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too Many request Occured"
});

app.use(limiter);
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', allRoutes);

// Error-handling
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Bad Request',
    });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running, http://localhost:${PORT}`)
});