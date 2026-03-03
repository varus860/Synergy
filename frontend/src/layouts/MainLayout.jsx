import { LoadingProvider, useLoading } from '../context/LoadingContext'
import Spinner from '../components/ui/Spinner'
import AppHeader from '../components/layout/AppHeader'
import AppFooter from '../components/layout/AppFooter'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ui/ScrollToTop'

const LayoutContent = () => {
    const { isLoading } = useLoading();
    return (
        <div className='flex flex-col min-h-screen'>
            <ScrollToTop />
            {isLoading && <Spinner fullScreen={true} />}
            <AppHeader />
            <main className='flex-1 w-full page-content'>
                <Outlet />
            </main>
            <AppFooter />
        </div>
    )
}

const MainLayout = () => {
    return (
        <LoadingProvider>
            <LayoutContent />
        </LoadingProvider>
    )
}

export default MainLayout