import pool from '../db/connection.js'
import { ApiError } from '../utils/index.js'
import gplay from "google-play-scraper";
import { appData } from '../queries/queries.js';

class appdataService {

    appdataservice = async (body, user) => {
        try {
            const mail_id = user.mail_id;
            console.log(user, "---------------->gmail")
            const resp = await pool.query(appData.getapp_id, [mail_id])
            if (resp?.rows?.length) {
                console.log(resp.rows[0].app_id, "-------------------->appid")

                const result = await gplay.app({
                    appId: resp?.rows[0]?.app_id
                })
                // const result = await gplay.reviews({
                //     appId: resp?.rows[0]?.app_id,
                //     sort: gplay.sort.RATING,
                //     lang: "en",
                //     country: "us",
                //     paginate: true,
                //     nextPaginationToken: null // you can omit this parameter
                // })
                return result
            }

        } catch (error) {
            console.error('error @ Deactivate Account', error);
            throw new ApiError(500, error)
        }
    }

}

export default new appdataService()
