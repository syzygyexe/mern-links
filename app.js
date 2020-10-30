const { Router } = require("express");
const bcrypt = require("bcrypt.js");
const { check, validationResult } = require("../models/User");
const User = require("../models/User");
const router = Router();

// /api/auth/register
router.post(
    "/register",
    [
        // checking whether passed email by user was actually an email or not
        check("email", "Invalid email").isEmail(),
        check("password", "The minimal password length is 6 symbols").isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            // validationResult is checking email and password for their validity.
            const errors = validationResult(req)
            // stop post method in case of an error.
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    // Provide user with an array of errors.
                    errors: errors.array(),
                    message: "Invalid registration information"
                })
            }
            // receiving email and password from user in our req
            // Basically checking whether we receiver email and password from the user or not.
            const { email, password } = req.body
            // email: email
            const candidate = await User.findOne({ email: email })
            if (candidate) {
                // We are using return in order to stop our script if a user already exists.
                return res.status(400).json({ message: "Username already exists" })
            }

            // encrypting users password which we received on our front-end. 12 is the type of encrypting.
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword })

            // register new user in the DB.
            await user.save()

            res.status(201).json({ message: "User has been successfully created" })

        } catch (e) {
            // 500 server error
            res.status(500).json({ message: "Something went wrong, try again" })
        }
    });

// /api/auth/login
router.post("/register", async (req, res) => {

});

module.exports = router

// 32:10 bcryptjs
// 34:50
