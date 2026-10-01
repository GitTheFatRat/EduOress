import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout.jsx'
import Home from './pages/Home.jsx'
import CourseListing from './pages/public/CourseListing.jsx'
import CourseDetail from './pages/public/CourseDetail.jsx'
import Checkout from './pages/customer/Checkout.jsx'
import MyCourses from './pages/customer/MyCourses.jsx'
import Learn from './pages/customer/Learn.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import ProviderLayout from './components/layouts/ProviderLayout.jsx'
import PDashboard from './pages/provider/Dashboard.jsx'
import PCourses from './pages/provider/courses/CourseManagement.jsx'
import PCourseForm from './pages/provider/courses/CourseForm.jsx'
import LessonManagement from './pages/provider/lessons/LessonManagement.jsx'
import LessonForm from './pages/provider/lessons/LessonForm.jsx'
import DiscountManagement from './pages/provider/discounts/DiscountManagement.jsx'
import DiscountForm from './pages/provider/discounts/DiscountForm.jsx'
import PromotionManagement from './pages/provider/promotions/PromotionManagement.jsx'
import PromotionForm from './pages/provider/promotions/PromotionForm.jsx'
import GiftManagement from './pages/provider/gifts/GiftManagement.jsx'
import GiftForm from './pages/provider/gifts/GiftForm.jsx'
import RevenueReport from './pages/provider/revenue/RevenueReport.jsx'
import RevenueDetail from './pages/provider/revenue/RevenueDetail.jsx'
import AdminLayout from './components/layouts/AdminLayout.jsx'
import AOverview from './pages/admin/Overview.jsx'
import ProviderManagement from './pages/admin/providers/ProviderManagement.jsx'
import ProviderApproval from './pages/admin/providers/ProviderApproval.jsx'
import ProviderReviews from './pages/admin/providers/ProviderReviews.jsx'
import ACourses from './pages/admin/courses/CourseManagement.jsx'
import CourseApproval from './pages/admin/courses/CourseApproval.jsx'
import CourseContent from './pages/admin/courses/CourseContent.jsx'
import CustomerManagement from './pages/admin/CustomerManagement.jsx'
import PaymentManagement from './pages/admin/PaymentManagement.jsx'
import Profile from './pages/customer/Profile.jsx'
import Notifications from './pages/customer/Notifications.jsx'
import BecomeProvider from './pages/customer/BecomeProvider.jsx'
import DeleteAccount from './pages/customer/DeleteAccount.jsx'
import BlogListing from './pages/public/BlogListing.jsx'
import BlogDetail from './pages/public/BlogDetail.jsx'
import Faq from './pages/public/Faq.jsx'
import Contact from './pages/public/Contact.jsx'
import NotFound from './pages/public/NotFound.jsx'
import NotificationManagement from './pages/admin/NotificationManagement.jsx'
import FinanceManagement from './pages/admin/FinanceManagement.jsx'
import SupportManagement from './pages/admin/SupportManagement.jsx'
import SystemContent from './pages/admin/SystemContent.jsx'
import AccessManagement from './pages/admin/AccessManagement.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="khoa-hoc" element={<CourseListing />} />
        <Route path="khoa-hoc/:slug" element={<CourseDetail />} />
        <Route path="blog" element={<BlogListing />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="faq" element={<Faq />} />
        <Route path="lien-he" element={<Contact />} />
        <Route path="dang-nhap" element={<Login />} />
        <Route path="quen-mat-khau" element={<ForgotPassword />} />
        <Route path="dang-ky" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'PROVIDER']} />}>
          <Route path="hoc-tap" element={<MyCourses />} />
          <Route path="hoc/:slug" element={<Learn />} />
          <Route path="hoc/:slug/:lessonId" element={<Learn />} />
          <Route path="thanh-toan/:slug" element={<Checkout />} />
          <Route path="ho-so" element={<Profile />} />
          <Route path="thong-bao" element={<Notifications />} />
          <Route path="tro-thanh-ncc" element={<BecomeProvider />} />
          <Route path="xoa-tai-khoan" element={<DeleteAccount />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="provider" element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
        <Route element={<ProviderLayout />}>
          <Route index element={<PDashboard />} />
          <Route path="courses" element={<PCourses />} />
          <Route path="courses/new" element={<PCourseForm />} />
          <Route path="courses/:id/edit" element={<PCourseForm />} />
          <Route path="courses/:id/lessons" element={<LessonManagement />} />
          <Route path="courses/:id/lessons/new" element={<LessonForm />} />
          <Route path="courses/:id/lessons/:lessonId/edit" element={<LessonForm />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="discounts/new" element={<DiscountForm />} />
          <Route path="discounts/:id/edit" element={<DiscountForm />} />
          <Route path="promotions" element={<PromotionManagement />} />
          <Route path="promotions/new" element={<PromotionForm />} />
          <Route path="promotions/:id/edit" element={<PromotionForm />} />
          <Route path="gifts" element={<GiftManagement />} />
          <Route path="gifts/new" element={<GiftForm />} />
          <Route path="gifts/:id/edit" element={<GiftForm />} />
          <Route path="revenue" element={<RevenueReport />} />
          <Route path="revenue/:courseId" element={<RevenueDetail />} />
        </Route>
      </Route>
      <Route path="admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AOverview />} />
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="providers/pending" element={<ProviderApproval />} />
          <Route path="providers/reviews" element={<ProviderReviews />} />
          <Route path="courses" element={<ACourses />} />
          <Route path="courses/pending" element={<CourseApproval />} />
          <Route path="courses/:id/content" element={<CourseContent />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="finance" element={<FinanceManagement />} />
          <Route path="support" element={<SupportManagement />} />
          <Route path="content" element={<SystemContent />} />
          <Route path="access" element={<AccessManagement />} />
        </Route>
      </Route>
    </Routes>
  )
}
