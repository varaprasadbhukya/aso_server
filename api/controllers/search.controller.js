import { searchService } from "../services/index.js"
import { response, catchAsync, ApiError } from '../utils/index.js'

class searchController {

    searchcontroller = catchAsync(async (req, res) => {
        const Response = new response(res)
        // try {
        const result = await searchService.searchservice(req.body);
        return Response.success('fetched Successfully', 'SUCCESS', 200, result)

        // } catch (error) {
        //     console.error('error @ createAccount Controller', error)
        //     throw new ApiError(500, error)

        // }

    })
}

export default new searchController()