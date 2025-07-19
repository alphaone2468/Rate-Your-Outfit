const router=require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const sharp = require("sharp");
const path=require("multer");
const verifyToken = require("../middleware/verifyToken");

router.post("/login", async (req, res) => {
    console.log(req.body);

    let existingUser=await User.find({email:req.body.email});
    if(existingUser.length===0){
        return res.status(404).json({status:"FAILED",message:"User with this email does not exist"});
    }
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

router.get("/isLoggedIn", (req, res) => {
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