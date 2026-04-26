import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { useToast } from '../hooks/useToast'
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList,
  faClock,
  faBox,
  faShippingFast,
  faMotorcycle,
  faCheckCircle,
  faTimesCircle,
  faPhone,
  faSpinner,
  faTag,
  faCube,
  faChevronDown,
  faChevronUp,
  faReceipt,
  faUser,
  faCalendar,
  faSearch,
  faFilter,
  faEnvelope,
  faEye,
  faFileImage,
  faCheck,
  faTimes,
  faHourglassHalf,
  faXmark,
  faMoneyBillWave,
  faCreditCard,
  faWallet,
  faFileInvoiceDollar,
  faMoneyBill,
  faHandHoldingUsd,
  faCaretDown,
  faExternalLinkAlt,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';

// Constants
const STATUS_CONFIG = {
  'Pending Verification': { icon: faHourglassHalf, label: 'Pending Verification' },
  'Order Placed': { icon: faClock, label: 'Order Placed' },
  'Pending': { icon: faClock, label: 'Pending' },
  'Packing': { icon: faBox, label: 'Packing' },
  'Shipped': { icon: faShippingFast, label: 'Shipped' },
  'Out for delivery': { icon: faMotorcycle, label: 'Out for Delivery' },
  'Delivered': { icon: faCheckCircle, label: 'Delivered' },
  'Cancelled': { icon: faTimesCircle, label: 'Cancelled' },
  'Payment Rejected': { icon: faTimesCircle, label: 'Payment Rejected' },
};

const PAYMENT_METHOD_CONFIG = {
  'COD': {
    icon: faMoneyBill,
    label: 'Cash on Delivery',
    color: 'text-black',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    autoVerified: true
  },
  'online': {
    icon: faCreditCard,
    label: 'Online Payment',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    autoVerified: false
  },
  'easypaisa': {
    icon: faWallet,
    label: 'Easypaisa',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    autoVerified: false
  },
  'jazzcash': {
    icon: faWallet,
    label: 'JazzCash',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    autoVerified: false
  },
};

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Orders', icon: faList, count: 0 },
  { id: 'pending_verification', label: 'Pending Verification', icon: faHourglassHalf, count: 0 },
  { id: 'pending', label: 'Order Placed', icon: faClock, count: 0 },
  { id: 'packing', label: 'Packing', icon: faBox, count: 0 },
  { id: 'shipped', label: 'Shipped', icon: faShippingFast, count: 0 },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: faMotorcycle, count: 0 },
  { id: 'delivered', label: 'Delivered', icon: faCheckCircle, count: 0 },
  { id: 'cancelled', label: 'Cancelled', icon: faTimesCircle, count: 0 },
  { id: 'COD', label: 'COD Orders', icon: faMoneyBill, count: 0 },
  { id: 'online', label: 'Online Orders', icon: faCreditCard, count: 0 },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'total_high', label: 'Total: High to Low' },
  { value: 'total_low', label: 'Total: Low to High' },
];

// Image Modal Component
const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full bg-white rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:-top-5 sm:-right-10  text-white hover:text-gray-300 transition-colors z-10"
        >
          <FontAwesomeIcon icon={faXmark} className="text-2xl" />
        </button>
        <img
          src={imageUrl}
          alt="Payment Screenshot"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />

      </div>
    </div>
  );
};

