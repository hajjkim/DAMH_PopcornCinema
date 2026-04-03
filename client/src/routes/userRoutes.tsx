import { Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

import HomePage from "../pages/user/HomePage";
import MoviePage from "../pages/user/MoviePage";
import MovieDetailPage from "../pages/user/MovieDetailPage";
import BookingPage from "../pages/user/BookingPage";
import PaymentPage from "../pages/user/PaymentPage";
import ProfilePage from "../pages/user/ProfilePage";
import PromotionPage from "../pages/user/PromotionPage";
import PromotionDetailPage from "../pages/user/PromotionDetailPage";
import SnacksPage from "../pages/user/SnacksPage";
import TicketPage from "../pages/user/TicketPage";

export const userRoutes = (
  <Route path="/" element={<UserLayout />}>
    <Route index element={<HomePage />} />

    <Route path="movies" element={<MoviePage />} />
    <Route path="movies/:id" element={<MovieDetailPage />} />

    <Route path="booking" element={<BookingPage />} />
    <Route path="booking/:id" element={<BookingPage />} />
    <Route path="snacks" element={<SnacksPage />} />
    <Route path="payment" element={<PaymentPage />} />
    <Route path="ticket" element={<TicketPage />} />

    <Route path="profile" element={<ProfilePage />} />

    <Route path="promotions" element={<PromotionPage />} />
    <Route path="promotions/:id" element={<PromotionDetailPage />} />

  </Route>
);
