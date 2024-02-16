class response {
    constructor(apiResponse) {

        let error_object = {};
        error_object.code = 400;
        error_object.status = "ERROR";
        // error_object.type = "ERROR";

        let success_object = {};
        success_object.code = 200;
        success_object.status = "SUCCESS";
        // success_object.type = "SUCCESS";

        this.error = function (message, status, status_code, data) {
            error_object.message = message;
            error_object.status = status;
            error_object.code = status_code ? status_code : error_object.status_code;
            if (data || data == 0)
                error_object.data = data;
            apiResponse.status(200).send(error_object);
        };

        this.success = function (message, status, status_code, data) {
            success_object.message = message;
            success_object.status = status;
            success_object.code = status_code ? status_code : success_object.status_code;
            if (data || data == 0)
                success_object.data = data;
            apiResponse.status(200).send(success_object);
        };

        this.redirect = function (redirectRoute) {
            return res.redirect(redirectRoute);
        };

    }
}

export default response