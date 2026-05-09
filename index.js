// Import required packages
const express = require("express");

// Import routes
const urlRoute = require('./routes/url');

// Import MongoDB connection function
const { connectToMongoDB } = require('./connect');

// Import URL model
const URL = require('./models/url');

// Create express app
const app = express();

// Server port
const PORT = 3000;

// Connect MongoDB database
connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(() => console.log("mongodb connected successfully"))
.catch((err) => console.log("Mongo Error", err));

// Middleware to read JSON data
app.use(express.json());

// Base route for URL APIs
app.use("/url", urlRoute);

// Redirect route using shortId
app.get('/:shortid', async (req, res) => {

    // Get short id from URL params
    const shortid = req.params.shortid;

    // Find URL and update visit history
    const entry = await URL.findOneAndUpdate(
        {
            shortId: shortid,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    // If short URL not found
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    // Redirect user to original URL
    res.redirect(entry.redirectURL);
});

// Start server
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});