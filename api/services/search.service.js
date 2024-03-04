import util from "util";
import pool from "../db/connection.js";
//import { createAccount } from '../queries/queries.js'
// import Jwt from 'jsonwebtoken';
// import config from '../config/config.js';
import { ApiError } from "../utils/index.js";
import Joi from "@hapi/joi";
import { config as envConfig } from "dotenv";
envConfig();
import gplay from "google-play-scraper";

class searchService {
  searchservice = async (body) => {
    console.log(body, "----------------------------->body")
    try {
      const res = await gplay.search({
        term: body?.appname,
        num: 3,
        country: body?.country
      });

      return res;
    } catch (error) {
      console.error("error @ search service", error);
      throw new ApiError(500, "Internal server error");
    }
  };
}

export default new searchService();
