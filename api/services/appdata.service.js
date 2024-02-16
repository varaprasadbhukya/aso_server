import util from 'util';
import pool from '../db/connection.js'
import config from '../config/config.js';
import { ApiError } from '../utils/index.js'
import Joi from '@hapi/joi';
import gplay from "google-play-scraper";
import { config as envConfig } from 'dotenv';
envConfig();

class appdataService {

    appdataservice = async (body) => {
        try {
            const result = await gplay.reviews({
                appId: body.app_id,
                sort: gplay.sort.RATING,
                lang: "en",
                country: "us",
                paginate: true,
                nextPaginationToken: null // you can omit this parameter
            })
            return result
        } catch (error) {
            console.error('error @ Deactivate Account', error);
            throw new ApiError(500, error)
        }
    }

}

export default new appdataService()
