import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, Ship,
    MapPin, Phone, Mail, User,
    ChevronRight, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function Checkout({ onPlaceOrder, isOrdering }) {
    const navigate = useNavigate();
    const { products, cartItems, getCartAmount, currency, deliverySettings } = useContext(ShopContext);
    const total = getCartAmount();
    const deliveryFee = deliverySettings?.mode === 'fixed'
        ? (deliverySettings.freeDeliveryAbove && total >= deliverySettings.freeDeliveryAbove ? 0 : deliverySettings.fixedCharge)
        : 49;
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', zipCode: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    if (Object.keys(cartItems).length === 0) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen pt-20 pb-16 bg-brand-cream overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">

                {/* LEFT: Checkout Form */}
                <div className="lg:col-span-7">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-brand-muted hover:text-brand-ink transition-colors mb-12 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Back to Shopping</span>
                    </button>

                    <div className="flex gap-4 mb-12 border-b border-brand-ink/5 pb-8 overflow-x-auto no-scrollbar">
                        {[
                            { id: 1, label: 'Delivery Details', icon: MapPin },
                            { id: 2, label: 'Order Review', icon: CheckCircle2 }
                        ].map(s => (
                            <div
                                key={s.id}
                                className={`flex items-center gap-3 shrink-0 transition-opacity ${step === s.id ? 'opacity-100' : 'opacity-30'}`}
                            >
                                <div className={`w-10 h-10 border border-brand-ink/20 flex items-center justify-center rounded-sm ${step >= s.id ? 'bg-brand-ink text-white' : ''}`}>
                                    <s.icon size={16} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black">{s.label}</span>
                                {s.id < 2 && <div className="w-8 h-[1px] bg-brand-ink/10" />}
                            </div>
                        ))}
                    </div>

                    <div className="max-w-2xl">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-xl md:text-3xl font-serif uppercase tracking-tight text-brand-ink">Where should we send it?</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} />
                                        <InputField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                    <InputField label="Home Address" name="address" value={formData.address} onChange={handleInputChange} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                        <InputField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-6 bg-brand-ink text-white uppercase text-[12px] tracking-[0.3em] font-black hover:bg-black transition-all"
                                    >
                                        Next
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-xl md:text-3xl font-serif uppercase tracking-tight text-brand-ink">Confirm Your Order</h3>

                                    <div className="p-6 md:p-10 border-2 border-dashed border-brand-ink/10 space-y-6 md:space-y-8 bg-brand-ink/5 relative overflow-hidden">
                                        <div className="absolute top-[-10%] right-[-10%] opacity-5 rotate-12 scale-150"><CheckCircle2 size={200} /></div>
                                        <div className="space-y-6 relative z-10">
                                            <SummaryRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                                            <SummaryRow label="Delivery Address" value={`${formData.address}, ${formData.city}`} />
                                            <SummaryRow label="Payment Method" value="Cash on Delivery (Only)" />
                                            <SummaryRow label="Total Amount" value={`${currency}${(total + deliveryFee).toLocaleString()}`} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 px-6 py-4 bg-brand-bronze text-white rounded-sm">
                                        <ShieldCheck size={20} />
                                        <span className="text-[10px] uppercase tracking-widest font-black">Safe & Secure: Pay when you receive your order</span>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={handlePrev} className="px-10 py-6 border border-brand-ink/10 uppercase text-[10px] font-black tracking-widest hover:bg-white transition-colors">Previous</button>
                                        <button
                                            onClick={() => onPlaceOrder(formData)}
                                            disabled={isOrdering}
                                            className="flex-1 py-6 bg-brand-ink text-white uppercase text-[12px] tracking-[0.3em] font-black hover:bg-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                                        >
                                            {isOrdering ? 'Placing Order...' : 'Place Order'}
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-12 shadow-sm border border-brand-ink/5 h-fit sticky top-40">
                        <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-ink/40 mb-10">Your Items</h4>
                        <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                            {Object.keys(cartItems).map((itemId) => {
                                const productData = products.find((p) => p._id === itemId);
                                if (!productData) return null;

                                return Object.keys(cartItems[itemId]).map((variantKey) => {
                                    if (cartItems[itemId][variantKey] <= 0) return null;

                                    return (
                                        <div key={`${itemId}-${variantKey}`} className="flex gap-6 items-start">
                                            <div className="w-16 h-16 bg-brand-ink/5 shrink-0 overflow-hidden">
                                                <img src={productData.image[0]} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-[11px] font-black uppercase tracking-widest">{productData.name}</h5>
                                                <p className="text-[9px] text-brand-muted uppercase tracking-widest mt-1">Qty: {cartItems[itemId][variantKey]}</p>
                                                <p className="text-[8px] uppercase tracking-widest font-bold opacity-40">{variantKey}</p>
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">{currency}{(productData.price * cartItems[itemId][variantKey]).toLocaleString()}</span>
                                        </div>
                                    );
                                });
                            })}
                        </div>

                        <div className="space-y-4 pt-10 border-t border-brand-ink/5">
                            <div className="flex justify-between items-center text-[11px] uppercase tracking-widest font-bold text-brand-muted">
                                <span>Items Total</span>
                                <span>{currency}{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] uppercase tracking-widest font-bold text-brand-ink">
                                <span>Shipping Fee</span>
                                <span>{deliveryFee === 0 ? 'Free' : `${currency}${deliveryFee.toLocaleString()}`}</span>
                            </div>
                            <div className="h-[1px] bg-brand-ink/10 my-6" />
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-ink">Total to Pay</span>
                                <span className="text-4xl font-sans font-black">{currency}{(total + deliveryFee).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-brand-bronze/5 rounded-sm flex items-start gap-4">
                            <Ship size={18} className="text-brand-bronze shrink-0 mt-1" />
                            <p className="text-[10px] leading-relaxed italic text-brand-bronze font-bold uppercase tracking-widest">
                                Your order includes expert delivery and set-up in your home.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function InputField({ label, ...props }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-ink/60">{label}</label>
            <input
                className="w-full bg-white border border-brand-ink/10 px-6 py-4 text-xs font-bold tracking-widest outline-none focus:border-brand-ink transition-all placeholder:text-brand-ink/20"
                {...props}
            />
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 border-b border-brand-ink/5 pb-4 last:border-0">
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-muted opacity-40">{label}</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-ink leading-tight">{value}</span>
        </div>
    );
}
