const router=require("express").Router();
const jwt = require("jsonwebtoken");
const Post = require("../models/post.model");
const sharp = require("sharp");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");

router.get("/getPost", verifyToken, async (req, res) => {
    try {
        
        const posts = await Post.find().populate("userId", "userName resizedProfilePicture").limit(10);

        for (let i = 0; i < posts.length; i++) {
            const postObj = posts[i].toObject();

            const userRatedObj = postObj.ratings.find(
                (e) => e.userId.toString() === req.user._id.toString()
            );
            postObj.userRated = userRatedObj ? userRatedObj.rated : 0;

            const ratings = postObj.ratings.map((r) => r.rated);
            postObj.avgRating = ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
                : 0;

            posts[i] = postObj;
        }

        return res.status(200).json(posts);


    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/userPosts/:id",verifyToken, async (req, res) => {
    console.log("cookie", req.cookies.access_token);
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
        let posts = await Post.find({ userId: req.params.id });
        console.log("posts", posts);

        for (let i = 0; i < posts.length; i++) {
            let postObj = posts[i].toObject();
            delete postObj.__v;
            delete postObj.comments;

            const userRatedObj = postObj.ratings.find(
                (e) => e.userId.toString() === req.user._id.toString()
            );
            postObj.userRated = userRatedObj ? userRatedObj.rated : 0;

            const ratings = postObj.ratings.map((r) => r.rated);
            postObj.avgRating = ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
                : 0;

            posts[i] = postObj;
        }


        return res.status(200).json({ status: "SUCCESS", posts: posts });
    }
    catch (e) {
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
})

router.post("/addPost", verifyToken, async (req, res) => {
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


router.post('/upload-base64',verifyToken, async (req, res) => {
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

//comments

router.get("/getComments/:postId",verifyToken, async (req, res) => {
    try {
        //want to poulate userId as well
        let post = await Post.findById(req.params.postId).populate("comments.userId", "userName resizedProfilePicture").populate("userId", "userName resizedProfilePicture");
        if (!post) {
            return res.status(404).json({ status: "FAILED", message: "Post not found" });
        }
        return res.status(200).json({ status: "SUCCESS", comments: post.comments, post: post });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});

router.post("/addComment", verifyToken , async (req, res) => {
    try {
        let post = await Post.findById(req.body.postId);
        if (!post) {
            return res.status(404).json({ status: "FAILED", message: "Post not found" });
        }
        post.comments.push({ userId: req.user._id, comment: req.body.comment });
        await post.save();
        return res.status(200).json({ status: "SUCCESS", message: "Comment added successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});


router.post("/addRating",verifyToken, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.body.postId }, { ratings: 1 });
        const userIds = post.ratings.map((e) => e.userId.toString());

        if (userIds.includes(req.user._id.toString())) {
            await Post.updateOne(
                { _id: req.body.postId, "ratings.userId": req.user._id },
                { $set: { "ratings.$.rated": req.body.rating } }
            );
        } else {
            const ratingElement = {
                userId: req.user._id,
                rated: req.body.rating,
            };
            await Post.updateOne(
                { _id: req.body.postId },
                { $push: { ratings: ratingElement } }
            );
        }

        res.status(200).json({ status: "SUCCESS", message: "Rating saved" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
});

module.exports = router;