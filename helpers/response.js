const responseJson = (res, code, data = null) => {
    let response = {
        code,
        message: "",
        data,
    };
    let status = 200;

    switch (code) {
        case 0: // generic success
            response.message = "Success";
            status = 200;
            break;
        case 1: // insert
            response.message = "Insert success";
            status = 201;
            break;
        case 2: // update
            response.message = "Update success";
            status = 200;
            break;
        case 3: // delete
            response.message = "Delete success";
            status = 200;
            break;
        default: // fallback
            response.message = "Unknown response";
            status = 400;
            break;
    }
    // console.log(response, "<<<<<")

    return res.status(status).json(response);
};

module.exports = responseJson;
