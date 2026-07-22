import { createHashRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutInfoPage } from '@/pages/CheckoutInfoPage'
import { CheckoutReviewPage } from '@/pages/CheckoutReviewPage'
import { CheckoutPaymentPage } from '@/pages/CheckoutPaymentPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'
import { AboutPage } from '@/pages/AboutPage'
import { QaLabPage } from '@/pages/QaLabPage'
import { AccountPage } from '@/pages/AccountPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { useAuthStore } from '@/store/authStore'

function AuthGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/catalog" replace />
  return <Outlet />
}

const router = createHashRouter([
  { path: '/', element: <LandingPage /> },
  {
    element: <GuestGuard />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/catalog', element: <CatalogPage /> },
          { path: '/product/:id', element: <ProductDetailPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/checkout/info', element: <CheckoutInfoPage /> },
          { path: '/checkout/review', element: <CheckoutReviewPage /> },
          { path: '/checkout/payment', element: <CheckoutPaymentPage /> },
          { path: '/checkout/confirmation', element: <ConfirmationPage /> },
          { path: '/about', element: <AboutPage /> },
          { path: '/account', element: <AccountPage /> },
          { path: '/wishlist', element: <WishlistPage /> },
          { path: '/qa-lab', element: <QaLabPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
