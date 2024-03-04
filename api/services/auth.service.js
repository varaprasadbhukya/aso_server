import pool from "../db/connection.js";
//import { createAccount } from '../queries/queries.js'
// import Jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registration } from "../queries/queries.js";
import config from "../config/config.js";
import { ApiError } from "../utils/index.js";

const sendEmail = (gmail, subjectLine, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${config.email}`,
            pass: `${config.password}`,
        },
    });
    console.log(
        config.email,
        config.password,
        "------------------------>Inside SendEmail"
    );
    let info = transporter.sendMail({
        from: "shashikumar@way2news.com",
        to: gmail,
        subject: subjectLine,
        text: `Unique code for getting discount`,
        html: htmlContent,
    });
};

class authService {
    signupService = async (body) => {
        console.log(
            body,
            "----------------------------------->Inside SignupService"
        );
        try {
            const resp = await pool.query(registration.signupcheck, [body.email]);
            console.log(resp?.rows?.length, "----------------------->Response");
            if (resp?.rows?.length) {
                throw new ApiError(400, "Email Exist");
            } else {
                const saltRounds = 10; // Recommended number of rounds
                const salt = await bcrypt.genSalt(saltRounds);

                // Hash the password with salt and multiple iterations
                const hashedPassword = await bcrypt.hash(body.password, salt);

                await pool.query(registration.signup, [
                    body.email,
                    hashedPassword
                    // key,
                    // expiry,
                ]);
                const payload = { mail_id: body.email };
                const accesstoken = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: "720h",
                });

                return {
                    authorization: accesstoken,
                };
            }
            // else {
            //   const key = crypto.randomBytes(16).toString("hex"); // Generating random token
            //   const token = jwt.sign(
            //     { email: body.email, token: key },
            //     `${config.jwtSecret}`,
            //     { expiresIn: "1h" }
            //   );

            //   console.log(key, "---------------->Token");

            //   let subjectLine = `ASOPilot Activation Link`;
            //   let content = `Dear <br> This is Activation Mail <br>
            //             Press the below link to confirm your email
            //             <a href="http://localhost:3000/verify/${token}">CONFIRM<a>`;

            //   if (body.email) {
            //     sendEmail(body.email, subjectLine, content);
            //   }
            //   const expiry = Math.floor(Date.now() / 1000) + 3600;

            // }
        } catch (error) {
            console.error("error @ signup Service", error);
            throw new ApiError(error.statusCode || 500, error);
        }
    };

    signinService = async (body) => {
        console.log(body, "------------------->Inside Signin");
        try {
            const checkmail = await pool.query(registration.signupcheck, [
                body.email,
            ]);
            if (checkmail?.rows?.length) {
                const user = checkmail.rows[0];
                console.log(user, "----------------------->User")
                // Compare the provided password with the hashed password stored in the database
                const passwordMatch = await bcrypt.compare(body.password, user.password);
                console.log(passwordMatch, "--------------------->passwordmatch")
                if (passwordMatch) {
                    const payload = { mail_id: body.email };
                    const accesstoken = jwt.sign(payload, config.jwtSecret, {
                        expiresIn: "720h",
                    });
                    return {
                        authorization: accesstoken,
                        registered: user.registration_done,
                    };
                } else {
                    throw new ApiError(400, "Wrong credentials");
                }
            } else {
                throw new ApiError(400, "Mail Not exist");
            }
        } catch (error) {
            console.error("error @ signin Service", error);
            throw new ApiError(error.statusCode || 500, error);
        }
    };

    verifyService = async (body) => {
        console.log(body, "------------------->Inside Signin");
        const token = body.param.token;
        console.log(body.param.token, "---------------------->ParamToken");
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            const extractedEmail = decoded.email;
            const extractedToken = decoded.token;
            console.log(
                extractedEmail,
                extractedToken,
                "--------------------------->TOKENS"
            );
            const current_time = Math.floor(Date.now() / 1000);
            const resp = await pool.query(registration.verifymail, [
                extractedEmail,
                extractedToken,
            ]);
            if (resp?.rows?.length) {
                const confirmation = await pool.query(registration.checkconfirmation, [
                    extractedEmail,
                ]);
                if (
                    confirmation?.rows[0]?.mail_conformation !== 1 &&
                    current_time < confirmation?.rows[0]?.expiry
                ) {
                    await pool.query(registration.upd_mail_conformation, [
                        1,
                        extractedEmail,
                    ]);
                    const payload = { mail_id: extractedEmail };
                    const accesstoken = jwt.sign(payload, config.jwtSecret, {
                        expiresIn: "720h",
                    });
                    return { authorization: accesstoken };
                } else if (
                    confirmation?.rows[0]?.mail_conformation !== 1 &&
                    current_time > confirmation?.rows[0]?.expiry
                ) {
                    throw new ApiError(400, "Verification Link Expired");
                } else {
                    throw new ApiError(400, "Mail Already Verified");
                }
            } else {
                throw new ApiError(400, "Invalid Url to verify");
            }
        } catch (error) {
            console.error("error @ verify Service", error);
            throw new ApiError(error.statusCode || 500, error);
        }
    };

    registerService = async (body, user) => {
        const { fullName, companyName, jobFunction, country, appName, appId } =
            body;
        const mail = user.mail_id;
        console.log(user.mail_id, mail, "---------------------->Mails");
        try {
            const checkreg = await pool.query(registration.checkreg, [mail]);
            if (checkreg?.rows[0]?.registration_done) {
                throw new ApiError(400, "Registration has done Already");
            }
            const resp = await pool.query(registration.register, [
                fullName,
                companyName,
                jobFunction,
                country,
                appName,
                appId,
                true,
                mail,
            ]);
            return "Registered Successfully";
        } catch (error) {
            console.error("error @ verify Service", error);
            throw new ApiError(error.statusCode || 500, error);
        }
    }

    googleLoginService = async (body) => {
        console.log(body, "------------>body")
        try {
            const checkmail = await pool.query(registration.signupcheck, [body.mail])
            if (checkmail?.rows[0]?.mail_id !== "NULL") {
                const res = await pool.query(registration.checkreg, [body.mail])
                if (res?.rows[0]?.registration_done) {
                    return "reg_done"
                }
                else {
                    return "reg_not_done"
                }
            }
            else {
                const resp = await pool.query(registration.insertmail, [body.mail])
                return "mail_registered"
            }

        } catch (error) {
            console.error('error @ Login Service', error)
            throw new ApiError(error.statusCode || 500, error)
        }
    }

    resendMailService = async (body) => {
        console.log(body, "------------------_>body")
        try {

            const token_url = body.param.token
            const decoded = jwt.verify(token_url, config.jwtSecret);
            const extractedEmail = decoded.email;


            const key = crypto.randomBytes(16).toString("hex") // Generating random token
            const token = jwt.sign({ email: body.email, token: key }, `${config.jwtSecret}`, { expiresIn: '2h' });

            let subjectLine = `ASOPilot Activation Link`
            let content = `Dear <br> This is Activation Mail <br>
                Press the below link to confirm your email
                <a href="http://localhost:3000/verify/${token}">CONFIRM<a>`

            const expiry = Math.floor(Date.now() / 1000) + 3600;
            const resp = await pool.query(registration.resendmail, [token, expiry, extractedEmail])

            if (body.email) {
                sendEmail(body.email, subjectLine, content)
            }

        } catch (error) {
            console.error('error @ resendMail Service', error)
            throw new ApiError(error.statusCode || 500, error)
        }
    }

}

export default new authService();
