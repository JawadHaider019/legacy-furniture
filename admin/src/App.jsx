import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar.jsx'
import Login from './components/Login.jsx'
import Footer from './components/Footer.jsx'

import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Setting from './pages/Setting.jsx';
import Categories from './pages/Categories.jsx';
import Blogs from './pages/Blogs.jsx';
import Banners from './pages/Banners.jsx';
import Testimonials from './pages/Testimonials.jsx';
import Comments from './pages/Comments.jsx';
import Teams from './pages/Teams.jsx';
import Other from './pages/Other.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'Rs.'
import Favicon from './components/Favicon.jsx';

const App = () => {
    const { token, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-2 border-brand-bronze/20 rounded-full"></div>
                        <div className="absolute inset-0 border-t-2 border-brand-ink rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 font-serif text-xl tracking-widest text-brand-ink animate-pulse uppercase">Legacy Furniture</p>
                    <p className="text-brand-bronze text-xs tracking-[0.2em] mt-2">ADMIN PORTAL</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-brand-cream min-h-screen selection:bg-brand-bronze selection:text-white'>
            <Favicon />

            {!token ? (
                <Login />
            ) : (
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                        <main className='flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-12'>
                            <Routes>
                                <Route path='/' element={<Dashboard />} />
                                <Route path='/categories' element={<Categories />} />
                                <Route path='/blogs' element={<Blogs />} />
                                <Route path='/banners' element={<Banners />} />
                                <Route path='/testimonials' element={<Testimonials />} />
                                <Route path='/comments' element={<Comments />} />
                                <Route path='/teams' element={<Teams />} />
                                <Route path='/other' element={<Other />} />
                                <Route path='/add' element={<Add />} />
                                <Route path='/list' element={<List />} />
                                <Route path='/orders' element={<Orders />} />
                                <Route path='/settings' element={<Setting />} />
                                <Route path='*' element={<Dashboard />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
