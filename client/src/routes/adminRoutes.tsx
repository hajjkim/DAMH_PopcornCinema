import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

// DASHBOARD
import AdminDashboard from "../pages/admin/AdminDashboard";

// MOVIES
import AdminMovies from "../pages/admin/Movies/AdminMovies";
import AdminMovieCreate from "../pages/admin/Movies/AdminMovieCreate";
import AdminMovieDetail from "../pages/admin/Movies/AdminMovieDetail";
import AdminMovieEdit from "../pages/admin/Movies/AdminMovieEdit";

// CINEMAS
import AdminCinemas from "../pages/admin/Cinema/AdminCinemas";
import AdminCinemaCreate from "../pages/admin/Cinema/AdminCinemaCreate";
import AdminCinemaDetail from "../pages/admin/Cinema/AdminCinemaDetail";
import AdminCinemaEdit from "../pages/admin/Cinema/AdminCinemaEdit";

// AUDITORIUMS
import AdminAuditoriums from "../pages/admin/Auditoriums/AdminAuditoriums";
import AdminAuditoriumCreate from "../pages/admin/Auditoriums/AdminAuditoriumCreate";
import AdminAuditoriumDetail from "../pages/admin/Auditoriums/AdminAuditoriumDetail";
import AdminAuditoriumEdit from "../pages/admin/Auditoriums/AdminAuditoriumEdit";

// SHOWTIMES
import AdminShowtimes from "../pages/admin/Showtimes/AdminShowtimes";
import AdminShowtimeCreate from "../pages/admin/Showtimes/AdminShowtimeCreate";
import AdminShowtimeDetail from "../pages/admin/Showtimes/AdminShowtimeDetail";
import AdminShowtimeEdit from "../pages/admin/Showtimes/AdminShowtimeEdit";

// ORDERS
import AdminOrders from "../pages/admin/Orders/AdminOrders";
import AdminOrderDetail from "../pages/admin/Orders/AdminOrderDetail";
import AdminOrderEdit from "../pages/admin/Orders/AdminOrderEdit";

// SNACKS
import AdminSnacks from "../pages/admin/Snacks/AdminSnacks";
import AdminSnackCreate from "../pages/admin/Snacks/AdminSnackCreate";
import AdminSnackDetail from "../pages/admin/Snacks/AdminSnackDetail";
import AdminSnackEdit from "../pages/admin/Snacks/AdminSnackEdit";

// USERS
import AdminUsers from "../pages/admin/Users/AdminUsers";
import AdminUserCreate from "../pages/admin/Users/AdminUserCreate";
import AdminUserDetail from "../pages/admin/Users/AdminUserDetail";
import AdminUserEdit from "../pages/admin/Users/AdminUserEdit";

// PROMOTIONS
import AdminPromotions from "../pages/admin/Promotions/AdminPromotions";
import AdminPromotionCreate from "../pages/admin/Promotions/AdminPromotionCreate";
import AdminPromotionDetail from "../pages/admin/Promotions/AdminPromotionDetail";
import AdminPromotionEdit from "../pages/admin/Promotions/AdminPromotionEdit";

// REPORTS
import AdminReports from "../pages/admin/AdminReports";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>

    {/* DASHBOARD */}
    <Route path="dashboard" element={<AdminDashboard />} />

    {/* MOVIES */}
    <Route path="movies" element={<AdminMovies />} />
    <Route path="movies/create" element={<AdminMovieCreate />} />
    <Route path="movies/:id" element={<AdminMovieDetail />} />
    <Route path="movies/:id/edit" element={<AdminMovieEdit />} />

    {/* CINEMAS */}
    <Route path="cinemas" element={<AdminCinemas />} />
    <Route path="cinemas/create" element={<AdminCinemaCreate />} />
    <Route path="cinemas/:id" element={<AdminCinemaDetail />} />
    <Route path="cinemas/:id/edit" element={<AdminCinemaEdit />} />

    {/* AUDITORIUMS */}
    <Route path="auditoriums" element={<AdminAuditoriums />} />
    <Route path="auditoriums/create" element={<AdminAuditoriumCreate />} />
    <Route path="auditoriums/:id" element={<AdminAuditoriumDetail />} />
    <Route path="auditoriums/:id/edit" element={<AdminAuditoriumEdit />} />

    {/* SHOWTIMES */}
    <Route path="showtimes" element={<AdminShowtimes />} />
    <Route path="showtimes/create" element={<AdminShowtimeCreate />} />
    <Route path="showtimes/:id" element={<AdminShowtimeDetail />} />
    <Route path="showtimes/:id/edit" element={<AdminShowtimeEdit />} />

    {/* ORDERS */}
    <Route path="orders" element={<AdminOrders />} />
    <Route path="orders/:id" element={<AdminOrderDetail />} />
    <Route path="orders/:id/edit" element={<AdminOrderEdit />} />

    {/* SNACKS */}
    <Route path="snacks" element={<AdminSnacks />} />
    <Route path="snacks/create" element={<AdminSnackCreate />} />
    <Route path="snacks/:id" element={<AdminSnackDetail />} />
    <Route path="snacks/:id/edit" element={<AdminSnackEdit />} />

    {/* USERS */}
    <Route path="users" element={<AdminUsers />} />
    <Route path="users/create" element={<AdminUserCreate />} />
    <Route path="users/:id" element={<AdminUserDetail />} />
    <Route path="users/:id/edit" element={<AdminUserEdit />} />

    {/* PROMOTIONS */}
    <Route path="promotions" element={<AdminPromotions />} />
    <Route path="promotions/create" element={<AdminPromotionCreate />} />
    <Route path="promotions/:id" element={<AdminPromotionDetail />} />
    <Route path="promotions/:id/edit" element={<AdminPromotionEdit />} />

    {/* REPORTS */}
    <Route path="reports" element={<AdminReports />} />

  </Route>
);