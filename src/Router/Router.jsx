import {
    createBrowserRouter,
} from "react-router-dom";

import Main from "../LayOut/Main";
import Home from "../Pages/Home/Home";
import LogIn from "../Authentication/LogIn";
import SignUp from "../Authentication/SignUp";
import Shop from "../Pages/Shop/Shop";
import CardDetails from "../Pages/Shop/CardDetails";
import MyOrders from "../Pages/MyOrders/MyOrders";
import PrivateRoute from "./PrivateRoute";
import AddItem from "../Pages/Dashboard/AddItem/AddItem";
import AdminRoute from "./AdminRoute";
import MyInventory from "../Pages/My Inventory/MyInventory";
import UpdateProducts from "../Pages/My Inventory/UpdateProducts";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/login',
                element: <LogIn></LogIn>
            },
            {
                path: '/signup',
                element: <SignUp></SignUp>
            },
            {
                path: '/shop',
                element: <Shop></Shop>
            },
            {
                path: '/product/:id',
                element: <PrivateRoute><CardDetails></CardDetails></PrivateRoute>
            },
            {
                path: '/my-orders',
                element: <PrivateRoute><MyOrders></MyOrders></PrivateRoute>
            },
            {
                path: 'add-products',
                element: <AdminRoute><PrivateRoute><AddItem></AddItem></PrivateRoute></AdminRoute>
            },
            {
                path: '/my-inventory',
                element: <PrivateRoute><AdminRoute><MyInventory></MyInventory></AdminRoute></PrivateRoute>
            },
            {
                path: '/update-products/:id',
                element: <PrivateRoute><AdminRoute><UpdateProducts></UpdateProducts></AdminRoute></PrivateRoute>
            }


        ]
    },

]);