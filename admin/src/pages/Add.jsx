import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import axios from "axios";
import { useToast } from "../hooks/useToast";
import { backendUrl } from "../App";
import { useAuth } from "../context/AuthContext";

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faTags, faSpinner, faExclamationTriangle, faPlusCircle, faCloudUploadAlt,
  faStar, faChartLine, faBoxes, faTrashAlt, faPercent, faReceipt, faShoppingBag,
  faCalendarAlt, faDollarSign, faFlask, faInfoCircle, faCheckCircle, faListUl,
  faLink, faWeightHanging, faTruck, faVideo, faEye
} from '@fortawesome/free-solid-svg-icons';

const Add = () => {
  const { token, logout } = useAuth();
  const toast = useToast();

  // --- Category & Subcategory State ---
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // --- Product Info State ---
  const [images, setImages] = useState([null, null, null, null]);
  // Removed imageAltText and videoUrl state

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const [dynamicAttributes, setDynamicAttributes] = useState([]);
  const [variants, setVariants] = useState([]);

  const [trackInventory, setTrackInventory] = useState(true);
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [quantity, setQuantity] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState(5);

  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [discountprice, setDiscountprice] = useState("");
  const [discountStartDate, setDiscountStartDate] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(true);

  const [weight, setWeight] = useState("");
  const [shippingClass, setShippingClass] = useState("normal");
  const [deliveryTime, setDeliveryTime] = useState("3-7 days");
  const [freeShipping, setFreeShipping] = useState(false);

  const [status, setStatus] = useState("published");
  const [visibility, setVisibility] = useState("public");
  const [featuredProduct, setFeaturedProduct] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  const [warrantyDetails, setWarrantyDetails] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [careInstructions, setCareInstructions] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/categories');
      if (response.data) {
        setCategories(response.data);
        if (response.data.length > 0) {
          const firstCategory = response.data[0];
          setCategory(firstCategory._id);
          if (firstCategory.subcategories && firstCategory.subcategories.length > 0) {
            setSubCategory(firstCategory.subcategories[0]._id);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const resetForm = () => {
    setImages([null, null, null, null]);
    // Removed imageAltText and videoUrl resets
    setName("");
    setShortDescription("");
    setDescription("");
    setDynamicAttributes([]);
    setVariants([]);
    setTrackInventory(true);
    setStockStatus("in_stock");
    setQuantity("");
    setLowStockAlert(5);
    setCost("");
    setPrice("");
    setDiscountprice("");
    setDiscountStartDate("");
    setDiscountEndDate("");
    setTaxIncluded(true);
    setWeight("");
    setShippingClass("normal");
    setDeliveryTime("3-7 days");
    setFreeShipping(false);
    setStatus("draft");
    setVisibility("public");
    setFeaturedProduct(false);
    setBestseller(false);
    setWarrantyDetails("");
    setReturnPolicy("");
    setCareInstructions("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Not Authorized. Please login.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("shortDescription", shortDescription);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subcategory", subCategory);

      formData.append("dynamicAttributes", JSON.stringify(dynamicAttributes));
      formData.append("variants", JSON.stringify(variants));

      formData.append("quantity", Number(quantity || 0));
      formData.append("trackInventory", trackInventory);
      formData.append("stockStatus", stockStatus);
      formData.append("lowStockAlert", Number(lowStockAlert || 0));

      formData.append("cost", Number(cost || 0));
      formData.append("price", Number(price));
      formData.append("discountprice", Number(discountprice || price));
      formData.append("discountStartDate", discountStartDate);
      formData.append("discountEndDate", discountEndDate);
      formData.append("taxIncluded", taxIncluded);

      formData.append("weight", Number(weight || 0));
      formData.append("shippingClass", shippingClass);
      formData.append("deliveryTime", deliveryTime);
      formData.append("freeShipping", freeShipping);

      formData.append("status", status);
      formData.append("visibility", visibility);
      formData.append("featuredProduct", featuredProduct);
      formData.append("bestseller", bestseller);

      formData.append("warrantyDetails", warrantyDetails);
      formData.append("returnPolicy", returnPolicy);
      formData.append("careInstructions", careInstructions);

      // Removed imageAltText and videoUrl appending

      variants.forEach((v, vIndex) => {
        if (v.images && Array.isArray(v.images)) {
          v.images.forEach((img, imgIndex) => {
            if (img && typeof img !== 'string') {
              formData.append(`variant_${vIndex}_image_${imgIndex}`, img);
            }
          });
        }
      });

      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      const { data } = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      } else {
        toast.error(err.response?.data?.message || err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryObj = categories.find(cat => cat._id === category);
  const subcategories = currentCategoryObj?.subcategories || [];

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mb-12 text-left">
          <div className="flex items-center justify-start gap-3 mb-3">
            <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
            <p className="text-[10px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Product Management</p>
            <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Add New Product</h1>
          <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
            Enter the comprehensive details of your new product below.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-8 mb-10">

          {/* 1. PRODUCT MEDIA */}
          <div className="luxury-card p-6 sm:p-10 border-t-4 border-brand-bronze">
            <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="text-brand-bronze" /> Product Media
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              {images.map((img, index) => (
                <label key={index} className="aspect-square relative flex flex-col items-center justify-center border-2 border-dashed border-brand-bronze/30 bg-brand-cream/20 hover:bg-brand-cream/40 cursor-pointer transition-all rounded-sm">
                  {img ? (
                    <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <FontAwesomeIcon icon={faCloudUploadAlt} className="text-2xl text-brand-bronze/50 mb-2" />
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-brand-muted">{index === 0 ? "Featured Image" : "Gallery " + index}</span>
                    </div>
                  )}
                  <input type="file" onChange={(e) => handleImageChange(index, e.target.files[0])} hidden accept="image/*" />
                </label>
              ))}
            </div>
            {/* Removed imageAltText and videoUrl inputs */}
          </div>

          {/* 2. BASIC PRODUCT DETAILS */}
          <div className="luxury-card p-6 sm:p-10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faBox} className="text-brand-bronze" /> Basic Details
            </h3>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-2">Product Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="luxury-input text-lg" placeholder="e.g. Victorian Mahogany Dining Table" />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-2">Short Description</label>
                  <input type="text" value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="luxury-input" placeholder="Brief summary for product cards..." />
                </div>
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-2">Product Description *</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} className="luxury-input h-32 reszie-none" placeholder="Enter comprehensive product description here..." />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-2">Category *</label>
                  <select required value={category} onChange={e => { setCategory(e.target.value); setSubCategory(""); }} className="luxury-input bg-transparent">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-2">Sub Category</label>
                  <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="luxury-input bg-transparent">
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PRODUCT SPECIFICATIONS */}
          <div className="luxury-card p-6 sm:p-10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faListUl} className="text-brand-bronze" />Specifications
            </h3>
            <div className="space-y-4">
              {dynamicAttributes.map((attr, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-brand-cream/30 p-4 border border-brand-bronze/10">
                  <div className="flex-1 w-full">
                    <input type="text" value={attr.key} onChange={e => {
                      const newArr = [...dynamicAttributes];
                      newArr[index].key = e.target.value;
                      setDynamicAttributes(newArr);
                    }} className="luxury-input text-sm" placeholder="Feature (e.g. Material)" />
                  </div>
                  <div className="flex-1 w-full">
                    <input type="text" value={attr.value} onChange={e => {
                      const newArr = [...dynamicAttributes];
                      newArr[index].value = e.target.value;
                      setDynamicAttributes(newArr);
                    }} className="luxury-input !text-sm" placeholder="Value (e.g. Solid Wood)" />
                  </div>
                  <button type="button" onClick={() => setDynamicAttributes(dynamicAttributes.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-500 p-2">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setDynamicAttributes([...dynamicAttributes, { key: "", value: "" }])} className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze hover:text-brand-ink">
                + Add Specification
              </button>
            </div>
          </div>

          {/* 4. VARIANTS */}
          <div className="luxury-card p-6 sm:p-10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faBoxes} className="text-brand-bronze" /> Product Variants
            </h3>
            <div className="space-y-6">
              {variants.map((variant, vIndex) => (
                <div key={vIndex} className="bg-white border border-brand-bronze/20 p-4 rounded-sm shadow-sm relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                    <div className="luxury-input-group col-span-1 ">
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-1">Variant Name</label>
                      <input type="text" value={variant.name} onChange={e => {
                        const newVar = [...variants]; newVar[vIndex].name = e.target.value; setVariants(newVar);
                      }} className="luxury-input !text-sm" placeholder="e.g. Black / Large" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 col-span-2">
                      <div className="luxury-input-group">
                        <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-1">Price (Rs)</label>
                        <input type="number" value={variant.price} onChange={e => {
                          const newVar = [...variants]; newVar[vIndex].price = e.target.value; setVariants(newVar);
                        }} className="luxury-input !text-sm" placeholder="Price" />
                      </div>
                      <div className="luxury-input-group">
                        <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-1">Stock</label>
                        <input type="number" value={variant.stock} onChange={e => {
                          const newVar = [...variants]; newVar[vIndex].stock = e.target.value; setVariants(newVar);
                        }} className="luxury-input !text-sm" placeholder="Qty" />
                      </div>
                      <div className="luxury-input-group">
                        <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-1">Discount Price (Sale)</label>
                        <input type="number" value={variant.discountPrice} onChange={e => {
                          const newVar = [...variants]; newVar[vIndex].discountPrice = e.target.value; setVariants(newVar);
                        }} className="luxury-input !text-sm text-red-500 font-bold" placeholder="0" />
                      </div>
                      <div className="luxury-input-group">
                        <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-1">SKU</label>
                        <input type="text" value={variant.sku} onChange={e => {
                          const newVar = [...variants]; newVar[vIndex].sku = e.target.value; setVariants(newVar);
                        }} className="luxury-input !text-sm" placeholder="SKU" />
                      </div>
                    </div>
                  </div>

                  <div className="luxury-input-group mb-4">
                    <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-1">Variant Description / Details</label>
                    <textarea value={variant.description} onChange={e => {
                      const newVar = [...variants]; newVar[vIndex].description = e.target.value; setVariants(newVar);
                    }} className="luxury-input !text-sm min-h-[80px]" placeholder="Specific details for this variant..." />
                  </div>

                  <div className="luxury-input-group">
                    <label className="block text-[8px] font-bold uppercase tracking-widest text-brand-muted mb-2">Variant Images</label>
                    <div className="flex flex-wrap gap-3">
                      {variant.images?.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-16 h-16 border rounded-sm overflow-hidden group">
                          <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt="variant" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => {
                            const newVar = [...variants];
                            newVar[vIndex].images = newVar[vIndex].images.filter((_, i) => i !== imgIndex);
                            setVariants(newVar);
                          }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FontAwesomeIcon icon={faTrashAlt} className="text-white text-xs" />
                          </button>
                        </div>
                      ))}
                      <label className="w-16 h-16 flex flex-col items-center justify-center border border-dashed border-brand-bronze/30 bg-brand-cream/20 hover:bg-brand-cream/40 cursor-pointer transition-all rounded-sm overflow-hidden text-brand-bronze/50">
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="text-sm" />
                        <span className="text-[8px] mt-1">Add</span>
                        <input type="file" multiple onChange={(e) => {
                          const files = Array.from(e.target.files);
                          const newVar = [...variants];
                          newVar[vIndex].images = [...(newVar[vIndex].images || []), ...files];
                          setVariants(newVar);
                        }} hidden accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== vIndex))} className="absolute top-2 right-2 text-brand-muted hover:text-red-400 p-2 transition-colors">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setVariants([...variants, { name: "", price: "", discountPrice: "", stock: "", sku: "", images: [], description: "" }])} className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-bronze hover:text-brand-ink">
                + Add Variant
              </button>
            </div>
          </div>

          {/* 5. INVENTORY & 7. SHIPPING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="luxury-card p-6 sm:p-10">
              <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faReceipt} className="text-brand-bronze" /> Inventory
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-brand-bronze/10 pb-4">
                  <label className="flex items-center cursor-pointer group w-fit">
                    <input type="checkbox" className="sr-only" checked={trackInventory} onChange={() => setTrackInventory((prev) => !prev)} />
                    <div className={`w-12 h-6 rounded-full transition-all duration-500 border border-brand-bronze/20 flex items-center px-1 ${trackInventory ? "bg-brand-ink" : "bg-brand-cream"}`}>
                      <div className={`w-4 h-4 rounded-full transition-all duration-500 transform ${trackInventory ? "translate-x-6 bg-brand-bronze" : "translate-x-0 bg-brand-bronze/30"}`}></div>
                    </div>
                    <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Track Inventory</span>
                  </label>
                </div>
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Total Quantity Available *</label>
                  <input required type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="luxury-input" placeholder="0" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="luxury-input-group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Stock Status</label>
                    <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="luxury-input bg-transparent">
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="pre_order">Pre-Order</option>
                    </select>
                  </div>
                  <div className="luxury-input-group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Low Stock Alert</label>
                    <input type="number" value={lowStockAlert} onChange={e => setLowStockAlert(e.target.value)} className="luxury-input" placeholder="Threshold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="luxury-card p-6 sm:p-10">
              <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faTruck} className="text-brand-bronze" /> Shipping
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-brand-bronze/10 pb-4">
                  <label className="flex items-center cursor-pointer group w-fit">
                    <input type="checkbox" className="sr-only" checked={freeShipping} onChange={() => setFreeShipping((prev) => !prev)} />
                    <div className={`w-12 h-6 rounded-full transition-all duration-500 border border-brand-bronze/20 flex items-center px-1 ${freeShipping ? "bg-brand-ink" : "bg-brand-cream"}`}>
                      <div className={`w-4 h-4 rounded-full transition-all duration-500 transform ${freeShipping ? "translate-x-6 bg-brand-bronze" : "translate-x-0 bg-brand-bronze/30"}`}></div>
                    </div>
                    <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Free Shipping</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="luxury-input-group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Weight (kg)</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faWeightHanging} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                      <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="luxury-input pl-10" placeholder="0.0" />
                    </div>
                  </div>
                  <div className="luxury-input-group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Shipping Class</label>
                    <select value={shippingClass} onChange={e => setShippingClass(e.target.value)} className="luxury-input bg-transparent">
                      <option value="normal">Normal</option>
                      <option value="heavy">Heavy (Furniture)</option>
                    </select>
                  </div>
                </div>
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Delivery Time</label>
                  <input type="text" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} className="luxury-input" placeholder="e.g. 3-7 Days" />
                </div>
              </div>
            </div>
          </div>

          {/* 6. PRICING */}
          <div className="luxury-card p-6 sm:p-10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faDollarSign} className="text-brand-bronze" /> Pricing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Cost Price *</label>
                <input required type="number" value={cost} onChange={e => setCost(e.target.value)} className="luxury-input" />
              </div>
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Selling Price *</label>
                <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="luxury-input" />
              </div>
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Discounted Price</label>
                <input type="number" value={discountprice} onChange={e => setDiscountprice(e.target.value)} className="luxury-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Discount Start Date</label>
                <input type="date" value={discountStartDate} onChange={e => setDiscountStartDate(e.target.value)} className="luxury-input bg-white !py-3" />
              </div>
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Discount End Date</label>
                <input type="date" value={discountEndDate} onChange={e => setDiscountEndDate(e.target.value)} className="luxury-input bg-white !py-3" />
              </div>
              <div className="flex items-center h-full pt-6">
                <label className="flex items-center cursor-pointer group w-fit">
                  <input type="checkbox" className="sr-only" checked={taxIncluded} onChange={() => setTaxIncluded((prev) => !prev)} />
                  <div className={`w-12 h-6 rounded-full transition-all duration-500 border border-brand-bronze/20 flex items-center px-1 ${taxIncluded ? "bg-brand-ink" : "bg-brand-cream"}`}>
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 transform ${taxIncluded ? "translate-x-6 bg-brand-bronze" : "translate-x-0 bg-brand-bronze/30"}`}></div>
                  </div>
                  <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Tax Included (VAT)</span>
                </label>
              </div>
            </div>
          </div>


          {/* 9. STATUS & 10. EXTRA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="luxury-card p-6 sm:p-10 flex flex-col space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink flex items-center gap-3">
                <FontAwesomeIcon icon={faEye} className="text-brand-bronze" /> Visibility & Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="luxury-input bg-transparent">
                    <option value="draft">Draft</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div className="luxury-input-group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Visibility</label>
                  <select value={visibility} onChange={e => setVisibility(e.target.value)} className="luxury-input bg-transparent">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-brand-bronze/10 space-y-4 flexflex-col gap-4">
                <label className="flex items-center cursor-pointer group w-fit mt-4">
                  <input type="checkbox" className="sr-only" checked={bestseller} onChange={() => setBestseller((prev) => !prev)} />
                  <div className={`w-10 h-5 rounded-full transition-all duration-500 border border-brand-bronze/20 flex items-center px-1 ${bestseller ? "bg-brand-ink" : "bg-brand-cream"}`}>
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 transform ${bestseller ? "translate-x-5 bg-brand-bronze" : "translate-x-0 bg-brand-bronze/30"}`}></div>
                  </div>
                  <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2"><FontAwesomeIcon icon={faStar} className="text-brand-bronze" /> Mark as Bestseller</span>
                </label>
                <label className="flex items-center cursor-pointer group w-fit mt-4">
                  <input type="checkbox" className="sr-only" checked={featuredProduct} onChange={() => setFeaturedProduct((prev) => !prev)} />
                  <div className={`w-10 h-5 rounded-full transition-all duration-500 border border-brand-bronze/20 flex items-center px-1 ${featuredProduct ? "bg-brand-ink" : "bg-brand-cream"}`}>
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 transform ${featuredProduct ? "translate-x-5 bg-brand-bronze" : "translate-x-0 bg-brand-bronze/30"}`}></div>
                  </div>
                  <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2"><FontAwesomeIcon icon={faChartLine} className="text-brand-bronze" /> Featured Product</span>
                </label>
              </div>
            </div>

            <div className="luxury-card p-6 sm:p-10 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-widest text-brand-ink flex items-center gap-3">
                <FontAwesomeIcon icon={faPlusCircle} className="text-brand-bronze" /> Policies & Care
              </h3>
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Warranty Details</label>
                <input type="text" value={warrantyDetails} onChange={e => setWarrantyDetails(e.target.value)} className="luxury-input" placeholder="e.g. 10 Years Warranty on Frame" />
              </div>
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Return Policy</label>
                <input type="text" value={returnPolicy} onChange={e => setReturnPolicy(e.target.value)} className="luxury-input" placeholder="e.g. 30 Days Free Return" />
              </div>
              <div className="luxury-input-group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Care Instructions</label>
                <input type="text" value={careInstructions} onChange={e => setCareInstructions(e.target.value)} className="luxury-input" placeholder="e.g. Wipe with dry cloth" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-10">
            <button
              type="submit"
              disabled={loading || !token}
              className={`px-16 py-5 font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm flex items-center justify-center transition-all duration-500 ${loading || !token
                ? "bg-brand-muted/20 cursor-not-allowed text-brand-muted"
                : "bg-brand-ink text-brand-cream hover:bg-brand-bronze hover:text-white shadow-xl"
                }`}
            >
              {loading ? <><FontAwesomeIcon icon={faSpinner} spin className="mr-3" /> Publishing...</> : <><FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-lg" /> Publish Product</>}
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default Add;