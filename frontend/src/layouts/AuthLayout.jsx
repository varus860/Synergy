import { LoadingProvider, useLoading } from '../context/LoadingContext'
import AuthHeader from '../components/layout/AuthHeader'
import AuthFooter from '../components/layout/AuthFooter'
import Spinner from '../components/ui/Spinner'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ui/ScrollToTop'

const AuthLayoutContent = () => {
    const { isLoading } = useLoading();
    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            {isLoading && <Spinner fullScreen={true} />}
            <AuthHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <AuthFooter />
        </div>
    )
}

const AuthLayout = () => {
    return (
        <LoadingProvider>
            <AuthLayoutContent />
        </LoadingProvider>
    )
}

export default AuthLayout