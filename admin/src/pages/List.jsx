import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { useToast } from '../hooks/useToast'
import ProductDetails from '../components/ProductDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cleanName } from '../utils/cleanText'
import {
  faBox,
  faTags,
  faEye,
  faEdit,
  faTrashAlt,
  faCalendarAlt,
  faShoppingBag,
  faPercent,
  faPoundSign,
  faCube,
  faFire,
  faPlus,
  faMinus,
  faWarehouse,
  faExclamationTriangle,
  faCheckCircle,
  faTimes,
  faClock,
  faHourglassEnd,
  faFlask,
  faInfoCircle,
  faListUl,
  faChartLine,
  faBoxes,
  faStar
} from '@fortawesome/free-solid-svg-icons'

const List = ({ token }) => {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [previewProduct, setPreviewProduct] = useState(null)
  const [categories, setCategories] = useState([]) // Store categories globally

  // Fetch categories for mapping
  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/categories');
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list?status=all')

      if (response.data.success) {
        setProducts(response.data.products);
        // Sync selected product if currently in view/edit
        if (selectedProduct) {
          const updated = response.data.products.find(p => p._id === selectedProduct._id);
          if (updated) setSelectedProduct(updated);
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchProducts()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const updateProductStatus = async (id, status) => {
    try {
      setProducts(prev =>
        prev.map(p => (p._id === id ? { ...p, status } : p))
      )

      const response = await axios.post(
        backendUrl + '/api/product/update-status',
        { id, status },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Product status updated successfully')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log('Product status update error:', error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const updateProductStock = async (productId, newQuantity) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update-stock',
        { id: productId, quantity: newQuantity },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Stock updated successfully')
        setProducts(prev =>
          prev.map(p => p._id === productId ? { ...p, quantity: newQuantity } : p)
        )
        return true
      } else {
        toast.error(response.data.message)
        return false
      }
    } catch (error) {
      console.log('Stock update error:', error)
      toast.error(error.response?.data?.message || error.message)
      return false
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setViewMode('edit')
  }

  const handleViewDetails = (product) => {
    setPreviewProduct(product)
  }

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-brand-bronze/20 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-brand-ink rounded-full animate-spin"></div>
        </div>
        <p className="mt-8 font-serif text-xl tracking-[0.2em] text-brand-ink animate-pulse uppercase">Loading Products...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {viewMode === 'list' ? (
          <>
            <div className="mb-12 text-left">
              <div className="flex items-center justify-start gap-3 mb-3">
                <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
                <p className="text-[12px] md:text-sm tracking-[0.4em] text-brand-bronze uppercase font-bold">Products List</p>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">All Products</h1>
              <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
                Manage your products here.
              </p>
            </div>

            <div className="overflow-hidden">


              {products.length === 0 ? (
                <EmptyState type="products" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((item, index) => (
                    <ProductListView
                      key={index}
                      item={item}
                      onView={handleViewDetails}
                      onEdit={handleEditProduct}
                      onDelete={removeProduct}
                      onStatusChange={updateProductStatus}
                      onStockUpdate={updateProductStock}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-700">
            {selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                token={token}
                onSave={fetchProducts}
                onBack={() => setViewMode('list')}
              />
            )}
          </div>
        )}
      </div>

      {previewProduct && (
        <ProductDetailsPreview
          product={previewProduct}
          categories={categories}
          onClose={() => setPreviewProduct(null)}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  )
}

// Sub-components
const ProductListView = ({ item, onView, onEdit, onDelete, onStatusChange, onStockUpdate }) => {
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleStockUpdate = async (newVal) => {
    if (newVal < 0) return;
    setIsUpdatingStock(true);
    const success = await onStockUpdate(item._id, newVal);
    if (success) {
      setLocalQuantity(newVal);
    }
    setIsUpdatingStock(false);
  };

  const getArrayLength = (arr) => Array.isArray(arr) ? arr.length : 0;

  return (
    <div className="group bg-white border border-brand-bronze/10 p-5 rounded-sm hover:shadow-2xl hover:shadow-brand-bronze/5 hover:border-brand-bronze/30 transition-all duration-700 h-full flex flex-col relative overflow-hidden">
      {/* Decorative Corner */}
      <div className="absolute -top-12 -right-12 w-24 h-20 bg-brand-cream/30 rotate-45 transform transition-transform group-hover:scale-110"></div>

      <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-brand-cream border border-brand-bronze/5">
        <img
          src={item.image?.[0] || '/placeholder-image.jpg'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-brand-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <button
            onClick={() => onView(item)}
            className="w-10 h-10 rounded-full bg-white text-brand-ink flex items-center justify-center hover:bg-brand-bronze hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="w-10 h-10 rounded-full bg-white text-brand-ink flex items-center justify-center hover:bg-brand-bronze hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>

        {item.bestseller && (
          <div className="absolute top-4 left-4">
            <span className="luxury-badge bg-brand-ink text-white border-none text-[12px] md:text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faStar} className="text-brand-bronze" />
              Bestseller
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-serif text-lg text-brand-ink mb-1 group-hover:text-brand-bronze transition-colors break-words">
              {cleanName(item.name)}
            </h3>
            <p className="text-[12px] md:text-sm font-bold uppercase tracking-widest text-brand-muted opacity-60">
              Ref: {item._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right shrink-0 ml-4 min-w-[80px]">
            <p className="text-lg font-sans font-bold text-brand-ink">£ {item.price.toLocaleString()}</p>
            {item.discountprice > 0 && (
              <p className="text-sm text-red-400 line-through">£ {item.discountprice.toLocaleString()}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {getArrayLength(item.variants) > 0 && (
            <span className="luxury-badge bg-brand-bronze/10 text-brand-bronze border-brand-bronze/20 italic lowercase tracking-wider">
              {getArrayLength(item.variants)} variations
            </span>
          )}
          {item.brand && (
            <span className="luxury-badge bg-brand-ink/5 text-brand-ink/60 border-brand-ink/10 italic lowercase tracking-wider">
              {item.brand}
            </span>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-brand-bronze/5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStockUpdate(localQuantity - 1)}
                disabled={isUpdatingStock}
                className="w-6 h-6 border border-brand-bronze/10 text-brand-muted hover:bg-white hover:text-brand-ink flex items-center justify-center text-[12px] md:text-sm transition-all"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className={`text-sm font-bold leading-none w-8 text-center ${isUpdatingStock ? 'opacity-30' : ''}`}>
                {localQuantity}
              </span>
              <button
                onClick={() => handleStockUpdate(localQuantity + 1)}
                disabled={isUpdatingStock}
                className="w-6 h-6 border border-brand-bronze/10 text-brand-muted hover:bg-white hover:text-brand-ink flex items-center justify-center text-[12px] md:text-sm transition-all"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <StatusDropdown currentStatus={item.status} onStatusChange={(val) => onStatusChange(item._id, val)} />
          </div>

          <div className="grid grid-cols-2 lg:hidden gap-3">
            <MobileActionButton onClick={() => onView(item)} variant="secondary" icon="view" label="View" />
            <MobileActionButton onClick={() => onEdit(item)} variant="secondary" icon="edit" label="Edit" />
            <MobileActionButton onClick={() => onDelete(item._id)} variant="danger" icon="delete" label="Delete" />
          </div>
          <div className="hidden lg:flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <ActionButton onClick={() => onEdit(item)} variant="edit" icon="edit" label="Update Product" />
            <ActionButton onClick={() => onDelete(item._id)} variant="danger" icon="delete" label="Delete Product" />
          </div>
        </div>
      </div>
    </div>
  )
}

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  const statusOptions = [
    { value: 'draft', label: 'Draft', class: 'luxury-badge-draft' },
    { value: 'private', label: 'Private', class: 'luxury-badge-archived' },
    { value: 'public', label: 'Public', class: 'luxury-badge-published' },
  ]

  const currentOption = statusOptions.find(o => o.value === currentStatus) || statusOptions[0];

  return (
    <div className="relative group min-w-[120px]">
      <select
        value={currentStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className={`appearance-none w-full luxury-badge ${currentOption.class} cursor-pointer pr-8`}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <FontAwesomeIcon icon={faPlus} className="text-[12px] md:text-sm rotate-45" />
      </div>
    </div>
  )
}

const MobileActionButton = ({ onClick, variant, icon, label }) => {
  const variants = {
    primary: "bg-brand-ink text-white",
    secondary: "bg-brand-cream text-brand-ink border-brand-bronze/20",
    danger: "bg-red-50 text-red-600 border-red-100",
  }

  const icons = {
    view: faEye,
    edit: faEdit,
    delete: faTrashAlt
  }

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-[12px] md:text-sm font-bold uppercase tracking-widest rounded-sm border transition-all ${variants[variant]}`}
    >
      <FontAwesomeIcon icon={icons[icon]} />
      {label}
    </button>
  )
}

const ActionButton = ({ onClick, variant, icon, label }) => {
  const variants = {
    ghost: "text-brand-muted hover:text-brand-ink hover:bg-brand-cream border-transparent",
    danger: "text-red-400 hover:text-red-600 hover:bg-red-50 border-transparent",
    edit: "text-brand-bronze hover:text-white hover:bg-brand-bronze border-brand-bronze/10",
  }

  const icons = {
    view: faEye,
    edit: faEdit,
    delete: faTrashAlt
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 text-[12px] md:text-sm font-bold uppercase tracking-widest rounded-sm border transition-all duration-300 ${variants[variant]}`}
      title={label}
    >
      <FontAwesomeIcon icon={icons[icon]} className="text-xs" />
      <span className="hidden xl:inline">{label}</span>
    </button>
  )
}

const EmptyState = ({ type }) => (
  <div className="py-24 text-center">
    <div className="max-w-md mx-auto space-y-6">
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto ring-1 ring-brand-bronze/10">
          <FontAwesomeIcon
            icon={type === 'products' ? faShoppingBag : faTags}
            className="text-3xl text-brand-bronze/40"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-brand-bronze/10">
          <FontAwesomeIcon icon={faPlus} className="text-xs text-brand-muted" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-serif text-brand-ink mb-2 italic">No Products Found</h3>
        <p className="text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] text-brand-muted">No {type} have been added yet.</p>
      </div>
      <button className="luxury-button !px-10 !py-4 text-[12px] md:text-sm uppercase tracking-[0.3em]">
        Add Product
      </button>
    </div>
  </div>
)

const ProductDetailsPreview = ({ product, onClose, onEdit, categories }) => {
  if (!product) return null;

  const getCategoryName = (categoryIdOrName) => {
    if (!categoryIdOrName) return 'Uncategorized';
    if (typeof categoryIdOrName === 'string' && !categoryIdOrName.match(/^[0-9a-fA-F]{24}$/)) return categoryIdOrName;
    if (categories && Array.isArray(categories)) {
      const category = categories.find(cat => cat._id === categoryIdOrName);
      if (category) return category.name;
    }
    return 'Category';
  };

  const getSubcategoryName = (categoryId, subcategoryId) => {
    if (!subcategoryId) return 'Sub Category';
    if (typeof subcategoryId === 'string' && !subcategoryId.match(/^[0-9a-fA-F]{24}$/)) return subcategoryId;
    if (categories && Array.isArray(categories)) {
      const category = categories.find(cat => cat._id === categoryId);
      if (category && category.subcategories && Array.isArray(category.subcategories)) {
        const subcategory = category.subcategories.find(sub => sub._id === subcategoryId);
        if (subcategory) return subcategory.name;
      }
    }
    return 'Sub Category';
  };

  return (
    <div className="fixed inset-0 bg-brand-ink/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] overflow-hidden flex flex-col rounded-sm shadow-2xl relative">
        <div className="absolute inset-0 border-[12px] border-brand-cream pointer-events-none z-0"></div>

        <div className="relative z-10 flex justify-between items-center px-10 py-8 border-b border-brand-bronze/10">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-bronze mb-2">Product Details</h2>
            <h3 className="text-3xl font-serif text-brand-ink">{cleanName(product.name)}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-brand-cream transition-colors group"
          >
            <FontAwesomeIcon icon={faTimes} className="text-brand-muted group-hover:text-brand-ink transition-colors" />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-square bg-brand-cream overflow-hidden border border-brand-bronze/10">
                <img
                  src={product.image?.[0] || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.image?.slice(1, 4).map((img, index) => (
                  <div key={index} className="aspect-square bg-brand-cream border border-brand-bronze/10">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="p-6 bg-brand-cream/50 border border-brand-bronze/5">
                <h4 className="text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] text-brand-muted mb-4">Inventory Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] md:text-sm uppercase tracking-widest text-brand-muted opacity-60 mb-1">Quantity Available</p>
                    <p className="text-xl font-serif text-brand-ink">{product.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[12px] md:text-sm uppercase tracking-widest text-brand-muted opacity-60 mb-1">Total Sales</p>
                    <p className="text-xl font-serif text-brand-ink">{product.totalSales || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h4 className="text-[12px] md:text-sm font-bold uppercase tracking-[0.3em] text-brand-bronze">Product Description</h4>
                  <div className="flex-1 h-[1px] bg-brand-bronze/10"></div>
                </div>
                <div className="text-sm text-brand-muted leading-relaxed font-medium rich-text" dangerouslySetInnerHTML={{ __html: product.description || 'No description available for this product.' }} />
              </section>

              <div className="grid grid-cols-2 gap-12">
                <section>
                  <h4 className="text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] text-brand-muted mb-4">Categories</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2">
                      <span className="text-[12px] md:text-sm uppercase tracking-widest text-brand-muted">Category</span>
                      <span className="text-[12px] md:text-sm font-bold text-brand-ink uppercase tracking-wider">{getCategoryName(product.category)}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2">
                      <span className="text-[12px] md:text-sm uppercase tracking-widest text-brand-muted">Sub Category</span>
                      <span className="text-[12px] md:text-sm font-bold text-brand-ink uppercase tracking-wider">{getSubcategoryName(product.category, product.subcategory)}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] text-brand-muted mb-4">Pricing Details</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2">
                      <span className="text-[12px] md:text-sm uppercase tracking-widest text-brand-muted">Cost Price</span>
                      <span className="text-[12px] md:text-sm font-bold text-brand-ink uppercase tracking-wider">£ {product.cost?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2 text-brand-bronze">
                      <span className="text-[12px] md:text-sm uppercase tracking-widest">Selling Price</span>
                      <span className="text-[12px] md:text-sm font-bold uppercase tracking-wider">£ {(product.discountprice || product.price).toLocaleString()}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Advanced Specs Preview */}
              {product.brand && (
                <section className="bg-brand-cream/30 p-8 border border-brand-bronze/5">
                  <div className="flex items-center gap-3 mb-4">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-brand-bronze/40 text-xs" />
                    <h4 className="text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] text-brand-muted">Technical Specifications</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 text-[12px] md:text-sm">
                    <div className="flex flex-col">
                      <span className="text-brand-muted opacity-60 uppercase tracking-widest">Brand</span>
                      <span className="font-bold text-brand-ink uppercase">{product.brand}</span>
                    </div>
                    {product.specs?.dimensions && (
                      <div className="flex flex-col">
                        <span className="text-brand-muted opacity-60 uppercase tracking-widest">Dimensions</span>
                        <span className="font-bold text-brand-ink uppercase">{product.specs.dimensions}</span>
                      </div>
                    )}
                    {product.specs?.material && (
                      <div className="flex flex-col">
                        <span className="text-brand-muted opacity-60 uppercase tracking-widest">Material</span>
                        <span className="font-bold text-brand-ink uppercase">{product.specs.material}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h4 className="text-[12px] md:text-sm font-bold uppercase tracking-[0.3em] text-brand-bronze">Product Variations</h4>
                    <div className="flex-1 h-[1px] bg-brand-bronze/10"></div>
                  </div>
                  <div className="space-y-4">
                    {product.variants.map((v, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-brand-bronze/5 bg-brand-cream/20">
                        <div className="w-16 h-16 bg-brand-cream border border-brand-bronze/10 flex-shrink-0">
                          <img
                            src={v.images?.[0] || v.image || (product.image && product.image[0])}
                            alt={v.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-[12px] md:text-sm font-bold uppercase text-brand-ink">{v.name}</h5>
                            <span className="text-[12px] md:text-sm font-serif text-brand-bronze">£ {v.price?.toLocaleString()}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-[12px] md:text-sm text-brand-muted opacity-60 uppercase tracking-widest font-bold">
                            <span>Cost: £ {(v.cost || product.cost)?.toLocaleString()}</span>
                            <span>Stock: {v.stock}</span>
                            <span>SKU: {v.sku || 'N/A'}</span>
                          </div>
                          {v.description && (
                            <p className="text-[12px] md:text-sm text-brand-muted italic mt-2 line-clamp-1">{v.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 px-10 py-8 border-t border-brand-bronze/10 flex justify-end gap-6 bg-white">
          <button
            onClick={onClose}
            className="text-[12px] md:text-sm font-bold uppercase tracking-[0.3em] text-brand-muted hover:text-brand-ink transition-all"
          >
            Close Preview
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="luxury-button !px-10"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default List
