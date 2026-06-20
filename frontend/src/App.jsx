import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './shared/components/Toast'

// Customer
import SplashPage       from './apps/customer/pages/SplashPage'
import IdentityPage     from './apps/customer/pages/IdentityPage'
import MenuPage         from './apps/customer/pages/MenuPage'
import CartPage         from './apps/customer/pages/CartPage'
import PaymentPage      from './apps/customer/pages/PaymentPage'
import OrderStatusPage  from './apps/customer/pages/OrderStatusPage'

// Kitchen
import KitchenLoginPage from './apps/kitchen/pages/KitchenLoginPage'
import KitchenPage      from './apps/kitchen/pages/KitchenPage'
import KitchenGuard     from './apps/kitchen/components/KitchenGuard'

// Admin
import AdminLoginPage   from './apps/admin/pages/AdminLoginPage'
import AdminLayout      from './apps/admin/layouts/AdminLayout'
import AdminGuard       from './apps/admin/components/AdminGuard'
import DashboardPage    from './apps/admin/pages/DashboardPage'
import OrdersPage       from './apps/admin/pages/OrdersPage'
import MenuManagePage   from './apps/admin/pages/MenuManagePage'
import CategoriesPage   from './apps/admin/pages/CategoriesPage'
import TablesPage       from './apps/admin/pages/TablesPage'
import PaymentsPage     from './apps/admin/pages/PaymentsPage'
import ReportsPage      from './apps/admin/pages/ReportsPage'
import UsersPage        from './apps/admin/pages/UsersPage'

// Cashier
import CashierLoginPage from './apps/cashier/pages/CashierLoginPage'
import CashierPOSPage   from './apps/cashier/pages/CashierPOSPage'
import CashierGuard     from './apps/cashier/components/CashierGuard'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/menu" replace />} />

        {/* ── Customer PWA ── */}
        <Route path="/menu"                       element={<SplashPage />} />
        <Route path="/menu/:tableId/identify"     element={<IdentityPage />} />
        <Route path="/menu/:tableId"              element={<MenuPage />} />
        <Route path="/menu/:tableId/cart"         element={<CartPage />} />
        <Route path="/menu/:tableId/payment"      element={<PaymentPage />} />
        <Route path="/order/:orderId/status"      element={<OrderStatusPage />} />

        {/* ── Kitchen ── */}
        <Route path="/kitchen/login" element={<KitchenLoginPage />} />
        <Route path="/kitchen" element={
          <KitchenGuard><KitchenPage /></KitchenGuard>
        } />

        {/* ── Cashier POS ── */}
        <Route path="/cashier/login" element={<CashierLoginPage />} />
        <Route path="/cashier" element={
          <CashierGuard><CashierPOSPage /></CashierGuard>
        } />

        {/* ── Admin ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <AdminGuard><AdminLayout /></AdminGuard>
        }>
          <Route index          element={<DashboardPage />} />
          <Route path="orders"  element={<OrdersPage />} />
          <Route path="menu"    element={<MenuManagePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="tables"  element={<TablesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users"   element={<UsersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

