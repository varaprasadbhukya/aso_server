import pool from "../db/connection.js";
import tables from "../db/pg_tables.js";


const models = async () => {
  try {
    console.log("Inside Models")
    await pool.query(`CREATE TABLE IF NOT EXISTS ${tables.registrations} (
      registration_id SERIAL PRIMARY KEY,
      mail_id VARCHAR(60) NOT NULL,
      password VARCHAR(60),
      name VARCHAR(60),
      company_name VARCHAR(80),
      job_function VARCHAR(80),
      country VARCHAR(60),
      app_name VARCHAR(100),
      app_id VARCHAR(80),
      mail_confirmation INT default 0,
      registration_done BOOLEAN,
      token VARCHAR(60),
      expiry INT,
      prompt text
      )` );

  } catch (error) {
    console.error('Error creating table:', error);
  }

}



export default models;
