import { authService } from "../services/index.js";
import { response, catchAsync, ApiError } from "../utils/index.js";

class authController {
  signupController = catchAsync(async (req, res) => {
    const Response = new response(res);
    try {
      const result = await authService.signupService(req.body);
      return Response.success("fetched Successfully", "SUCCESS", 200, {
        data: result,
      });
    } catch (error) {
      console.error("error @ signup Controller", error);
      return Response.error(error.message, "ERROR", error.statusCode);
    }
  });

  signinController = catchAsync(async (req, res) => {
    const Response = new response(res);
    try {
      const result = await authService.signinService(req.body);
      return Response.success("fetched Successfully", "SUCCESS", 200, {
        data: result,
      });
    } catch (error) {
      console.error("error @ signin Controller", error);
      return Response.error(error.message, "ERROR", error.statusCode);
    }
  });

  verifyController = catchAsync(async (req, res) => {
    const Response = new response(res);
    try {
      const result = await authService.verifyService(req.body);
      return Response.success("Mail verified Successfully", "SUCCESS", 200, {
        data: result,
      });
    } catch (error) {
      console.error("error @ verify Controller", error);
      return Response.error(error.message, "ERROR", error.statusCode);
    }
  });

  registerController = catchAsync(async (req, res) => {
    const Response = new response(res);
    try {
      const result = await authService.registerService(req.body, req.user);
      return Response.success("Registered Successfully", "SUCCESS", 200, {
        data: result,
      });
    } catch (error) {
      console.error("error @ verify Controller", error);
      return Response.error(error.message, "ERROR", error.statusCode);
    }
  });
}

export default new authController();
