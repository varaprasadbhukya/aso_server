import config from "../config/config.js";
const tables = {
  registrations: `${config.psql_schema}.registrations`,
};
export default tables;
