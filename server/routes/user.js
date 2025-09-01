const router=require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const sharp = require("sharp");
const path=require("multer");
const verifyToken = require("../middleware/verifyToken");
const bcrypt=require("bcrypt");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email }).lean();
        if (!existingUser) {
            return res.status(404).json({ status: "FAILED", message: "User with this email does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "FAILED", message: "Invalid password" });
        }
        console.log("existing user", existingUser);

        const { password: _,profilePicture,resizedProfilePicture, ...userWithoutSensitive } = existingUser;

        jwt.sign(userWithoutSensitive, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.status(500).json({ status: "FAILED", message: "Error generating token" });
            }

            res.cookie("access_token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false
            });

            delete existingUser.password; // Remove password from the response

            res.status(200).json({ status: "SUCCESS", user: existingUser });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "FAILED", message: "Internal server error" });
    }
});

router.get("/isLoggedIn",(req, res) => {
    console.log("watch this", req.cookies);
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, async(err, data) => {
        if (err) {
            res.status(401).json({ status: "FAILED", message: "Failed to verify Token please login" })
        }
        else {
            const user=await User.findById(data._id, { password: 0 }).lean();
            res.status(200).json({ status: "SUCCESS", user: user });
        }
    })
})


router.post("/signup", async (req, res) => {
    try {
        console.log(req.body);

        let existingUserWithEmail = await User.findOne({ email: req.body.email });
        if (existingUserWithEmail) {
            return res.status(409).json({ status: "FAILED", message: "User with this email already exists" });
        }
        let existingUserWithUserName = await User.findOne({ userName: req.body.userName });
        if (existingUserWithUserName) {
            return res.status(409).json({ status: "FAILED", message: "User with this username already exists" });
        }
        let hashedPassword = await bcrypt.hash(req.body.password,10); 
        const user={...req.body,password:hashedPassword}
        let savedUser = await new User(user);
        savedUser = await savedUser.save();
        console.log(savedUser);
        savedUser=savedUser.toObject();
        delete savedUser._id
        delete savedUser.password
        res.status(201).json({ status: "SUCCESS", user: savedUser });
    }
    catch (e) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.get("/profile/:id",verifyToken, async (req, res) => {
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


router.post("/updateProfilePicture",verifyToken, async (req, res) => {
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


router.post("/followUser",verifyToken, async (req, res) => {
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
router.post("/unfollowUser",verifyToken, async (req, res) => {
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


router.get("/search",verifyToken, async (req, res) => {
    try {
        const searchQuery = req.query.name;
        if (!searchQuery) {
            return res.status(400).json({ status: "FAILED", message: "Search query is required" });
        }
        const users = await User.find({
            $or: [
                { userName: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        }, { _id:1,userName:1,email:1,resizedProfilePicture:1 }).lean();

        return res.status(200).json({ status: "SUCCESS", users });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });
    res.status(200).json({ status: "SUCCESS", message: "Logged out successfully" });
});

module.exports=router;