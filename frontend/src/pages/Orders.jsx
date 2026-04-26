import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Package, ChevronRight, Clock, MapPin, ArrowUpRight, Ship, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Orders({ orders, syncOrders, isSyncing }) {
    const navigate = useNavigate();
    const { currency } = useContext(ShopContext);

    useEffect(() => {
        if (syncOrders) {
            syncOrders();
        }
    }, []);

    return (
        <div className="min-h-screen bg-brand-cream pb-24">
            {/* SMALL HERO */}
            <section className="relative h-[40vh] md:h-[50vh]  text-center md:text-left flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/orders-hero.jpg"
                        alt="Orders"
                        className="w-full h-full object-cover grayscale opacity-30 contrast-125"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 mx-auto px-6 w-full mt-10">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-serif text-white uppercase leading-tight tracking-tight "
                    >
                        Your <span className="italic text-white/80">Orders</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-base md:text-2xl text-brand-cream/90 font-light leading-relaxed font-serif italic"
                    >
                        "A complete history of your past orders."
                    </motion.p>
                    {isSyncing && (
                        <div className="absolute top-4 right-6 flex items-center gap-2 bg-brand-ink text-white px-3 py-1 rounded-full">
                            <RotateCcw size={12} className="animate-spin" />
                            <span className="text-[11px] font-bold tracking-widest uppercase">Syncing...</span>
                        </div>
                    )}
                </div>
            </section>

            <div className=" mx-auto px-6">

                {orders.length === 0 ? (
                    <div className="py-20 text-center border-t border-brand-ink/5">
                        <Package size={40} strokeWidth={1} className="mx-auto mb-6 text-brand-ink/20" />
                        <h3 className="text-xl font-serif italic text-brand-ink/40 mb-6">No orders found.</h3>
                        <button
                            onClick={() => navigate('/shop')}
                            className="text-[11px] uppercase tracking-[0.2em] font-bold luxury-underline"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order._id || order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white border border-brand-ink/5 overflow-hidden group hover:shadow-2xl hover:shadow-brand-ink/5 transition-all duration-500"
                            >
                                {/* ORDER HEADER */}
                                <div className="p-6 md:p-8 border-b border-brand-ink/5 flex flex-col md:flex-row justify-between gap-6 bg-brand-cream/10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-ink">Order #{order._id || order.id}</span>
                                            <div className="px-3 py-1 bg-brand-ink text-white text-[11px] uppercase tracking-widest font-bold">
                                                {order.status || 'Order Placed'}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-brand-muted uppercase tracking-[0.2em] font-bold">
                                            {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-1">
                                        <div className="flex items-center gap-6 md:text-right">
                                            <div className="space-y-1">
                                                <span className="text-[11px] uppercase tracking-widest font-bold text-brand-muted opacity-40 block">Total</span>
                                                <span className="text-xl font-sans font-black">{currency}{(order.amount || order.total).toLocaleString()}</span>
                                            </div>
                                            <button
                                                className="w-10 h-10 border border-brand-ink/10 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-all group/btn"
                                            >
                                                <ArrowUpRight size={16} className="group-hover/btn:rotate-45 transition-transform" />
                                            </button>
                                        </div>
                                        <span className="text-[11px] uppercase tracking-widest font-bold text-brand-muted opacity-60">
                                            Incl. {currency}{order.deliveryCharges?.toLocaleString() || 0} Shipping
                                        </span>
                                    </div>
                                </div>

                                {/* STATUS TIMELINE */}
                                <div className="px-6 md:px-8 py-6 border-b border-brand-ink/5 overflow-x-auto no-scrollbar">
                                    <div className="min-w-[500px] flex justify-between relative">
                                        {/* Tracking Line */}
                                        <div className="absolute top-4 left-0 right-0 h-[2px] bg-brand-ink/5 z-0" />
                                        <div
                                            className="absolute top-4 left-0 h-[2px] bg-brand-bronze z-0 transition-all duration-1000"
                                            style={{
                                                width: (order.status === 'Order Placed') ? '0%' :
                                                    (order.status === 'Packing') ? '25%' :
                                                        (order.status === 'Shipped') ? '50%' :
                                                            (order.status === 'Out for delivery') ? '75%' :
                                                                (order.status === 'Delivered') ? '100%' : '0%'
                                            }}
                                        />

                                        {[
                                            { id: 'Order Placed', label: 'Placed', icon: Package },
                                            { id: 'Packing', label: 'Packing', icon: Package },
                                            { id: 'Shipped', label: 'Shipped', icon: Ship },
                                            { id: 'Out for delivery', label: 'Transit', icon: Clock },
                                            { id: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
                                        ].map((step, sIdx) => {
                                            const statuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];
                                            const currentStatus = order.status || 'Order Placed';
                                            const isPast = statuses.indexOf(currentStatus) >= statuses.indexOf(step.id);
                                            const isCurrent = currentStatus === step.id;

                                            return (
                                                <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                                                    <div className={`w-8 h-8 border flex items-center justify-center transition-colors duration-500 bg-brand-cream ${isPast ? 'border-brand-bronze text-brand-bronze' : 'border-brand-ink/10 text-brand-ink/20'}`}>
                                                        <step.icon size={16} className={isCurrent ? 'animate-pulse' : ''} />
                                                    </div>
                                                    <span className={`text-[11px] uppercase tracking-widest font-bold ${isPast ? 'text-brand-ink' : 'text-brand-ink/20'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ITEMS */}
                                <div className="p-6 md:p-8 space-y-6">
                                    {order.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="flex gap-8 items-center border-b border-brand-ink/5 last:border-0 pb-8 last:pb-0">
                                            <div className="w-20 h-20 bg-brand-cream overflow-hidden shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-ink">{item.name}</h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                    <span className="text-[12px] md:text-sm uppercase tracking-widest font-bold text-brand-muted">Qty: {item.quantity}</span>
                                                    {item.variant && (
                                                        <span className="text-[12px] md:text-sm uppercase tracking-widest font-bold text-brand-muted">Variant: {item.variant}</span>
                                                    )}
                                                    {item.variants && Object.entries(item.variants).map(([k, v]) => (
                                                        <span key={k} className="text-[12px] md:text-sm uppercase tracking-widest font-bold text-brand-muted">{k}: {v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[12px] md:text-sm font-black uppercase tracking-widest font-sans">{currency}{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* FOOTER - LOGISTICS */}
                                <div className="px-6 md:px-8 py-4 bg-brand-ink/5 flex items-center gap-6 overflow-x-auto no-scrollbar">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Clock size={14} className="text-brand-bronze" />
                                        <span className="text-[12px] md:text-sm uppercase tracking-widest font-bold text-brand-ink">
                                            {order.status === 'Delivered' ? 'Order Delivered' : 'Delivery in progress'}
                                        </span>
                                    </div>
                                    <div className="w-[1px] h-4 bg-brand-ink/10" />
                                    <div className="flex items-center gap-2 shrink-0">
                                        <MapPin size={14} className="text-brand-muted" />
                                        <span className="text-[12px] md:text-sm uppercase tracking-widest font-bold text-brand-muted">
                                            {(order.address?.city || order.shippingDetails?.city)} Shipping Address
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
