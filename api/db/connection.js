/* eslint-disable no-unused-vars */
import pg from 'pg';

import config from '../config/config.js';

const { Pool } = pg

const pool = new Pool(config.postgresql)


export default pool;
