import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPoundSign, faChartLine, faClipboardList, faClock, faPlus,
  faBoxes, faShoppingCart, faWarehouse, faChartPie, faTags,
  faArrowTrendUp, faArrowTrendDown, faUsers, faRocket, faPercent,
  faBell, faSync, faExclamationTriangle, faTimes, faFire,
  faUserCheck, faUserPlus, faMapMarkerAlt, faExclamationCircle, faCheckCircle,
  faComments, faStar, faReply, faChartBar, faCalendarAlt,
  faMoneyBillTrendUp, faChartSimple, faCalendarWeek, faEye
} from '@fortawesome/free-solid-svg-icons';
import { backendUrl } from "../App";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

// Constants
const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
const TIME_RANGES = ['daily', 'weekly', 'monthly'];
const CHART_TYPES = ['pie', 'bar'];
const PROFIT_PERIODS = ['3months', '6months', '12months', '24months'];

// Reusable Components
const StatCard = React.memo(({ title, value, icon, color, change, subtitle, trend }) => (
  <div className="luxury-card p-4 sm:p-6 hover:border-brand-bronze/30 transition-all duration-500 group">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-brand-muted text-[12px] md:text-sm uppercase tracking-[0.2em] font-medium mb-3">{title}</p>
        <p className="text-2xl sm:text-3xl font-sans text-brand-ink">
          {typeof value === 'number' && value >= 1000 ? `£ ${value.toLocaleString()}` : value || 0}
        </p>
        {subtitle && <p className="text-[12px] md:text-sm text-brand-muted/70 mt-2 font-medium italic">{subtitle}</p>}
        {change && (
          <div className="flex items-center mt-3">
            <FontAwesomeIcon
              icon={change > 0 ? faArrowTrendUp : faArrowTrendDown}
              className={`text-[12px] md:text-sm mr-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}
            />
            <p className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          </div>
        )}
        {trend && <div className="flex items-center mt-2 border-t border-brand-bronze/5 pt-2"><span className="text-[12px] md:text-sm text-brand-muted/60 tracking-wider uppercase">{trend}</span></div>}
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-sm flex items-center justify-center bg-brand-cream/50 border border-brand-bronze/10 text-brand-bronze group-hover:bg-brand-ink group-hover:text-brand-cream transition-all duration-500`}>
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
    </div>
  </div>
));

const StatusBadge = React.memo(({ status }) => {
  const colors = {
    Delivered: 'bg-green-50 text-green-800 border-green-100',
    Processing: 'bg-blue-50 text-blue-800 border-blue-100',
    Shipped: 'bg-yellow-50 text-yellow-800 border-yellow-100',
    'Order Placed': 'bg-purple-50 text-purple-800 border-purple-100',
    Packing: 'bg-orange-50 text-orange-800 border-orange-100'
  };
  return (
    <span className={`px-3 py-1 rounded-sm text-[12px] md:text-sm font-bold uppercase tracking-widest border ${colors[status] || 'bg-brand-cream text-brand-muted border-brand-bronze/10'}`}>
      {status}
    </span>
  );
});

const StockBadge = React.memo(({ stock }) => (
  <span className={`px-2 py-1 rounded-sm text-[12px] md:text-sm font-bold uppercase tracking-widest ${stock <= 2 ? 'bg-red-50 text-red-800' :
    stock <= 5 ? 'bg-yellow-50 text-yellow-800' :
      'bg-green-50 text-green-800'
    }`}>
    {stock} left
  </span>
));

const ChartToggle = React.memo(({ chartKey, currentView, onToggle, options = CHART_TYPES }) => (
  <div className="flex gap-2 bg-brand-cream/80 p-1.5 rounded-sm border border-brand-bronze/10">
    {options.map(type => (
      <button
        key={type}
        onClick={() => onToggle(type)}
        className={`px-4 py-1.5 rounded-sm text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] transition-all ${currentView === type ? 'bg-brand-ink text-brand-cream shadow-sm' : 'text-brand-muted hover:text-brand-ink'
          }`}
      >
        {type}
      </button>
    ))}
  </div>
));

const LoadingSpinner = () => (
  <div className="h-[70vh] flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 border-2 border-brand-bronze/20 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-brand-ink rounded-full animate-spin"></div>
      </div>
      <p className="mt-8 font-serif text-2xl tracking-[0.2em] text-brand-ink animate-pulse">LOADING DATA</p>
    </div>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="flex items-center justify-center h-full text-brand-muted py-20 bg-brand-cream/30 rounded-sm border border-dashed border-brand-bronze/20">
    <div className="text-center">
      <FontAwesomeIcon icon={icon} className="text-5xl text-brand-bronze/20 mb-4" />
      <p className="font-serif text-lg italic">{message}</p>
    </div>
  </div>
);

// Custom Hook for API calls
const useApi = () => {
  const fetchData = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }, []);

  return { fetchData };
};

const Dashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentOrders: [],
    topProducts: [],
    lowStockProducts: [],
    customerInsights: {},
    alerts: []
  });
  const [commentNotifications, setCommentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chartViews, setChartViews] = useState({
    revenue: 'pie',
    customers: 'pie',
    products: 'pie',
    profitGrowth: 'bar'
  });
  const [profitTimeRange, setProfitTimeRange] = useState('6months');
  const [profitGrowthType, setProfitGrowthType] = useState('monthly');
  const [profitTrend, setProfitTrend] = useState([]);
  const [profitGrowth, setProfitGrowth] = useState([]);
  const [yearOverYearProfit, setYearOverYearProfit] = useState([]);
  const [profitGrowthSummary, setProfitGrowthSummary] = useState({});

  const { fetchData } = useApi();

  // Memoized data calculations
  const combinedMetrics = useMemo(() => {
    const { stats } = dashboardData;
    const totalRevenue = stats.totalProductRevenue || 0;
    const totalCost = stats.totalProductCost || 0;
    const totalProfit = stats.totalProductProfit || 0;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      totalProductSold: stats.totalItemsSold || 0,
      totalInventoryValue: stats.inventoryValue || 0
    };
  }, [dashboardData.stats]);

  const totalNotificationsCount = useMemo(() => {
    const unreadAlertsCount = dashboardData.alerts.filter(alert => !alert.read).length;
    const unreadCommentsCount = commentNotifications.length;
    return unreadAlertsCount + unreadCommentsCount;
  }, [dashboardData.alerts, commentNotifications]);

  // API calls
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData(`${API_BASE}/dashboard/stats?timeRange=${timeRange}`);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, fetchData]);

  const fetchCommentNotifications = useCallback(async () => {
    try {
      const data = await fetchData(`${API_BASE}/comments/notifications/new`);
      setCommentNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching comment notifications:', error);
    }
  }, [fetchData]);

  const fetchProfitTrend = useCallback(async () => {
    try {
      const data = await fetchData(`${API_BASE}/dashboard/profit-trend?period=${profitTimeRange}`);
      if (data.trend && data.trend.length > 0) {
        setProfitTrend(data.trend);
      } else {
        setProfitTrend([]);
      }
    } catch (error) {
      console.error('Error fetching profit trend:', error);
      setProfitTrend([]);
    }
  }, [profitTimeRange, fetchData]);

  const fetchProfitGrowth = useCallback(async () => {
    try {
      const data = await fetchData(`${API_BASE}/dashboard/profit-growth?period=${profitTimeRange}`);
      if (data.profitGrowth && data.profitGrowth.length > 0) {
        setProfitGrowth(data.profitGrowth);
        setProfitGrowthSummary(data.summary || {});
      } else {
        setProfitGrowth([]);
        setProfitGrowthSummary({});
      }
    } catch (error) {
      console.error('Error fetching profit growth:', error);
      setProfitGrowth([]);
      setProfitGrowthSummary({});
    }
  }, [profitTimeRange, fetchData]);

  const fetchYearOverYearProfit = useCallback(async () => {
    try {
      const data = await fetchData(`${API_BASE}/dashboard/profit-growth/yoy`);
      if (data.comparison && data.comparison.length > 0) {
        setYearOverYearProfit(data);
      } else {
        setYearOverYearProfit({ comparison: [], summary: {} });
      }
    } catch (error) {
      console.error('Error fetching year-over-year profit growth:', error);
      setYearOverYearProfit({ comparison: [], summary: {} });
    }
  }, [fetchData]);

  // Event handlers
  const handleCommentRead = useCallback(async (commentId) => {
    try {
      await fetchData(`${API_BASE}/comments/${commentId}/read`, { method: 'PATCH' });
      fetchCommentNotifications();
    } catch (error) {
      console.error('Error marking comment as read:', error);
    }
  }, [fetchData, fetchCommentNotifications]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      fetchProfitTrend(),
      fetchProfitGrowth(),
      fetchYearOverYearProfit(),
      fetchCommentNotifications()
    ]);
    setRefreshing(false);
  }, [fetchDashboardData, fetchProfitTrend, fetchProfitGrowth, fetchYearOverYearProfit, fetchCommentNotifications]);

  const handleChartToggle = useCallback((chartKey, viewType) => {
    setChartViews(prev => ({
      ...prev,
      [chartKey]: viewType
    }));
  }, []);

  // Effects
  useEffect(() => {
    fetchDashboardData();
    fetchCommentNotifications();
  }, [fetchDashboardData, fetchCommentNotifications]);

  useEffect(() => {
    fetchProfitTrend();
    fetchProfitGrowth();
    fetchYearOverYearProfit();
  }, [fetchProfitTrend, fetchProfitGrowth, fetchYearOverYearProfit]);

  // Chart data preparation
  const chartConfigs = useMemo(() => {
    const { customerInsights, topProducts } = dashboardData;

    const getProductNames = () => {
      if (topProducts?.length > 0) {
        return topProducts.map(product => product.name || `Product ${product._id}`);
      }
      return ['No Product Data'];
    };

    const getProductSalesData = () => {
      if (topProducts?.length > 0) {
        return topProducts.map(product => product.totalSales || 0);
      }
      return [0];
    };

    const profitGrowthData = {
      monthly: {
        data: {
          labels: profitTrend.map(item => item.period),
          datasets: [{
            label: 'Profit (£)',
            data: profitTrend.map(item => item.profit),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Monthly Profit Trend (${profitTimeRange})`
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '£ ' + value.toLocaleString();
                }
              }
            }
          }
        }
      },
      detailed: {
        data: {
          labels: profitGrowth.map(item => item.period),
          datasets: [
            {
              label: 'Profit (£)',
              data: profitGrowth.map(item => item.profit),
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2,
              type: 'bar'
            },
            {
              label: 'Growth %',
              data: profitGrowth.map(item => item.growthPercentage),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2,
              type: 'line',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: `Profit Growth Analysis (${profitTimeRange})`
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Profit (£)'
              },
              ticks: {
                callback: function (value) {
                  return '£ ' + value.toLocaleString();
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Growth %'
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            }
          }
        }
      },
      yoy: {
        data: {
          labels: yearOverYearProfit.comparison?.map(item => item.month) || [],
          datasets: [
            {
              label: 'Current Year Profit',
              data: yearOverYearProfit.comparison?.map(item => item.currentYearProfit) || [],
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2,
            },
            {
              label: 'Previous Year Profit',
              data: yearOverYearProfit.comparison?.map(item => item.previousYearProfit) || [],
              backgroundColor: 'rgba(156, 163, 175, 0.8)',
              borderColor: 'rgb(156, 163, 175)',
              borderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: 'Year-over-Year Profit Comparison'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '£ ' + value.toLocaleString();
                }
              }
            }
          }
        }
      }
    };

    return {
      revenue: {
        pie: {
          data: {
            labels: ['Revenue', 'Profit', 'Expenses'],
            datasets: [{
              data: [combinedMetrics.totalRevenue, combinedMetrics.totalProfit, combinedMetrics.totalCost],
              backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
              borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(239, 68, 68)'],
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Financial Breakdown' }
            }
          }
        },
        bar: {
          data: {
            labels: ['Revenue', 'Profit', 'Expenses'],
            datasets: [{
              label: 'Amount (£)',
              data: [combinedMetrics.totalRevenue, combinedMetrics.totalProfit, combinedMetrics.totalCost],
              backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
              borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(239, 68, 68)'],
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Revenue & Cost Analysis' }
            }
          }
        }
      },
      customers: {
        pie: {
          data: {
            labels: ['New Customers', 'Returning Customers'],
            datasets: [{
              data: [customerInsights.newCustomers || 0, customerInsights.repeatBuyers || 0],
              backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
              borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)'],
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Customer Distribution' }
            }
          }
        },
        bar: {
          data: {
            labels: ['New Customers', 'Returning Customers'],
            datasets: [{
              label: 'Count',
              data: [customerInsights.newCustomers || 0, customerInsights.repeatBuyers || 0],
              backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
              borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)'],
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Customer Distribution' }
            }
          }
        }
      },
      products: {
        pie: {
          data: {
            labels: getProductNames(),
            datasets: [{
              data: getProductSalesData(),
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(156, 163, 175, 0.8)'
              ],
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Top Selling Products' }
            }
          }
        },
        bar: {
          data: {
            labels: getProductNames(),
            datasets: [{
              label: 'Units Sold',
              data: getProductSalesData(),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Top Selling Products' }
            }
          }
        }
      },
      profitGrowth: profitGrowthData[profitGrowthType] || profitGrowthData.monthly
    };
  }, [dashboardData, combinedMetrics, profitTrend, profitGrowth, yearOverYearProfit, profitTimeRange, profitGrowthType]);

  const quickActions = [
    { to: "/add", icon: faPlus, text: "Add Product" },
    { to: "/list", icon: faBoxes, text: "Product List" },
    { to: "/orders", icon: faShoppingCart, text: "Orders" },
    { to: "/dashboard", icon: faRocket, text: "Settings" },
  ];

  // Alerts Modal Component
  const AlertsModal = useCallback(() => (
    <div className="fixed inset-0 bg-brand-ink/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-brand-bronze/10">
        <div className="flex items-center justify-between p-6 border-b border-brand-bronze/10 bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faBell} className="text-brand-bronze text-xl" />
            <h3 className="text-lg font-serif text-brand-ink">Notifications</h3>
            <span className="bg-brand-ink text-brand-cream text-[11px] px-2 py-0.5 rounded-full font-bold">
              {totalNotificationsCount} Active
            </span>
          </div>
          <button onClick={() => setShowAlertsModal(false)} className="text-brand-muted hover:text-brand-ink transition-colors">
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh] custom-scrollbar">
          {commentNotifications.length > 0 && (
            <div className="border-b border-brand-bronze/10">
              <div className="p-4 bg-brand-cream/30">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-ink flex items-center gap-2">
                  <FontAwesomeIcon icon={faComments} className="text-brand-bronze" />
                  Product Reviews ({commentNotifications.length})
                </h4>
              </div>
              <div className="divide-y divide-brand-bronze/5">
                {commentNotifications.map(comment => (
                  <div
                    key={comment._id}
                    className="p-6 transition-colors cursor-pointer hover:bg-brand-cream/10"
                    onClick={() => handleCommentRead(comment._id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-cream border border-brand-bronze/10 rounded-sm flex items-center justify-center">
                        <FontAwesomeIcon icon={faComments} className="text-brand-bronze text-sm" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-ink">
                            {comment.rating ? 'New Product Review' : 'Customer Question'}
                          </h4>
                          {comment.rating && (
                            <div className="flex items-center gap-1 bg-brand-cream px-2 py-0.5 rounded-sm border border-brand-bronze/10">
                              <FontAwesomeIcon icon={faStar} className="text-brand-bronze text-[11px]" />
                              <span className="text-[11px] font-bold text-brand-ink">{comment.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-brand-muted mb-2 leading-relaxed italic">
                          "{comment.content}"
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-brand-muted/60">
                          <span>{comment.author} • {comment.productId?.name}</span>
                          <span>{new Date(comment.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashboardData.alerts.length > 0 && (
            <div>
              <div className="p-4 bg-red-50/30">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                  System Alerts ({dashboardData.alerts.length})
                </h4>
              </div>
              <div className="divide-y divide-red-100/50">
                {dashboardData.alerts.map(alert => (
                  <div key={alert.id} className={`p-6 transition-colors ${!alert.read ? 'bg-red-50/10' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${alert.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-sm" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-ink">{alert.title}</h4>
                          <span className="text-[11px] font-bold uppercase text-brand-muted/60">{new Date(alert.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-brand-muted italic leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-brand-bronze/10 bg-brand-cream/10">
          <button
            onClick={() => setShowAlertsModal(false)}
            className="w-full bg-brand-ink text-brand-cream py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-brand-muted transition-colors rounded-sm"
          >
            Clear Dashboard
          </button>
        </div>
      </div>
    </div>
  ), [commentNotifications, dashboardData.alerts, totalNotificationsCount, handleCommentRead]);

  if (loading) return <LoadingSpinner />;

  const { stats, recentOrders, topProducts, lowStockProducts, customerInsights } = dashboardData;

  return (
    <div className="font-sans">
      <div className="w-full">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-brand-bronze/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
              <p className="text-[11px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Administration</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAlertsModal(true)}
              className="relative w-12 h-12 flex items-center justify-center bg-white border border-brand-bronze/20 text-brand-muted hover:text-brand-ink transition-all"
            >
              <FontAwesomeIcon icon={faBell} />
              {totalNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-bronze text-white text-[11px] font-bold flex items-center justify-center rounded-full animate-bounce">
                  {totalNotificationsCount}
                </span>
              )}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-3 px-8 py-4 bg-brand-ink text-brand-cream rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em] disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSync} className={refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
              <span>{refreshing ? 'Loading...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Primary Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={combinedMetrics.totalRevenue}
            subtitle="Gross Income"
            icon={faPoundSign}
            color="bg-green-500"
          />
          <StatCard
            title="Total Cost"
            value={combinedMetrics.totalCost}
            subtitle="Acquisition Cost"
            icon={faChartLine}
            color="bg-red-500"
          />
          <StatCard
            title="Net Profit"
            value={combinedMetrics.totalProfit}
            subtitle="Net Income"
            icon={faChartPie}
            color="bg-blue-500"
          />
        </div>

        {/* Inventory Flow Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={faBoxes}
            color="bg-brand-bronze"
          />
          <StatCard
            title="Units Sold"
            value={stats.totalItemsSold}
            icon={faShoppingCart}
            color="bg-brand-ink"
          />
          <StatCard
            title="Inventory Value"
            value={combinedMetrics.totalInventoryValue}
            subtitle="Stock Valuation"
            icon={faWarehouse}
            color="bg-brand-cream"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            subtitle={`${stats.pendingOrders} Pending`}
            icon={faClipboardList}
            color="bg-brand-bronze"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue & Profit Chart */}
          <div className="luxury-card p-8">
            <div className="flex items-center justify-between mb-10 border-b border-brand-bronze/5 pb-6">
              <div>
                <h3 className="text-xl font-serif text-brand-ink">Financial Landscape</h3>
                <p className="text-[11px] text-brand-muted uppercase tracking-widest mt-1 font-bold italic">Revenue vs Yield</p>
              </div>
              <ChartToggle
                chartKey="revenue"
                currentView={chartViews.revenue}
                onToggle={(view) => handleChartToggle('revenue', view)}
              />
            </div>
            <div className="h-80">
              {chartViews.revenue === 'pie' ? (
                <Doughnut {...chartConfigs.revenue.pie} />
              ) : (
                <Bar {...chartConfigs.revenue.bar} />
              )}
            </div>
          </div>

          {/* Product Sales Chart */}
          <div className="luxury-card p-8">
            <div className="flex items-center justify-between mb-10 border-b border-brand-bronze/5 pb-6">
              <div>
                <h3 className="text-xl font-serif text-brand-ink">Masterpiece Velocity</h3>
                <p className="text-[11px] text-brand-muted uppercase tracking-widest mt-1 font-bold italic">Top Performance Metrics</p>
              </div>
              <ChartToggle
                chartKey="products"
                currentView={chartViews.products}
                onToggle={(view) => handleChartToggle('products', view)}
              />
            </div>
            <div className="h-80">
              {topProducts.length > 0 ? (
                chartViews.products === 'pie' ? (
                  <Pie {...chartConfigs.products.pie} />
                ) : (
                  <Bar {...chartConfigs.products.bar} />
                )
              ) : (
                <EmptyState icon={faChartBar} message="Awaiting market interaction data" />
              )}
            </div>
          </div>
        </div>

        {/* Operations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Acquisitions */}
          <div className="luxury-card p-8">
            <div className="flex items-center justify-between mb-8 border-b border-brand-bronze/5 pb-6">
              <div>
                <h3 className="text-xl font-serif text-brand-ink">Live Acquisitions</h3>
                <p className="text-[11px] text-brand-muted uppercase tracking-widest mt-1 font-bold italic">Recent Transactional History</p>
              </div>
              <NavLink to="/orders" className="text-[11px] font-bold uppercase tracking-widest text-brand-bronze hover:text-brand-ink transition-colors luxury-underline">
                View Ledger
              </NavLink>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map(order => (
                  <div key={order._id} className="flex items-center justify-between p-6 bg-brand-cream/20 border border-brand-bronze/5 hover:border-brand-bronze/20 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white flex items-center justify-center border border-brand-bronze/10 text-brand-bronze group-hover:bg-brand-ink group-hover:text-brand-cream transition-all duration-500">
                        <FontAwesomeIcon icon={faUsers} className="text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-brand-ink">Asset ID: {order._id?.toString().slice(-8).toUpperCase()}</p>
                        <p className="text-[11px] text-brand-muted font-medium uppercase mt-1 italic">{order.paymentMethod || 'Wire Transfer'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-serif text-brand-ink mb-2">£ {order.amount.toLocaleString()}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={faShoppingCart} message="No recent acquisitions recorded" />
              )}
            </div>
          </div>

          {/* Critical Inventory */}
          <div className="luxury-card p-8">
            <div className="flex items-center justify-between mb-8 border-b border-brand-bronze/5 pb-6">
              <div>
                <h3 className="text-xl font-serif text-brand-ink">Inventory Integrity</h3>
                <p className="text-[11px] text-brand-muted uppercase tracking-widest mt-1 font-bold italic">Critical Scarcity Alerts</p>
              </div>
              <NavLink to="/list" className="text-[11px] font-bold uppercase tracking-widest text-brand-bronze hover:text-brand-ink transition-colors luxury-underline">
                Restock Portfolio
              </NavLink>
            </div>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map(product => (
                  <div key={product._id} className="flex items-center justify-between p-6 bg-red-50/20 border border-red-100/50 hover:bg-red-50/40 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white flex items-center justify-center border border-red-100 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-brand-ink truncate max-w-[150px]">{product.name}</p>
                        <p className="text-[11px] text-red-400 font-bold uppercase mt-1 italic">Critical Alert</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StockBadge stock={product.quantity} />
                      <p className="text-[11px] font-bold text-brand-muted/60 mt-2 uppercase tracking-widest">Market Exposure: High</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={faCheckCircle} message="Portfolio stock levels are optimally secured" />
              )}
            </div>
          </div>
        </div>

        {/* Strategic Shortcuts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <NavLink
              key={i}
              to={action.to}
              className="group luxury-card !p-8 flex flex-col items-center text-center hover:bg-brand-ink transition-all duration-700 hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-brand-cream border border-brand-bronze/10 rounded-sm flex items-center justify-center text-brand-bronze mb-6 group-hover:bg-brand-bronze group-hover:text-white transition-all duration-500">
                <FontAwesomeIcon icon={action.icon} className="text-xl" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-ink group-hover:text-brand-cream transition-colors">{action.text}</span>
            </NavLink>
          ))}
        </div>

        {/* Global Notifications */}
        {showAlertsModal && <AlertsModal />}
      </div>
    </div>
  );
};

export default Dashboard;
