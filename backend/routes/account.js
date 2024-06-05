const { Router } = require("express");
const zod = require("zod");
const { authMiddleware } = require("../middlewares/middleware");
const { Account } = require("../db");
const mongoose = require("mongoose")

const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.find({
        userId: req.userId
    });

    res.status(200).json({
        balance: account[0].balance
    });
});

const tranferBody = zod.object({
    to: zod.string(),
    amount: zod.number()
})


// This is a bad approach bcoz we are not using transactions here.
// router.post("/tranfer", authMiddleware, async (req, res) => {
//     const { success } = tranferBody.safeParse(req.body);

//     if (!success) {
//         return res.status(400).json({
//             message: "Invalid inputs"
//         })
//     }

//     const senderAccount = await Account.find({
//         userId: req.userId
//     });

//     const senderBalance = senderAccount[0].balance;

//     if (senderBalance < req.body.amount) {
//         return res.status(400).json({
//             message: "Insufficient balance"
//         })
//     }

//     const toAccount = await Account.findOne({
//         userId: req.body.to
//     });

//     if (!toAccount) {
//         return res.status(400).json({
//             message: "Invalid account"
//         })
//     }

//     await Account.updateOne({userId: req.userId}, {
//         $inc: {
//             balance: -req.body.amount
//         }
//     });

//     await Account.updateOne({userId: req.body.to}, {
//         $inc: {
//             balance: req.body.amount
//         }
//     });
    
//     res.status(200).json({
//         message: "Transfer successful"
//     })

// });



// This is a good approach. We are using transactions here
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;