const { Router } = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middlewares/middleware");

const router = Router();

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8),
    firstname: zod.string(),
    lastname: zod.string()
})

router.post("/signup", async (req, res) => {

    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        })
    }

    const existingUser = await User.findOne({username: req.body.username});
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        })
    }

    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    const newUser = await User.create({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname
    })

    const userId = newUser._id;

    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
	    token: token
    })
});

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        })
    }

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
        username: username,
        password: password
    });

    if (!user) {
        return res.status(411).json({
            message: "User doesn't exist / Incorrect inputs",
        })
    }

    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.json({
        message: "Signed in successfully !!",
        token: token
    })
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()

});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.findByIdAndUpdate(req.userId, req.body);

    res.json({
        message: "Updated successfully"
    })
});

router.get("/bulk", async (req, res) => {
    const filterName = req.query.filter || "";

    const result = await User.find({
        $or: [
            {firstname: filterName},
            {lastname: filterName}
        ]
    });

    const finalResult = result.map((user) => {
        return {
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }
    })

    res.status(200).json({
        users: finalResult
    });

});

module.exports = router;