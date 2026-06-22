import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios'
import { cleanName } from '../utils/cleanText';
import { backendUrl, currency } from '../App'
import { useToast } from '../hooks/useToast'
import {
  faArrowLeft,
  faTimes,
  faPlusCircle,
  faFlask,
  faCheckCircle,
  faListUl,
  faEdit,
  faTrashAlt,
  faPlus,
  faSave,
  faCloudUploadAlt,
  faTrash,
  faBoxes,
  faBox
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const ProductDetails = ({ product, mode, token, onBack, onSave }) => {
  const toast = useToast()
  const [formData, setFormData] = useState({
    ...product,
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    subcategory: product.subcategory || '',
    cost: product.cost || 0,
    price: product.price || 0,
    discountprice: product.discountprice || 0,
    quantity: Math.max(0, product.quantity || 0), // Ensure not negative
    bestseller: product.bestseller || false,
    status: product.status || 'draft',
    // Furniture fields
    brand: product.brand || '',
    specs: product.specs || {
      dimensions: "",
      weight: "",
      assembly: false,
      sku: "",
      warranty: "",
      material: "",
      modelNumber: "",
      origin: ""
    },
    variants: product.variants || [],
    hasVariants: (product.variants && product.variants.length > 0) || false,
    dynamicAttributes: product.dynamicAttributes || [],
    warrantyDetails: product.warrantyDetails || "",
    returnPolicy: product.returnPolicy || "",
    careInstructions: product.careInstructions || "",
    deliveryTime: product.deliveryTime || ""
  })

  const [loading, setLoading] = useState(false)
  const [newImages, setNewImages] = useState([])
  const [removedImages, setRemovedImages] = useState([])

  // Fetch categories and subcategories from backend
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Helper function to find subcategory by name or ID
  const findSubcategoryId = (subcategoryIdOrName, subcategoriesList) => {
    if (!subcategoryIdOrName || !subcategoriesList) return '';

    // Try to find by ID first
    const byId = subcategoriesList.find(sub => sub._id === subcategoryIdOrName);
    if (byId) return byId._id;

    // Try to find by name
    const byName = subcategoriesList.find(sub => sub.name === subcategoryIdOrName);
    if (byName) return byName._id;

    return '';
  };

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setCategoriesLoading(true)
        const response = await axios.get(backendUrl + '/api/categories')
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCats()
  }, [])

  // Sync and Normalize formData whenever product or categories change
  useEffect(() => {
    if (!product || categories.length === 0) return;

    const catValue = product.category
    const subValue = product.subcategory

    // Find the category match (by ID or name)
    const catMatch = categories.find(cat => cat._id === catValue || cat.name === catValue)

    let subMatch = null;
    if (catMatch) {
      // Load subcategories for this category
      setSubcategories(catMatch.subcategories || [])
      // Find subcategory match within this category
      subMatch = (catMatch.subcategories || []).find(sub => sub._id === subValue || sub.name === subValue)
    }

    setFormData({
      ...product,
      name: product.name || '',
      description: product.description || '',
      category: catMatch ? catMatch._id : (product.category || ''),
      subcategory: subMatch ? subMatch._id : (product.subcategory || ''),
      cost: product.cost || 0,
      price: product.price || 0,
      discountprice: product.discountprice || 0,
      quantity: Math.max(0, product.quantity || 0),
      bestseller: product.bestseller || false,
      status: product.status || 'draft',
      brand: product.brand || '',
      specs: product.specs || {
        dimensions: "",
        weight: "",
        assembly: false,
        sku: "",
        warranty: "",
        material: "",
        modelNumber: "",
        origin: ""
      },
      variants: product.variants || [],
      hasVariants: (product.variants && product.variants.length > 0) || false,
      dynamicAttributes: product.dynamicAttributes || [],
      warrantyDetails: product.warrantyDetails || "",
      returnPolicy: product.returnPolicy || "",
      careInstructions: product.careInstructions || "",
      deliveryTime: product.deliveryTime || ""
    })
  }, [product, categories])

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(cat => cat._id === formData.category)
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories)

        // Reset subcategory if it doesn't belong to the new category
        if (formData.subcategory) {
          const subcategoryExists = selectedCategory.subcategories.find(
            sub => sub._id === formData.subcategory
          )
          if (!subcategoryExists) {
            setFormData(prev => ({ ...prev, subcategory: '' }))
          }
        }
      } else {
        setSubcategories([])
        setFormData(prev => ({ ...prev, subcategory: '' }))
      }
    } else {
      setSubcategories([])
      setFormData(prev => ({ ...prev, subcategory: '' }))
    }
  }, [formData.category, categories])

  // Helper functions to get names for display
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Select Category'
    // If it's a 24-char hex string (ObjectId), try to find it in the list
    if (typeof categoryId === 'string' && categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      const category = categories.find(cat => cat._id === categoryId)
      if (category) return category.name
    }
    // Otherwise return as is (could be a name)
    return categoryId
  }

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return 'Select Subcategory'
    // If it's a 24-char hex string (ObjectId), try to find it in the current subcategories list
    if (typeof subcategoryId === 'string' && subcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      const subcategory = subcategories.find(sub => sub._id === subcategoryId)
      if (subcategory) return subcategory.name
    }
    // Otherwise return as is (could be a name)
    return subcategoryId
  }

  // Calculate basic pricing metrics
  const calculatePricingSummary = () => {
    let price = parseFloat(formData.price) || 0;
    let sellingPrice = (parseFloat(formData.discountprice) > 0 ? parseFloat(formData.discountprice) : price) || 0;
    let isRange = false;
    let minPrice = price;
    let maxPrice = price;
    let minSellingPrice = sellingPrice;
    let maxSellingPrice = sellingPrice;

    if (formData.hasVariants && formData.variants && formData.variants.length > 0) {
      const variantPrices = formData.variants.map(v => parseFloat(v.price) || 0).filter(p => !isNaN(p));
      const variantSellingPrices = formData.variants.map(v =>
        (parseFloat(v.discountPrice) > 0 ? parseFloat(v.discountPrice) : parseFloat(v.price)) || 0
      ).filter(p => !isNaN(p));

      if (variantPrices.length > 0) {
        minPrice = Math.min(...variantPrices);
        maxPrice = Math.max(...variantPrices);
        minSellingPrice = Math.min(...variantSellingPrices);
        maxSellingPrice = Math.max(...variantSellingPrices);

        if (minPrice !== maxPrice || minSellingPrice !== maxSellingPrice) {
          isRange = true;
        }
      }
    }

    const discountAmount = maxPrice > 0 ? maxPrice - maxSellingPrice : 0;
    const discountPercentage = maxPrice > 0 ? ((discountAmount / maxPrice) * 100) : 0;

    return {
      discountAmount: isNaN(discountAmount) ? 0 : discountAmount,
      discountPercentage: isNaN(discountPercentage) ? 0 : discountPercentage,
      actualSellingPrice: isRange ? `${minSellingPrice.toLocaleString()} - ${maxSellingPrice.toLocaleString()}` : minSellingPrice.toLocaleString(),
      originalPriceDisplay: isRange ? `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}` : minPrice.toLocaleString(),
      isRange
    };
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Special handling for category change
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat._id === value)

      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Only clear subcategory if the new category doesn't have the current subcategory
        subcategory: selectedCategory && formData.subcategory
          ? (selectedCategory.subcategories?.find(
            sub => sub._id === formData.subcategory || sub.name === formData.subcategory
          )?._id || '')
          : ''
      }))
    } else if (name === 'quantity') {
      // Handle quantity change with validation
      let newValue = parseInt(value) || 0;
      // Prevent negative values
      if (newValue < 0) {
        newValue = 0;
        toast.info("Quantity cannot be negative");
      }
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  // Helper function to convert comma-separated string to array
  const convertStringToArray = (str) => {
    if (!str || str.trim() === '') return [];
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
  }

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(prev => [...prev, ...files])
  }

  // Remove existing image
  const removeExistingImage = (index) => {
    setRemovedImages(prev => [...prev, formData.image[index]])
    setFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }))
  }

  // Remove new image (before upload)
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      // Create FormData for file upload
      const formDataToSend = new FormData()

      // Add basic fields
      formDataToSend.append('id', product._id)
      formDataToSend.append('name', cleanName(formData.name))
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('subcategory', formData.subcategory)
      formDataToSend.append('cost', formData.cost.toString())
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('discountprice', formData.discountprice.toString())
      formDataToSend.append('quantity', formData.quantity.toString())
      formDataToSend.append('bestseller', formData.bestseller.toString())
      formDataToSend.append('status', formData.status)

      // Add Furniture fields
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("specs", JSON.stringify(formData.specs));
      formDataToSend.append("dynamicAttributes", JSON.stringify(formData.dynamicAttributes || []));
      formDataToSend.append("hasVariants", (formData.hasVariants || false).toString());
      formDataToSend.append("warrantyDetails", formData.warrantyDetails || "");
      formDataToSend.append("returnPolicy", formData.returnPolicy || "");
      formDataToSend.append("careInstructions", formData.careInstructions || "");
      formDataToSend.append("deliveryTime", formData.deliveryTime || "");

      // Clean variants before stringifying
      const cleanedVariants = formData.variants.map(v => ({
        ...v,
        name: cleanName(v.name),
        description: v.description,
        price: Number(v.price) || 0,
        cost: Number(v.cost) || 0,
        stock: Number(v.stock) || 0,
        discountPrice: Number(v.discountPrice) || 0,
        // Filter out File objects from the JSON image array - they'll be uploaded separately
        images: (v.images || []).filter(img => typeof img === 'string')
      }));
      formDataToSend.append("variants", JSON.stringify(cleanedVariants));

      // Append variant images (Multiple images per variant)
      formData.variants.forEach((v, vIndex) => {
        if (v.images && Array.isArray(v.images)) {
          v.images.forEach((img, imgIndex) => {
            if (img && typeof img !== 'string') {
              formDataToSend.append(`variant_${vIndex}_image_${imgIndex}`, img);
            }
          });
        }
      });

      // Send removedImages as a proper JSON string
      formDataToSend.append('removedImages', JSON.stringify(removedImages))

      // Add new images
      newImages.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image)
      })

      const response = await axios.post(
        backendUrl + '/api/product/update',
        formDataToSend,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        toast.success('Product updated successfully')

        // Clear the image states after successful save
        setNewImages([])
        setRemovedImages([])

        onSave()
        onBack()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Product update error:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id: product._id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        onBack()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete product')
    }
  }

  // Calculate ingredient and benefit counts for display
  const ingredientCount = formData.ingredients ? convertStringToArray(formData.ingredients).length : 0;
  const benefitCount = formData.benefits ? convertStringToArray(formData.benefits).length : 0;

  return (
    <div className="py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <button
                onClick={onBack}
                className="group flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] text-brand-muted hover:text-brand-ink transition-all mb-4"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Products</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-serif text-brand-ink">
                {mode === 'view' ? 'Product Details' : 'Edit Product'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {mode === 'edit' && (
                <>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-4 text-[12px] font-bold uppercase tracking-[0.3em] text-red-400 hover:text-red-600 transition-all"
                  >
                    Delete Product
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="luxury-button !px-10 !py-4 text-[12px] uppercase tracking-[0.3em]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              )}
              {mode === 'view' && (
                <button
                  onClick={() => onSave()} // Using onSave as a trigger to switch mode in parent if needed, or just let parent handle it
                  className="luxury-button !px-10 !py-4 text-[12px] uppercase tracking-[0.3em]"
                >
                  Refine Asset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="luxury-card overflow-hidden">
          <div className="p-10">
            {mode === 'view' ? (
              <ViewMode
                product={product}
                getCategoryName={getCategoryName}
                getSubcategoryName={getSubcategoryName}
              />
            ) : (
              <EditMode
                formData={formData}
                onChange={handleChange}
                loading={loading}
                categories={categories}
                subcategories={subcategories}
                categoriesLoading={categoriesLoading}
                newImages={newImages}
                removedImages={removedImages}
                onImageUpload={handleImageUpload}
                onRemoveExistingImage={removeExistingImage}
                onRemoveNewImage={removeNewImage}
                pricingSummary={calculatePricingSummary()}
                getCategoryName={getCategoryName}
                getSubcategoryName={getSubcategoryName}
                setFormData={setFormData}
                ingredientCount={ingredientCount}
                benefitCount={benefitCount}
              />
            )}
          </div>
        </div>
        {/* Sticky Save Footer - visible in edit mode */}
        {mode !== 'view' && (
          <div className="sticky bottom-0 z-30 mt-8 bg-white/90 backdrop-blur-sm border-t border-brand-bronze/10 px-4 py-4 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
            <p className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-70">
              Unsaved changes will be lost on exit
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDelete}
                className="text-[12px] font-bold uppercase tracking-[0.3em] text-red-400 hover:text-red-600 transition-all px-4 py-2"
              >
                Delete Product
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="luxury-button !px-8 !py-3 text-[12px] uppercase tracking-[0.3em] disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ViewMode = ({ product, getCategoryName, getSubcategoryName }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      {/* Portfolio Media */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze mb-6">Visual Proof</h3>
          <div className="grid grid-cols-2 gap-4">
            {product.image && product.image.map((img, index) => (
              <div key={index} className={`relative overflow-hidden group ${index === 0 ? 'col-span-2' : ''}`}>
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-full aspect-square object-cover border border-brand-bronze/10 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-brand-ink/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-brand-cream/50 border border-brand-bronze/5">
          <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-4">Inventory Metrics</h4>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[12px] uppercase tracking-widest text-brand-muted opacity-60 mb-1">Available Legacy</p>
              <p className="text-2xl font-serif text-brand-ink">{product.quantity} Units</p>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-widest text-brand-muted opacity-60 mb-1">Status</p>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-bronze">{product.status || 'Draft'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Analysis */}
      <div className="lg:col-span-7 space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Curatorial Archive</h3>
            <div className="flex-1 h-[1px] bg-brand-bronze/10"></div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-brand-ink mb-4">{product.name}</h2>
              <div className="text-sm text-brand-muted leading-relaxed font-sans opacity-80 rich-text" dangerouslySetInnerHTML={{ __html: product.description || 'No descriptive record available for this creation.' }} />
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-muted">Legacy Taxonomy</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2">
                    <span className="text-[12px] uppercase tracking-widest text-brand-muted opacity-60">Category</span>
                    <span className="text-sm font-bold text-brand-ink">{getCategoryName(product.category)}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2">
                    <span className="text-[12px] uppercase tracking-widest text-brand-muted opacity-60">Sub-Selection</span>
                    <span className="text-sm font-bold text-brand-ink">{getSubcategoryName(product.subcategory)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-muted">Valuation</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2">
                    <span className="text-[12px] uppercase tracking-widest text-brand-muted opacity-60">Original Price</span>
                    <span className="text-sm font-bold text-brand-ink font-sans">£ {product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-brand-bronze/10 pb-2 text-brand-bronze">
                    <span className="text-[12px] uppercase tracking-widest">Adjusted Value</span>
                    <span className="text-sm font-bold font-sans">£ {product.discountprice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand & Specifications */}
        <div className="grid grid-cols-1 gap-8">


          <div className="p-8 bg-brand-cream/30 border border-brand-bronze/10">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faListUl} className="text-brand-bronze/40 text-xs" />
              <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-muted">Technical Specs</h4>
            </div>
            <div className="space-y-3">
              {(product.dynamicAttributes || []).map((attr, idx) => (
                <div key={idx} className="flex justify-between text-[11px] border-b border-brand-bronze/5 pb-2">
                  <span className="text-brand-muted opacity-60 uppercase tracking-widest">{attr.key}</span>
                  <span className="font-bold text-brand-ink">{attr.value}</span>
                </div>
              ))}
              {(!product.dynamicAttributes || product.dynamicAttributes.length === 0) && (
                <p className="text-[11px] text-brand-muted italic opacity-50">No specifications defined.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-brand-cream/30 border border-brand-bronze/10 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faPlusCircle} className="text-brand-bronze/40 text-xs" />
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-muted">Policies & Archive Care</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-brand-muted opacity-60">Warranty & Returns</span>
              <span className="text-[11px] font-bold text-brand-ink">{product.warrantyDetails || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-brand-muted opacity-60">Care Instructions</span>
              <span className="text-[11px] font-bold text-brand-ink">{product.careInstructions || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-brand-muted opacity-60">Assembly Information</span>
              <span className="text-[11px] font-bold text-brand-ink">{product.deliveryTime || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Variants View */}
        {product.variants && product.variants.length > 0 && (
          <div className="p-8 bg-brand-cream/10 border border-brand-bronze/10">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faBoxes} className="text-brand-bronze/40 text-xs" />
              <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-muted">Product Variations</h4>
            </div>
            <div className="space-y-6">
              {product.variants.map((v, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white/50 border border-brand-bronze/5">
                  <div className="flex gap-2 shrink-0 overflow-x-auto max-w-[200px] custom-scrollbar pb-1">
                    {(v.images || (v.image ? [v.image] : [])).map((img, iIndex) => (
                      <img key={iIndex} src={img} className="w-12 h-12 object-cover border border-brand-bronze/10 rounded" alt="variant" />
                    ))}
                    {(!v.images || v.images.length === 0) && !v.image && (
                      <div className="w-12 h-12 bg-brand-cream rounded flex items-center justify-center border border-brand-bronze/10">
                        <FontAwesomeIcon icon={faBox} className="text-brand-muted/20 text-xs" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-md font-bold text-brand-ink uppercase">{v.name}</span>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-serif ${v.discountPrice > 0 ? 'text-red-400 line-through' : 'text-brand-bronze'}`}>
                          £ {v.price?.toLocaleString()}
                        </span>
                        {v.discountPrice > 0 && (
                          <span className="text-sm font-serif text-brand-bronze">£ {v.discountPrice?.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className="text-[12px] text-brand-muted leading-relaxed font-sans line-clamp-2 mb-2 rich-text"
                      dangerouslySetInnerHTML={{ __html: v.description || 'No specific details provided.' }}
                    />
                    <div className="flex gap-4">
                      <span className="text-sm font-bold uppercase text-brand-muted opacity-60 font-sans">Cost: £ {(v.cost || product.cost)?.toLocaleString()}</span>
                      <span className="text-sm font-bold uppercase text-brand-muted opacity-60 font-sans">Stock: {v.stock}</span>
                      <span className="text-sm font-bold uppercase text-brand-muted opacity-60">SKU: {v.sku}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const EditMode = ({
  formData,
  onChange,
  loading,
  categories,
  subcategories,
  categoriesLoading,
  newImages,
  removedImages,
  onImageUpload,
  onRemoveExistingImage,
  onRemoveNewImage,
  pricingSummary,
  getCategoryName,
  getSubcategoryName,
  setFormData,
  ingredientCount,
  benefitCount
}) => {
  const {
    discountAmount,
    discountPercentage,
    actualSellingPrice,
    originalPriceDisplay,
    isRange
  } = pricingSummary;

  return (
    <div className="space-y-16">
      {/* Prime Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Product Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="luxury-input"
                  placeholder="e.g. Victorian Mahogany Chair"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                    className="luxury-input appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Subcategory</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={onChange}
                    disabled={!formData.category}
                    className="luxury-input appearance-none disabled:opacity-30"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Pricing &amp; Inventory</h3>
              <label className="flex items-center cursor-pointer gap-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">Has Variants</span>
                <input type="checkbox" className="sr-only" checked={formData.hasVariants || false} onChange={() =>
                  setFormData(prev => ({ ...prev, hasVariants: !prev.hasVariants, variants: !prev.hasVariants ? prev.variants : [] }))
                } />
                <div className={`w-10 h-5 rounded-full transition-all duration-500 border border-brand-bronze/20 flex items-center px-0.5 ${formData.hasVariants ? 'bg-brand-ink' : 'bg-brand-cream'}`}>
                  <div className={`w-4 h-4 rounded-full transition-all duration-500 transform ${formData.hasVariants ? 'translate-x-5 bg-brand-bronze' : 'translate-x-0 bg-brand-bronze/30'}`}></div>
                </div>
              </label>
            </div>
            {!formData.hasVariants && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/40 text-[12px]">£</span>
                    <input type="number" name="cost" value={formData.cost} onChange={onChange} className="luxury-input !pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Original Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/40 text-[12px]">£</span>
                    <input type="number" name="price" value={formData.price} onChange={onChange} className="luxury-input !pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Discounted Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-bronze/40 text-[12px]">£</span>
                    <input type="number" name="discountprice" value={formData.discountprice} onChange={onChange} className="luxury-input !pl-10 text-brand-bronze font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Total Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={onChange} className="luxury-input" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Visibility & Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Product Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="luxury-input"
                >
                  <option value="draft">Draft</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="luxury-input flex items-center gap-4 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={onChange}
                    className="w-4 h-4 accent-brand-bronze"
                  />
                  <span className="text-[12px] font-bold uppercase tracking-widest text-brand-muted group-hover:text-brand-ink transition-colors">Curated Bestseller</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Product Description</label>
            <div className="quill-luxury">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                modules={quillModules}
                placeholder="Describe the provenance and aesthetic of this creation..."
                className="bg-white/50 border border-brand-bronze/20 rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Characteristics */}
      <div className="border-t border-brand-bronze/10 pt-12">
        <div className="space-y-12">
          {/* Brand & Specs Edit */}
          <div className="grid grid-cols-1 gap-12">

            <div className="space-y-6">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze flex items-center gap-2">
                <FontAwesomeIcon icon={faListUl} /> Dimensions & Weight
              </h3>
              <div className="space-y-4">
                {(formData.dynamicAttributes || []).map((attr, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-brand-cream/30 p-4 border border-brand-bronze/10">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={attr.key}
                        onChange={e => {
                          const newArr = [...formData.dynamicAttributes];
                          newArr[index].key = e.target.value;
                          setFormData(prev => ({ ...prev, dynamicAttributes: newArr }));
                        }}
                        className="luxury-input text-sm"
                        placeholder="Feature (e.g. Material)"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={attr.value}
                        onChange={e => {
                          const newArr = [...formData.dynamicAttributes];
                          newArr[index].value = e.target.value;
                          setFormData(prev => ({ ...prev, dynamicAttributes: newArr }));
                        }}
                        className="luxury-input !text-sm"
                        placeholder="Value (e.g. Solid Wood)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newArr = formData.dynamicAttributes.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, dynamicAttributes: newArr }));
                      }}
                      className="text-red-400 hover:text-red-500 p-2"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    dynamicAttributes: [...(prev.dynamicAttributes || []), { key: "", value: "" }]
                  }))}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-bronze hover:text-brand-ink"
                >
                  + Add Specification
                </button>
              </div>
            </div>
          </div>
          {/* Policies & Care Instructions */}
          <div className="space-y-6 pt-6 border-l-2 border-brand-bronze/10 pl-6">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze flex items-center gap-2">
              <FontAwesomeIcon icon={faPlusCircle} /> Policies & Care Instructions
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Warranty & Returns</label>
                <input
                  type="text"
                  value={formData.warrantyDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, warrantyDetails: e.target.value }))}
                  className="luxury-input text-xs"
                  placeholder="e.g. 10 Years Warranty on Frame"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Care Instructions</label>
                <input
                  type="text"
                  value={formData.careInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
                  className="luxury-input text-xs"
                  placeholder="e.g. Wipe with dry cloth"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Assembly Information</label>
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  className="luxury-input text-xs"
                  placeholder="e.g. Minimal assembly required"
                />
              </div>
            </div>
          </div>

          {/* Variants Edit — only shown when hasVariants is ON */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Product Variants</h3>
              {formData.hasVariants && (
                <button
                  type="button"
                  onClick={() => {
                    const newVariants = [...formData.variants, { name: "", price: "", discountPrice: "", stock: "", sku: "", images: [], description: "" }];
                    setFormData(prev => ({ ...prev, variants: newVariants }));
                  }}
                  className="text-[12px] font-bold uppercase text-brand-bronze"
                >
                  + Add Variant
                </button>
              )}
            </div>

            {formData.hasVariants ? (
              <div className="space-y-4">
                {formData.variants.map((v, vIndex) => (
                  <div key={vIndex} className="p-6 bg-brand-cream/20 border border-brand-bronze/10 rounded-sm relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Variant Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Large / Oak Wood"
                          value={v.name}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[vIndex].name = e.target.value;
                            setFormData(prev => ({ ...prev, variants: newVariants }));
                          }}
                          className="luxury-input text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Price (£)</label>
                          <input
                            type="number"
                            placeholder="Price"
                            value={v.price}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].price = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="luxury-input text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Cost (£)</label>
                          <input
                            type="number"
                            placeholder="Cost"
                            value={v.cost}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].cost = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="luxury-input text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Stock</label>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={v.stock}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].stock = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="luxury-input text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Sale Price</label>
                          <input
                            type="number"
                            placeholder="Sale Price"
                            value={v.discountPrice}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].discountPrice = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="luxury-input text-xs text-red-500 font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60">SKU</label>
                          <input
                            type="text"
                            placeholder="SKU"
                            value={v.sku}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].sku = e.target.value;
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="luxury-input text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-brand-muted opacity-60 mb-2 block">Variant Images</label>
                      <div className="flex flex-wrap gap-3">
                        {v.images?.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative w-14 h-14 border rounded-sm overflow-hidden group/img">
                            <img
                              src={
                                typeof img === 'string'
                                  ? img
                                  : (img && (img instanceof File || img instanceof Blob) ? URL.createObjectURL(img) : '')
                              }
                              alt="variant"
                              className="w-full h-full object-cover"
                            />
                            <button type="button" onClick={() => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].images = newVariants[vIndex].images.filter((_, i) => i !== imgIndex);
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <FontAwesomeIcon icon={faTimes} className="text-white text-[12px]" />
                            </button>
                          </div>
                        ))}
                        <label className="w-14 h-14 flex flex-col items-center justify-center border border-dashed border-brand-bronze/30 bg-brand-cream/20 hover:bg-brand-cream/40 cursor-pointer transition-all rounded-sm overflow-hidden text-brand-bronze/50">
                          <FontAwesomeIcon icon={faCloudUploadAlt} className="text-xs" />
                          <span className="text-[12px] mt-1 uppercase font-bold">Add</span>
                          <input type="file" multiple onChange={(e) => {
                            const files = Array.from(e.target.files);
                            const newVariants = [...formData.variants];
                            newVariants[vIndex].images = [...(newVariants[vIndex].images || []), ...files];
                            setFormData(prev => ({ ...prev, variants: newVariants }));
                          }} hidden accept="image/*" />
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newVariants = formData.variants.filter((_, i) => i !== vIndex);
                        setFormData(prev => ({ ...prev, variants: newVariants }));
                      }}
                      className="absolute top-2 right-2 text-brand-muted hover:text-red-400 p-2 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-brand-muted/60 uppercase tracking-widest py-6 border border-dashed border-brand-bronze/10 text-center">
                Enable "Has Variants" above to add product variations.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Media Management */}

      <div className="border-t border-brand-bronze/10 pt-12">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-bronze mb-8">Featured Images</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Existing Images */}
          {formData.image?.map((img, index) => (
            <div key={index} className="relative aspect-square group">
              <img src={img} className="w-full h-full object-cover border border-brand-bronze/10" />
              <button
                type="button"
                onClick={() => onRemoveExistingImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
              >
                <FontAwesomeIcon icon={faTimes} className="text-[12px]" />
              </button>
            </div>
          ))}

          {/* New Images */}
          {newImages.map((image, index) => (
            <div key={index} className="relative aspect-square group">
              <img src={image && (image instanceof File || image instanceof Blob) ? URL.createObjectURL(image) : ''} className="w-full h-full object-cover border border-brand-bronze/30 opacity-60" />
              <button
                type="button"
                onClick={() => onRemoveNewImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <FontAwesomeIcon icon={faTimes} className="text-[12px]" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-brand-bronze opacity-40" />
              </div>
            </div>
          ))}

          {/* Multi-upload Trigger */}
          <label className="aspect-square border-2 border-dashed border-brand-bronze/20 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-cream/50 transition-colors group">
            <FontAwesomeIcon icon={faPlus} className="text-brand-bronze/30 group-hover:text-brand-bronze transition-colors mb-2" />
            <span className="text-[12px] font-bold uppercase tracking-widest text-brand-muted/40 group-hover:text-brand-muted/80 transition-colors">Add Media</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {
          removedImages.length > 0 && (
            <p className="mt-6 text-[12px] font-bold uppercase tracking-widest text-red-400 animate-pulse">
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              {removedImages.length} Artifact(s) queued for removal
            </p>
          )
        }
      </div>

      {/* Fiscal Overview */}
      <div className="bg-brand-ink p-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex items-center gap-10">
          <div>
            <p className="text-[12px] uppercase tracking-widest text-white/40 mb-2">
              {isRange ? 'Original Price Range' : 'Original Price'}
            </p>
            <p className="text-2xl font-serif text-white">£ {originalPriceDisplay}</p>
          </div>
          <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
          <div>
            <p className="text-[12px] uppercase tracking-widest text-white mb-2">Discount</p>
            <p className="text-2xl font-serif text-white">
              {discountPercentage > 0 ? `${discountPercentage.toFixed(1)}%` : 'No Discount'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[12px] uppercase tracking-widest text-white/40 mb-2">
            {isRange ? 'Selling Price Range' : 'Selling Price'}
          </p>
          <p className="text-4xl font-serif text-white">£ {actualSellingPrice}</p>
        </div>
      </div>
    </div>
  )
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-4 border-b border-brand-bronze/10 last:border-b-0">
    <span className="text-sm font-bold uppercase tracking-widest text-brand-muted opacity-60">{label}</span>
    <span className="text-sm font-bold text-brand-ink uppercase tracking-wider">{value}</span>
  </div>
)

export default ProductDetails;
