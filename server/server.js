const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/db");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
const User = require("./models/user.model");
const Post = require("./models/post.model");
const sharp = require('sharp');
const path = require('path');

function verifyToken() {
    jwt.verify(req.body, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return "error in verifying token"
        }

    })
}

function generateToken(req, res, next) {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3000 }, (err, data) => {
        if (err) {
            res.send("error in generating token");
        }
        else {
            next();
        }
    })
}


app.post("/login", async (req, res) => {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email, password: req.body.password }, { password: 0, profilePicture: 0, resizedProfilePicture: 0 }).lean();
    if (user) {
        jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 3000 }, (err, token) => {
            if (err) {
                console.log(err);
                res.status(500).json({ status: "FAILED", message: "Error in generating token" });
            } else {
                console.log("Generated token:", token);
                res.cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false
                });
                res.status(200).json({ status: "SUCCESS", user: user });
            }
        });
    } else {
        res.status(401).json({ status: "FAILED", message: "Invalid password" });
    }
});




app.get("/isLoggedIn", (req, res) => {
    console.log("whatch this", req.cookies);
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).json({ status: "FAILED", message: "Failed to verify Token please login" })
        }
        else {
            res.status(200).json({ status: "SUCCESS", user: data });
        }
    })
})



app.post("/signup", async (req, res) => {
    try {
        let data = await new User(req.body);
        data = await data.save();
        console.log(data);
        res.status(201).json({ status: "SUCCESS", user: data });
    }
    catch (e) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.post("/signin", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    }
    catch (e) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.get("/profile/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id, { password: 0 });
        if (user) {
            return res.status(200).json({ status: "SUCCESS", user });
        }
        else {
            return res.status(404).json({ status: "FAILED", message: "User not found" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
})

// posts

app.get("/getPost", async (req, res) => {
    try {
        const posts = await Post.find().populate("userId","userName resizedProfilePicture").limit(10);
        return res.status(200).json(posts);

    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
app.post("/addPost", async (req, res) => {
    // console.log(req.body);
    console.log("cookie", req.cookies.access_token);
    let user;
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            console.log("err", err);
        }
        else {
            console.log("data", data);
            req.user = data;
        }
    })
    try {
        let obj = { ...req.body, userId: req.user._id, userName: req.user.userName };
        let post = await new Post(obj);
        post = await post.save();
        return res.status(201).json({ status: "SUCCESS", message: "Post Created Successfully" });
    }
    catch (e) {
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });

    }
})

app.post("/addRating", async (req, res) => {
    console.log("rating", req.body);
    try {
        let post = await Post.findById(req.body.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post = post.toObject();
        console.log("post", post.overAllRatings, post.noOfRatings);
        let newOverallRatings = post.overAllRatings * post.noOfRatings + req.body.rating;
        newOverallRatings = newOverallRatings / (post.noOfRatings + 1);
        await Post.updateOne({ _id: req.body.postId }, { $set: { noOfRatings: post.noOfRatings + 1, overAllRatings: newOverallRatings } });
        return res.status(200).json({ message: "Rating added successfully" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

app.get("/userPosts/:id", async (req, res) => {
    try {
        console.log("bkdnbdj", req.params.id);
        let posts = await Post.find({ userId: req.params.id });
        console.log("posts", posts);
        return res.status(200).json({ status: "SUCCESS", posts: posts });
    }
    catch (e) {
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
})

app.get("/logout", (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });
    res.status(200).json({ status: "SUCCESS", message: "Logged out successfully" });
});

app.post("/updateProfilePicture", async (req, res) => {
    console.log("cookie", req.cookies.access_token);
    let user;
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            console.log("err", err);
            return res.status(401).json({ status: "FAILED", message: "Failed to verify Token please login" });
        } else {
            console.log("data", data);
            req.user = data;
        }
    });
    try {
        const { profilePicture } = req.body;

        if (!profilePicture) return res.status(400).json({ error: 'No image provided' });

        const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const outputPath = path.join(__dirname, 'resized', `resized-${Date.now()}.jpg`);
        const resizedBuffer = await sharp(buffer)
            .resize({ width: 800 })
            .jpeg({ quality: 30 })
            .toBuffer();

        const base64Resized = `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
        await User.updateOne({ _id: req.user._id }, { $set: { profilePicture: req.body.profilePicture, resizedProfilePicture: base64Resized } });
        return res.status(200).json({ status: "SUCCESS", message: "Profile picture updated successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});


app.post("/followUser", async (req, res) => {
    console.log("cookie", req.cookies.access_token);
    let user;
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            console.log("err", err);
            return res.status(401).json({ status: "FAILED", message: "Failed to verify Token please login" });
        } else {
            console.log("data", data);
            req.user = data;
        }
    });
    try {
        await User.updateOne({ _id: req.user._id }, { $addToSet: { following: req.body.followingId } });
        await User.updateOne({ _id: req.body.followingId }, { $addToSet: { followers: req.user._id } });
        return res.status(200).json({ status: "SUCCESS", message: "User followed successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});
app.post("/unfollowUser", async (req, res) => {
    console.log("cookie", req.cookies.access_token);
    let user;
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            console.log("err", err);
            return res.status(401).json({ status: "FAILED", message: "Failed to verify Token please login" });
        } else {
            console.log("data", data);
            req.user = data;
        }
    });
    try {
        await User.updateOne({ _id: req.user._id }, { $pull: { following: req.body.followingId } });
        await User.updateOne({ _id: req.body.followingId }, { $pull: { followers: req.user._id } });
        return res.status(200).json({ status: "SUCCESS", message: "User unfollowed successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});


app.post('/upload-base64', async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const outputPath = path.join(__dirname, 'resized', `resized-${Date.now()}.jpg`);
        const resizedBuffer = await sharp(buffer)
            .resize({ width: 800 })
            .jpeg({ quality: 30 })
            .toBuffer();

        const base64Resized = `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
        res.json({ resizedImage: base64Resized });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error resizing image');
    }
});



app.listen(process.env.PORT, () => {
    console.log("Server running at Port ", process.env.PORT);
});