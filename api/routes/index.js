import { Router } from "express";
import appdata from './appdata.js'
import search from './search.js'
import authorization from './authorization.js'

const router = Router();


const defaultRoutes = [
    {
        path: "/appdata",
        route: appdata,
    },
    {
        path: "/search_app",
        route: search,
    },
    {
        path: "/auth",
        route: authorization,
    },

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;