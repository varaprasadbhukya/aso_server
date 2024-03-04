import { authService } from "../services/index.js";
import { response, catchAsync, ApiError } from "../utils/index.js";

class authController {
    signupController = catchAsync(async (req, res) => {
        const Response = new response(res);
        const result = await authService.signupService(req.body);
        return Response.success('signup Successfully', 'SUCCESS', 200, result)
    });

    signinController = catchAsync(async (req, res) => {
        const Response = new response(res);
        // try {
        const result = await authService.signinService(req.body);
        return Response.success('signin Successfully', 'SUCCESS', 200, result)
        // } catch (error) {
        //     console.error("error @ signin Controller", error);
        //     return Response.error(error.message, "ERROR", error.statusCode);
        // }
    });

    verifyController = catchAsync(async (req, res) => {
        const Response = new response(res);
        const result = await authService.verifyService(req.body);
        return Response.success('signin Successfully', 'SUCCESS', 200, result)
    })



    googleLoginController = catchAsync(async (req, res) => {
        const Response = new response(res)
        // try {
        const result = await authService.googleLoginService(req.body, req.user);
        return Response.success('Login Successfully', 'SUCCESS', 200, result)

        // } catch (error) {
        //     console.error('error @ googleLogin Controller', error)
        //     return Response.error(error.message, 'ERROR', error.statusCode)
        // }

    })

    resendMailController = catchAsync(async (req, res) => {
        const Response = new response(res)
        // try {
        const result = await authService.resendMailService(req.body, req.user);
        // return result
        return Response.success('Mail sent Successfully', 'SUCCESS', 200, result)

        // } catch (error) {
        //     console.error('error @ resendmail Controller', error)
        //     return Response.error(error.message, 'ERROR', error.statusCode)
        // }

    })

    registerController = catchAsync(async (req, res) => {
        const Response = new response(res);
        // try {
        const result = await authService.registerService(req.body, req.user);
        return Response.success("Registered Successfully", "SUCCESS", 200, {
            data: result,
        });
        // } catch (error) {
        //     console.error("error @ verify Controller", error);
        //     return Response.error(error.message, "ERROR", error.statusCode);
        // }
    });
}

export default new authController();