// Custom Hooks
const useOrdersFilter = (orders, activeFilter, searchTerm, sortBy) => {
  return useMemo(() => {
    let filtered = orders;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => {
        switch (activeFilter) {
          case 'pending_verification':
            return order.paymentMethod !== 'COD' && order.paymentStatus === 'pending';
          case 'pending':
            return (order.status === 'Order Placed' || order.status === 'Pending') &&
              (order.paymentMethod === 'COD' ? true : order.paymentStatus === 'verified');
          case 'packing':
            return order.status === 'Packing';
          case 'shipped':
            return order.status === 'Shipped';
          case 'out_for_delivery':
            return order.status === 'Out for delivery';
          case 'delivered':
            return order.status === 'Delivered';
          case 'cancelled':
            return order.status === 'Cancelled' || order.paymentStatus === 'rejected';
          case 'COD':
            return order.paymentMethod === 'COD';
          case 'online':
            return order.paymentMethod !== 'COD' && order.paymentMethod !== undefined;
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(term) ||
        (order.customerDetails?.name?.toLowerCase().includes(term)) ||
        (order.customerDetails?.email?.toLowerCase().includes(term)) ||
        order.address?.phone?.includes(searchTerm)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const aTotal = a.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || 0;
      const bTotal = b.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || 0;

      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'total_high':
          return bTotal - aTotal;
        case 'total_low':
          return aTotal - bTotal;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, activeFilter, searchTerm, sortBy]);
};

// Sub-components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading orders...</p>
    </div>
  </div>
);

const AccessRequired = ({ navigate }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md bg-white rounded-lg shadow-sm p-8 border border-gray-200">
      <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FontAwesomeIcon icon={faReceipt} className="text-gray-600 text-2xl" />
      </div>
      <h3 className="text-xl font-semibold text-black mb-3">Access Required</h3>
      <p className="text-gray-600 mb-6">Please login to view and manage orders</p>
      <button
        onClick={() => navigate('/')}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium w-full"
      >
        Go to Login
      </button>
    </div>
  </div>
);

const EmptyState = ({ activeFilter, searchTerm, onClearSearch }) => {
  const getFilterLabel = (filterId) => {
    const filter = FILTER_OPTIONS.find(f => f.id === filterId);
    return filter ? filter.label : 'orders';
  };

  return (
    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
      <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FontAwesomeIcon icon={faReceipt} className="text-gray-400 text-2xl" />
      </div>
      <h3 className="text-xl font-semibold text-black mb-3">
        {searchTerm ? 'No orders found' : `No ${activeFilter === 'all' ? '' : getFilterLabel(activeFilter).toLowerCase()}`}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchTerm
          ? 'Try adjusting your search terms.'
          : activeFilter !== 'all'
            ? `No ${getFilterLabel(activeFilter).toLowerCase()} available.`
            : 'No orders have been placed yet.'
        }
      </p>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

// Updated Filter Dropdown Component
const FilterDropdown = ({ activeFilter, onFilterChange, filterOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = filterOptions.find(opt => opt.id === activeFilter);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full lg:w-auto px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white min-w-[200px]"
      >
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={activeOption?.icon || faFilter}
            className="mr-3 text-gray-600"
          />
          <span className="font-medium text-black">
            {activeOption?.label || 'Filter Orders'}
          </span>
        </div>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`ml-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full lg:w-64 bg-white rounded-lg border border-gray-200 shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onFilterChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded text-left hover:bg-gray-50 transition-colors ${activeFilter === option.id
                    ? 'bg-gray-100 text-black font-medium'
                    : 'text-gray-700'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={option.icon}
                      className={`mr-3 text-sm ${activeFilter === option.id ? 'text-black' : 'text-gray-500'
                        }`}
                    />
                    <span>{option.label}</span>
                  </div>
                  {option.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full min-w-6 text-center ${activeFilter === option.id
                      ? 'bg-gray-200 text-black'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SearchAndFilterBar = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  activeFilter,
  onFilterChange,
  filterOptions
}) => (
  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
    {/* Filter Pills */}
    <div className="flex items-center gap-2 p-1 bg-brand-cream border border-brand-bronze/10 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
      {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((filterId) => {
        const option = filterOptions.find(opt => opt.id === filterId);
        if (!option) return null;
        const isActive = activeFilter === filterId;
        return (
          <button
            key={filterId}
            onClick={() => onFilterChange(filterId)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${isActive
              ? 'bg-brand-ink text-brand-cream shadow-lg shadow-brand-ink/20'
              : 'text-brand-muted hover:text-brand-ink hover:bg-white'
              }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>

    {/* Search and Sort */}
    <div className="flex items-center gap-4 w-full lg:w-auto">
      <div className="relative flex-1 lg:w-80">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-bronze/40 text-sm"
        />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-brand-bronze/10 rounded-2xl focus:ring-2 focus:ring-brand-bronze focus:border-transparent text-sm font-medium transition-all"
        />
      </div>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="pl-6 pr-10 py-3.5 bg-white border border-brand-bronze/10 rounded-2xl focus:ring-2 focus:ring-brand-bronze appearance-none text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-bronze/40 text-[11px] pointer-events-none" />
      </div>
    </div>
  </div>
);

// Payment Method Badge Component
const PaymentMethodBadge = ({ paymentMethod, paymentMethodDetail }) => {
  const method = paymentMethod || 'COD';
  const detail = paymentMethodDetail || PAYMENT_METHOD_CONFIG[method]?.label || 'Cash on Delivery';
  const config = PAYMENT_METHOD_CONFIG[method] || PAYMENT_METHOD_CONFIG.COD;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
      <FontAwesomeIcon icon={config.icon} className="mr-1" />
      {detail}
    </span>
  );
};

// Payment Verification Component - Updated to show screenshot permanently
const PaymentVerification = ({ order, onVerificationComplete }) => {
  const [verifying, setVerifying] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const { token } = useAuth();

  // Don't show verification for COD orders
  if (order.paymentMethod === 'COD') {
    return null;
  }

  // Check if payment is already verified
  const isVerified = order.paymentStatus === 'verified';
  const paymentMethodLabel = PAYMENT_METHOD_CONFIG[order.paymentMethod]?.label || 'Online Payment';

  // Get screenshot from either current payment or verified payment history
  const screenshotUrl = order.verifiedPayment?.screenshot || order.paymentScreenshot;

  const handleVerifyPayment = async (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setVerifying(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/verify-payment`,
        {
          orderId: order._id,
          action: action,
          reason: rejectionReason
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onVerificationComplete(response.data.order);
      } else {
        toast.error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <div className={`${isVerified ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'} rounded-lg p-4 mb-4`}>
        <h5 className="text-lg font-semibold text-black mb-3 flex items-center">
          <FontAwesomeIcon
            icon={isVerified ? faCheckCircle : faHourglassHalf}
            className={`mr-2 ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}
          />
          {isVerified ? 'Payment Verified' : 'Payment Verification Required'}
        </h5>

        <div className="space-y-4">
          {/* Screenshot Section - Always show if available */}
          {screenshotUrl && (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-black flex items-center">
                  <FontAwesomeIcon icon={faFileImage} className="mr-2" />
                  Payment Receipt Screenshot
                </p>
                {isVerified && (
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded">
                    Verified on: {order.verifiedPayment?.verifiedAt ? new Date(order.verifiedPayment.verifiedAt).toLocaleDateString() : 'N/A'}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={screenshotUrl}
                    alt="Payment Receipt"
                    className="h-24 w-24 object-cover rounded border border-gray-300 group-hover:border-gray-400 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded transition-all flex items-center justify-center">
                    <FontAwesomeIcon icon={faEye} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    View Full Image
                  </button>
                  {!isVerified && (
                    <button
                      onClick={() => window.open(screenshotUrl, '_blank')}
                      className="flex items-center px-3 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                      Open in New Tab
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-2 border border-gray-200">
              <p className="text-gray-600 font-medium text-xs mb-1">Payment Method</p>
              <p className="text-black font-semibold">{paymentMethodLabel}</p>
            </div>
            <div className="bg-white rounded p-2 border border-gray-200">
              <p className="text-gray-600 font-medium text-xs mb-1">Amount Paid</p>
              <p className="text-black font-semibold">{currency}{order.paymentAmount || order.amount}</p>
            </div>
            {isVerified && order.verifiedPayment && (
              <>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="text-gray-600 font-medium text-xs mb-1">Verified By</p>
                  <p className="text-black font-semibold">Admin</p>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="text-gray-600 font-medium text-xs mb-1">Transaction Reference</p>
                  <p className="text-black font-semibold text-xs">{order._id.substring(0, 12).toUpperCase()}</p>
                </div>
              </>
            )}
          </div>

          {/* Verification Actions - Only show if not verified */}
          {!isVerified && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleVerifyPayment('approve')}
                  disabled={verifying}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {verifying ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  )}
                  Approve & Verify Payment
                </button>

                <button
                  onClick={() => handleVerifyPayment('reject')}
                  disabled={verifying}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-white border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {verifying ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  )}
                  Reject Payment
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Rejection Reason (Required for rejection):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none bg-white"
                  rows="2"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ImageModal
        imageUrl={screenshotUrl}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
    </>
  );
};

// Payment Status Badge - Handles COD as auto-verified
const PaymentStatusBadge = ({ paymentStatus, paymentMethod }) => {
  const getStatusConfig = (status, method) => {
    // For COD orders, always show as auto-approved
    if (method === 'COD') {
      return {
        text: 'Auto Approved',
        icon: faCheckCircle,
        color: 'text-black',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }

    switch (status) {
      case 'verified':
        return {
          text: 'Verified',
          icon: faCheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          text: 'Pending Verification',
          icon: faHourglassHalf,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          icon: faTimesCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          text: 'Unknown',
          icon: faClock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig(paymentStatus, paymentMethod);

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
      <FontAwesomeIcon icon={config.icon} className="mr-1" />
      {config.text}
    </span>
  );
};

// Billing Summary Component
const BillingSummary = ({ order }) => {
  const billingDetails = useMemo(() => {
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
      0
    );

    const deliveryCharges = order.deliveryCharges || 0;
    const total = subtotal + deliveryCharges;

    // COD orders are automatically considered verified
    const isCOD = order.paymentMethod === 'COD';
    const isOnlinePayment = !isCOD;
    const isPaymentVerified = isCOD ? true : order.paymentStatus === 'verified';

    const prepaidAmount = isOnlinePayment && isPaymentVerified ?
      (order.paymentAmount || order.amount || total) : 0;

    // For COD: full amount to collect on delivery
    // For Online: remaining amount after verification
    let remainingAmount;
    if (isCOD) {
      remainingAmount = total; // Full amount for COD (pay on delivery)
    } else if (isPaymentVerified) {
      remainingAmount = Math.max(0, total - prepaidAmount);
    } else {
      remainingAmount = total; // Online pending verification
    }

    const paymentMethod = order.paymentMethod || 'COD';
    const paymentMethodDetail = order.paymentMethodDetail ||
      PAYMENT_METHOD_CONFIG[paymentMethod]?.label || 'Cash on Delivery';

    return {
      subtotal,
      deliveryCharges,
      total,
      prepaidAmount,
      remainingAmount,
      paymentMethod,
      paymentMethodDetail,
      isFullyPaid: remainingAmount === 0,
      isPrepaid: prepaidAmount > 0,
      isOnlinePayment,
      isPaymentVerified,
      isCOD
    };
  }, [order]);

  return (
    <div>
      <h5 className="text-lg font-semibold text-black mb-2 flex items-center">
        <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
        Billing Summary
      </h5>
      <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm">
        {/* Order Summary */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-black">{currency}{billingDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Charges:</span>
            <span className="font-semibold text-black">
              {billingDetails.deliveryCharges === 0 ? 'FREE' : `${currency}${billingDetails.deliveryCharges.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-300">
            <span className="text-black">Total Amount:</span>
            <span className="text-black">{currency}{billingDetails.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-2 pt-3 border-t border-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">
              <FontAwesomeIcon icon={billingDetails.isCOD ? faMoneyBill : faCreditCard} className="mr-1 text-sm" />
              Payment Method:
            </span>
            <span className="font-semibold text-black">{billingDetails.paymentMethodDetail}</span>
          </div>

          {billingDetails.isPrepaid && (
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-sm text-green-600" />
                Prepaid Amount:
              </span>
              <span className="font-semibold text-green-600">
                {currency}{billingDetails.prepaidAmount.toFixed(2)}
              </span>
            </div>
          )}

          {billingDetails.isFullyPaid && (
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="text-gray-600 flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-sm text-green-600" />
                Payment Status:
              </span>
              <span className="font-semibold text-green-600">
                Fully Paid
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, customerInfo, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-brand-cream rounded-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-ink/50 hover:text-brand-ink transition-colors z-10"
        >
          <FontAwesomeIcon icon={faXmark} className="text-2xl" />
        </button>

        <h2 className="text-2xl font-serif text-brand-ink mb-1">Order Details</h2>
        <p className="text-[11px] uppercase tracking-widest text-brand-muted font-bold mb-6">#{order._id?.slice(-12).toUpperCase()}</p>

        {/* Customer + Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-brand-bronze/10">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-brand-bronze" /> Customer
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-ink flex items-center justify-center font-bold text-white text-sm shrink-0">
                {customerInfo.name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-brand-ink text-sm">{customerInfo.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-brand-muted font-semibold">{order.isGuest ? 'Guest' : 'Registered'}</p>
              </div>
            </div>
            <div className="border-t border-brand-bronze/5 pt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-brand-muted">
                <FontAwesomeIcon icon={faEnvelope} className="text-brand-bronze/60 w-4 shrink-0" />
                <span className="break-all">{customerInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-muted">
                <FontAwesomeIcon icon={faPhone} className="text-brand-bronze/60 w-4 shrink-0" />
                <span>{customerInfo.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-brand-bronze/10">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faShippingFast} className="text-brand-bronze" /> Delivery Address
            </h3>
            <div className="space-y-1 text-sm mb-4">
              {order.address?.firstName && <p className="font-bold text-brand-ink">{order.address.firstName} {order.address.lastName}</p>}
              {order.address?.street && <p className="text-brand-muted">{order.address.street}</p>}
              <p className="text-brand-muted">{[order.address?.city, order.address?.state, order.address?.zipCode].filter(Boolean).join(', ')}</p>
            </div>
            <div className="border-t border-brand-bronze/5 pt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-muted font-bold mb-0.5">Payment</p>
                <p className="font-bold text-brand-ink">{order.paymentMethod || 'COD'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-muted font-bold mb-0.5">Date</p>
                <p className="font-bold text-brand-ink">{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="bg-brand-ink rounded-xl p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Status</p>
            <p className="text-white font-bold text-sm">{order.status}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Items</p>
            <p className="text-white font-bold text-sm">{order.items?.length || 0}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Delivery</p>
            <p className="text-white font-bold text-sm">{order.deliveryCharges > 0 ? `${currency}${order.deliveryCharges.toFixed(2)}` : 'FREE'}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Order Total</p>
            <p className="text-brand-bronze font-black text-2xl">{currency}{order.amount?.toFixed(2)}</p>
          </div>
        </div>

        {/* Products */}
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBox} className="text-brand-bronze" /> Products Ordered
        </h3>
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-brand-bronze/10 hover:shadow-md transition-shadow">
              {(() => {
                const imgSrc = Array.isArray(item.image)
                  ? item.image[0]
                  : typeof item.image === 'string' && item.image.length > 10
                    ? item.image
                    : null;
                return imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-brand-bronze/10 shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null;
              })()}
              {!((Array.isArray(item.image) && item.image[0]) || (typeof item.image === 'string' && item.image.length > 10)) && (
                <div className="w-16 h-16 bg-brand-cream rounded-lg flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faBox} className="text-brand-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-brand-ink text-sm uppercase tracking-wider truncate mb-1">{item.name}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.variant && (
                    <span className="px-2 py-0.5 bg-brand-bronze/10 text-brand-bronze text-[11px] uppercase tracking-widest font-bold rounded">{item.variant}</span>
                  )}
                  <span className="px-2 py-0.5 bg-brand-ink/5 text-brand-ink text-[11px] uppercase tracking-widest font-bold rounded">Qty: {item.quantity}</span>
                  <span className="px-2 py-0.5 bg-brand-ink/5 text-brand-muted text-[11px] uppercase tracking-widest font-bold rounded">{currency}{item.price?.toFixed(2)} each</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-brand-ink text-sm">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-[11px] text-brand-muted font-bold tracking-widest uppercase mt-0.5">subtotal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({
  order,
  onStatusChange,
  onVerificationComplete
}) => {
  const customerInfo = useMemo(() => getCustomerInfo(order), [order]);
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
  const needsVerification = order.paymentMethod !== 'COD' && order.paymentStatus === 'pending';
  const canUpdateStatus = (order.paymentMethod === 'COD' || order.paymentStatus === 'verified') &&
    order.status !== 'Cancelled' &&
    order.status !== 'Delivered';

  const screenshotUrl = order.verifiedPayment?.screenshot || order.paymentScreenshot;
  const [showImageModal, setShowImageModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  // Get initials for the avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Status badge colors
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Packing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Out for delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-bronze/10 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-500 group">
      {/* Card Header */}
      <div className="p-6 border-b border-brand-bronze/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${order.paymentMethod === 'COD' ? 'bg-brand-ink' : 'bg-brand-bronze'
              }`}>
              {getInitials(customerInfo.name)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-brand-ink leading-tight">{customerInfo.name}</h3>
              <p className="text-xs text-brand-muted font-medium mt-0.5">Order #{order._id.substring(0, 6).toUpperCase()}</p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
            {order.status}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-brand-muted/60 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} className="text-brand-bronze/50" />
            <span>{new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-brand-bronze/50" />
            <span>{new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-brand-muted/40 pb-2 border-b border-brand-bronze/5">
          <span>Items</span>
          <div className="flex gap-8">
            <span>Qty</span>
            <span className="w-12 text-right">Price</span>
          </div>
        </div>

        <div className="space-y-3 pr-2 scrollbar-hide">
          {order.items.slice(0, 4).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group/item">
              <span className="text-sm font-medium text-brand-ink/80 truncate flex-1 pr-4">{item.name}</span>
              <div className="flex items-center gap-8">
                <span className="text-sm text-brand-muted text-center w-6">{item.quantity}</span>
                <span className="text-sm font-bold text-brand-ink w-12 text-right">{currency}{item.price.toFixed(0)}</span>
              </div>
            </div>
          ))}
          {order.items.length > 4 && (
            <p className="text-center text-xs font-bold text-brand-bronze py-2 bg-brand-bronze/5 rounded-sm">
              +{order.items.length - 4} more items
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 bg-brand-cream/30 border-t border-brand-bronze/5">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-serif italic text-brand-muted">Total Amount</span>
          <span className="text-2xl font-bold text-brand-ink">{currency}{order.amount.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowOrderDetailsModal(true)}
            className="px-4 py-3 rounded-xl border border-brand-bronze/20 text-brand-ink text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faFileAlt} className="text-brand-bronze" />
            Details
          </button>

          {canUpdateStatus ? (
            <div className="relative">
              <select
                onChange={(e) => onStatusChange(e, order._id)}
                value={order.status}
                className="w-full h-full px-4 py-3 rounded-xl bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-ink transition-colors cursor-pointer appearance-none text-center"
              >
                <option value="Order Placed">Process</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Transit</option>
                <option value="Delivered">Finish</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <FontAwesomeIcon icon={faChevronDown} className="text-white/50 text-[11px]" />
              </div>
            </div>
          ) : needsVerification ? (
            <button
              className="px-4 py-3 rounded-xl bg-yellow-500 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              onClick={() => setShowImageModal(true)}
            >
              Verify
            </button>
          ) : (
            <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center text-center italic">
              Locked
            </div>
          )}
        </div>
      </div>

      {/* Redundant Modals can be handled at parent level or locally */}
      <ImageModal
        imageUrl={screenshotUrl}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
      />
      <OrderDetailsModal
        order={order}
        customerInfo={customerInfo}
        isOpen={showOrderDetailsModal}
        onClose={() => setShowOrderDetailsModal(false)}
      />
    </div>
  );
};



const getCustomerInfo = (order) => {
  if (order.customerDetails) {
    return {
      name: order.customerDetails.name || 'Customer',
      email: order.customerDetails.email || 'Email not available',
      phone: order.customerDetails.phone || order.address?.phone || 'Phone not available'
    };
  }

  if (order.address) {
    const addressName = `${order.address.firstName || ''} ${order.address.lastName || ''}`.trim();
    return {
      name: addressName || 'Customer',
      email: order.address.email || 'Email not available',
      phone: order.address.phone || 'Phone not available'
    };
  }

  return {
    name: 'Customer',
    email: 'Email not available',
    phone: 'Phone not available'
  };
};

const calculateFilterCounts = (orders) => {
  return FILTER_OPTIONS.map(filter => {
    let count = 0;
    switch (filter.id) {
      case 'all':
        count = orders.length;
        break;
      case 'pending_verification':
        count = orders.filter(order =>
          order.paymentMethod !== 'COD' && order.paymentStatus === 'pending'
        ).length;
        break;
      case 'pending':
        count = orders.filter(order =>
          (order.status === 'Order Placed' || order.status === 'Pending') &&
          (order.paymentMethod === 'COD' || order.paymentStatus === 'verified')
        ).length;
        break;
      case 'packing':
        count = orders.filter(order => order.status === 'Packing').length;
        break;
      case 'shipped':
        count = orders.filter(order => order.status === 'Shipped').length;
        break;
      case 'out_for_delivery':
        count = orders.filter(order => order.status === 'Out for delivery').length;
        break;
      case 'delivered':
        count = orders.filter(order => order.status === 'Delivered').length;
        break;
      case 'cancelled':
        count = orders.filter(order =>
          order.status === 'Cancelled' || order.paymentStatus === 'rejected'
        ).length;
        break;
      case 'COD':
        count = orders.filter(order => order.paymentMethod === 'COD').length;
        break;
      case 'online':
        count = orders.filter(order => order.paymentMethod !== 'COD' && order.paymentMethod !== undefined).length;
        break;
      default:
        count = 0;
    }
    return { ...filter, count };
  });
};

// Main Component
const Orders = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredOrders = useOrdersFilter(orders, activeFilter, searchTerm, sortBy);
  const filtersWithCounts = useMemo(() => calculateFilterCounts(orders), [orders]);

  const handleUnauthorized = useCallback((endpoint) => {
    console.error(`Unauthorized while calling ${endpoint}`);
    toast.error('Session expired. Please login again.');
    logout();
    navigate('/');
  }, [logout, navigate]);

  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      handleUnauthorized('/api/order/list');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { token },
      });

      if (response.data.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
      } else if (response.data.message?.includes('Not Authorized') || response.status === 401) {
        handleUnauthorized('/api/order/list');
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.data?.message?.includes('Not Authorized')) {
        handleUnauthorized('/api/order/list');
      } else {
        console.error('Error fetching orders:', error);
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  const statusHandler = useCallback(async (event, orderId) => {
    const newStatus = event.target.value;

    if (!token) {
      handleUnauthorized('/api/order/status');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Order status updated');
        fetchAllOrders();
      } else if (response.data.message?.includes('Not Authorized') || response.status === 401) {
        handleUnauthorized('/api/order/status');
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.data?.message?.includes('Not Authorized')) {
        handleUnauthorized('/api/order/status');
      } else {
        console.error('Error updating status:', error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [token, handleUnauthorized, fetchAllOrders]);

  const handleVerificationComplete = useCallback((updatedOrder) => {
    setOrders(prev => prev.map(order =>
      order._id === updatedOrder._id ? updatedOrder : order
    ));
  }, []);

  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
  }, []);



  useEffect(() => {
    if (token) {
      fetchAllOrders();
    } else {
      setLoading(false);
    }
  }, [token, fetchAllOrders]);

  if (loading) return <LoadingSpinner />;
  if (!token) return <AccessRequired navigate={navigate} />;

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mb-12 text-left">
          <div className="flex items-center justify-start gap-3 mb-3">
            <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
            <p className="text-[11px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Transaction Ledger</p>
          </div>
          <div className='flex items-center justify-between'>
            <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Order Management</h1>
            <div className="flex flex-wrap items-center gap-6 p-4 bg-brand-cream/50 border border-brand-bronze/10 rounded-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">COD Orders</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">Verified Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">Pending Verification</span>
              </div>
            </div>
          </div>
          <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
            Oversee the acquisition and distribution of architectural pieces across your global clientele.
          </p>


        </div>

        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          filterOptions={filtersWithCounts}
        />

        {filteredOrders.length === 0 ? (
          <EmptyState
            activeFilter={activeFilter}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusChange={statusHandler}
                onVerificationComplete={handleVerificationComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
