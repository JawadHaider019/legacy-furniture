import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCog,
  faSave,
  faLock,
  faSignOutAlt,
  faGlobe,
  faEye,
  faEyeSlash,
  faBuilding,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faUpload,
  faXmark,
  faStore,
  faPlus,
  faEdit,
  faTrash,
  faExternalLinkAlt,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Setting = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    console.log('Setting component mounted with token:', token ? 'Present' : 'Missing');
  }, [token]);


  // Existing admin settings state
  const [settings, setSettings] = useState({
    email: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
    emailPassword: false,
  });

  const [emailPassword, setEmailPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Business details state
  const [businessDetails, setBusinessDetails] = useState({
    company: {
      name: "Legacy Furniture",
      tagline: "Timeless Craftsmanship, Modern Elegance",
      description: "Exceptional furniture pieces handcrafted with premium materials to create a legacy of comfort and style in your home.",
      foundedYear: 2023
    },
    contact: {
      customerSupport: {
        email: "legacyfurniture18@gmail.com",
        phone: "+447424757756",
        hours: "24/7"
      }
    },
    location: {
      displayAddress: "London, United Kingdom",
      googleMapsLink: ""
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      tiktok: "",
      whatsapp: ""
    },
    multiStore: {
      enabled: false,
      stores: [],
      defaultStore: null
    },
    logos: {
      website: { url: "", public_id: "" },
      admin: { url: "", public_id: "" },
      favicon: { url: "", public_id: "" }
    }
  });

  const [logos, setLogos] = useState({
    website: null,
    admin: null,
    favicon: null
  });
  const [logoPreviews, setLogoPreviews] = useState({
    website: "",
    admin: "",
    favicon: ""
  });
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [error, setError] = useState(null);

  // Store management state
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [newStore, setNewStore] = useState({
    storeName: "",
    storeType: "warehouse",
    location: {
      displayName: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: ""
      },
      coordinates: { lat: 0, lng: 0 },
      googleMapsLink: ""
    },
    contact: {
      phone: "",
      manager: ""
    },
    operatingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "18:00", closed: true }
    },
    status: "active",
    isActive: true
  });

  // ✅ ADDED: Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);

  // ✅ FIXED: Use logout from auth context
  const handleLogout = () => {
    console.log('Logging out...');
    logout();
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // ✅ FIXED: Fetch admin settings from backend
  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        console.log('Fetching admin settings with token:', token ? 'Present' : 'Missing');

        if (!token) {
          console.log('No token available, skipping settings fetch');
          setLoadingSettings(false);
          return;
        }

        const { data } = await axios.get(`${backendUrl}/api/settings`, {
          headers: { token },
        });

        console.log('Admin settings data:', data);

        if (data.success) {
          setSettings({
            email: data?.email || "",
          });
        }
      } catch (error) {
        console.error("Fetch settings failed:", error);

        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || "⚠️ Failed to load settings");
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          handleLogout();
        }
      } finally {
        console.log('Settings loading complete');
        setLoadingSettings(false);
      }
    };

    fetchAdminSettings();
  }, [token]);

  // ✅ FIXED: Fetch business details from backend with better error handling
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        console.log('Fetching business details...');
        const { data } = await axios.get(`${backendUrl}/api/business-details`);

        console.log('Business details response:', data);

        if (data.success && data.data) {
          const completeData = {
            company: data.data.company || {
              name: "Legacy Furniture",
              tagline: "Timeless Craftsmanship, Modern Elegance",
              description: "Exceptional furniture pieces handcrafted with premium materials to create a legacy of comfort and style in your home.",
              foundedYear: 2023
            },
            contact: data.data.contact || {
              customerSupport: {
                email: "legacyfurniture18@gmail.com",
                phone: "+447424757756",
                hours: "24/7"
              }
            },
            location: data.data.location || {
              displayAddress: "London, United Kingdom",
              googleMapsLink: ""
            },
            socialMedia: data.data.socialMedia || {
              facebook: "",
              instagram: "",
              tiktok: "",
              whatsapp: ""
            },
            multiStore: data.data.multiStore || {
              enabled: false,
              stores: [],
              defaultStore: null
            },
            logos: data.data.logos || {
              website: { url: "", public_id: "" },
              admin: { url: "", public_id: "" },
              favicon: { url: "", public_id: "" }
            }
          };

          setBusinessDetails(completeData);

          if (completeData.logos?.website?.url) {
            setLogoPreviews(prev => ({ ...prev, website: completeData.logos.website.url }));
          }
          if (completeData.logos?.admin?.url) {
            setLogoPreviews(prev => ({ ...prev, admin: completeData.logos.admin.url }));
          }
          if (completeData.logos?.favicon?.url) {
            setLogoPreviews(prev => ({ ...prev, favicon: completeData.logos.favicon.url }));
          }
        } else {
          console.warn('Business details fetch returned no data, using defaults');
        }
      } catch (error) {
        console.error("Fetch business details failed:", error);
        if (!error.message?.includes('ETIMEDOUT')) {
          toast.error("⚠️ Failed to load business details");
        }
        setError("Failed to load business details");
      } finally {
        console.log('Business details loading complete');
        setLoadingBusiness(false);
      }
    };

    fetchBusinessDetails();
  }, []);
  // Add this temporary useEffect to debug
  useEffect(() => {
    console.log('🔍 Current contact data structure:', {
      contact: businessDetails.contact,
      customerSupport: businessDetails.contact?.customerSupport,
      type: typeof businessDetails.contact?.customerSupport
    });
  }, [businessDetails.contact]);
  // Add this to debug the contact data changes
  useEffect(() => {
    console.log('🔍 DEBUG contact structure:', {
      fullContact: businessDetails.contact,
      customerSupport: businessDetails.contact?.customerSupport,
      type: typeof businessDetails.contact?.customerSupport,
      hasEmail: !!businessDetails.contact?.customerSupport?.email,
      hasPhone: !!businessDetails.contact?.customerSupport?.phone,
      hasHours: !!businessDetails.contact?.customerSupport?.hours
    });
  }, [businessDetails.contact]);
  // ✅ FIXED: Loading timeout protection
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loadingSettings || loadingBusiness) {
        console.log('Loading timeout - forcing stop');
        setLoadingTimeout(true);
        setLoadingSettings(false);
        setLoadingBusiness(false);
        toast.warning('Loading took too long. Some data may not be loaded.');
      }
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, [loadingSettings, loadingBusiness]);

  // Handle admin settings input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIXED: Handle business details change with proper nested structure
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');

    console.log('🔄 Business change:', { name, value, path });

    if (path.length === 3 && path[0] === 'contact' && path[1] === 'customerSupport') {
      // Handle contact.customerSupport.email, contact.customerSupport.phone, contact.customerSupport.hours
      const field = path[2]; // 'email', 'phone', or 'hours'

      setBusinessDetails(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          customerSupport: {
            ...prev.contact.customerSupport,
            [field]: value
          }
        }
      }));
    } else if (path.length === 2) {
      // Handle company.name, company.tagline, etc.
      const [section, field] = path;

      setBusinessDetails(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else if (path.length === 1) {
      // Handle top-level fields (if any)
      setBusinessDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  // ✅ FIXED: Remove the duplicate handleLogoChange and fix the main one
  const handleLogoChange = (e, logoType) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('No file selected for', logoType);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Please select a valid image file');
      return;
    }

    // Validate file size (e.g., 5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('❌ File size too large. Please select an image under 5MB.');
      return;
    }

    console.log(`📁 Selected ${logoType} logo:`, {
      name: file.name,
      type: file.type,
      size: file.size,
      logoType: logoType
    });

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    // Update logos state with the actual File object
    setLogos(prev => ({
      ...prev,
      [logoType]: file
    }));

    // Update previews
    setLogoPreviews(prev => ({
      ...prev,
      [logoType]: previewUrl
    }));

    // Reset the input to allow selecting the same file again
    e.target.value = '';

    toast.success(`✅ ${logoType.charAt(0).toUpperCase() + logoType.slice(1)} logo selected!`);
  };


  // ✅ FIXED: Remove logo function with better error handling
  const removeLogo = async (logoType) => {
    try {
      console.log(`🗑️ Removing ${logoType} logo...`);

      // Check if there's an existing logo in businessDetails
      const existingLogo = businessDetails.logos[logoType];
      const hasExistingLogo = existingLogo?.url && existingLogo?.public_id;

      // Also check if there's a new logo selected but not saved yet
      const hasUnsavedLogo = logos[logoType] instanceof File;

      // If there's a logo in the backend, call the delete API
      if (hasExistingLogo) {
        console.log(`📡 Calling backend to delete ${logoType} logo:`, existingLogo.public_id);

        const response = await axios.delete(
          `${backendUrl}/api/business-details/logo/${logoType}`,
          {
            headers: {
              'token': token,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          console.log(`✅ ${logoType} logo deleted from backend`);

          // Update business details with the response
          setBusinessDetails(prev => ({
            ...prev,
            logos: response.data.data.logos
          }));
        } else {
          console.warn(`⚠️ Backend deletion failed:`, response.data.message);
          // Continue with local state update even if backend fails
        }
      }

      // Always update local state
      setLogos(prev => ({ ...prev, [logoType]: null }));
      setLogoPreviews(prev => ({ ...prev, [logoType]: "" }));

      // Also update business details locally if backend call wasn't made or if there was only an unsaved logo
      if (!hasExistingLogo || hasUnsavedLogo) {
        setBusinessDetails(prev => ({
          ...prev,
          logos: {
            ...prev.logos,
            [logoType]: { url: "", public_id: "" }
          }
        }));
      }

      toast.success(`✅ ${logoType.charAt(0).toUpperCase() + logoType.slice(1)} logo removed successfully!`);

    } catch (error) {
      console.error(`❌ Remove ${logoType} logo failed:`, error);

      // Even if backend removal fails, remove from UI for better UX
      setLogos(prev => ({ ...prev, [logoType]: null }));
      setLogoPreviews(prev => ({ ...prev, [logoType]: "" }));

      setBusinessDetails(prev => ({
        ...prev,
        logos: {
          ...prev.logos,
          [logoType]: { url: "", public_id: "" }
        }
      }));

      // Show appropriate error message
      let errorMessage = `⚠️ Error removing ${logoType} logo`;

      if (error.response?.status === 401) {
        errorMessage = "❌ Session expired. Please login again.";
        handleLogout();
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `⚠️ ${error.message}`;
      }

      toast.error(errorMessage);
    }
  };
  // ✅ FIXED: Save admin settings
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(
        `${backendUrl}/api/settings`,
        { email: settings.email },
        { headers: { token } }
      );
      toast.success("✅ Settings saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(error.response?.data?.message || "⚠️ Error saving settings");

      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIXED: Save business details to backend
  const handleSaveBusiness = async () => {
    try {
      setSavingBusiness(true);

      const formDataToSend = new FormData();

      // Add company info
      formDataToSend.append('companyName', businessDetails.company.name);
      formDataToSend.append('tagline', businessDetails.company.tagline);
      formDataToSend.append('description', businessDetails.company.description);
      formDataToSend.append('foundedYear', businessDetails.company.foundedYear.toString());

      // ✅ FIX: Create proper customerSupport object structure
      const customerSupportData = {
        email: businessDetails.contact.customerSupport.email || "legacyfurniture18@gmail.com",
        phone: businessDetails.contact.customerSupport.phone || "+447424757756",
        hours: businessDetails.contact.customerSupport.hours || "24/7"
      };

      console.log('📞 Customer support data being sent:', customerSupportData);
      formDataToSend.append('customerSupport', JSON.stringify(customerSupportData));

      // Add location
      formDataToSend.append('location', JSON.stringify(businessDetails.location));

      // Add social media
      formDataToSend.append('socialMedia', JSON.stringify(businessDetails.socialMedia));

      // Debug file information
      console.log('📁 Files to upload:', {
        website: logos.website ? {
          name: logos.website.name,
          type: logos.website.type,
          size: logos.website.size
        } : 'No file',
        admin: logos.admin ? {
          name: logos.admin.name,
          type: logos.admin.type,
          size: logos.admin.size
        } : 'No file',
        favicon: logos.favicon ? {
          name: logos.favicon.name,
          type: logos.favicon.type,
          size: logos.favicon.size
        } : 'No file'
      });

      // Add logos
      if (logos.website instanceof File) {
        formDataToSend.append('websiteLogo', logos.website);
        console.log('✅ Added website logo to form data');
      } else {
        console.log('ℹ️ Website logo not added - not a File instance or no file selected');
      }

      if (logos.admin instanceof File) {
        formDataToSend.append('adminLogo', logos.admin);
        console.log('✅ Added admin logo to form data');
      } else {
        console.log('ℹ️ Admin logo not added - not a File instance or no file selected');
      }

      if (logos.favicon instanceof File) {
        formDataToSend.append('favicon', logos.favicon);
        console.log('✅ Added favicon to form data');
      } else {
        console.log('ℹ️ Favicon not added - not a File instance or no file selected');
      }

      console.log('💾 Saving business details...', {
        companyName: businessDetails.company.name,
        customerSupport: customerSupportData, // Log the actual object
        websiteLogo: logos.website instanceof File,
        adminLogo: logos.admin instanceof File,
        favicon: logos.favicon instanceof File,
        token: token ? 'Present' : 'Missing'
      });

      if (!token) {
        toast.error("❌ Authentication token missing. Please login again.");
        handleLogout();
        return;
      }

      // Log form data contents for debugging
      console.log('📦 FormData entries:');
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: File(${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes)`);
        } else if (pair[0] === 'customerSupport') {
          console.log(`  ${pair[0]}:`, JSON.parse(pair[1])); // Parse and log the object
        } else {
          const value = pair[1];
          const displayValue = typeof value === 'string' && value.length > 100
            ? value.substring(0, 100) + '...'
            : value;
          console.log(`  ${pair[0]}: ${displayValue}`);
        }
      }

      const response = await axios.put(
        `${backendUrl}/api/business-details/company`,
        formDataToSend,
        {
          headers: {
            'token': token,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );

      console.log('✅ Save response:', response.data);

      if (response.data.success) {
        toast.success("✅ Business details saved successfully!");

        // Update business details with response
        setBusinessDetails(response.data.data);

        // Reset logo files but keep previews from the response
        setLogos({ website: null, admin: null, favicon: null });

        // Update previews with new URLs from backend response
        if (response.data.data.logos) {
          setLogoPreviews({
            website: response.data.data.logos.website?.url || "",
            admin: response.data.data.logos.admin?.url || "",
            favicon: response.data.data.logos.favicon?.url || ""
          });
        }

        // Clear any file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = '';
        });

      } else {
        toast.error(response.data.message || "⚠️ Failed to save business details");
      }
    } catch (error) {
      console.error("❌ Save business details failed:", error);

      if (error.response?.status === 401 || error.response?.data?.message?.includes('Not Authorized')) {
        toast.error("❌ Session expired. Please login again.");
        handleLogout();
        return;
      }

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        "⚠️ Error saving business details";
      toast.error(errorMessage);
    } finally {
      setSavingBusiness(false);
    }
  };
  // ✅ FIXED: Add store function with timings
  const handleAddStore = async () => {
    try {
      // Validate required fields
      if (!newStore.storeName.trim()) {
        toast.error("❌ Store name is required");
        return;
      }

      if (!newStore.location.displayName.trim()) {
        toast.error("❌ Display name is required");
        return;
      }

      // Validate address fields
      const address = newStore.location.address;
      if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.zipCode.trim()) {
        toast.error("❌ Please fill in all address fields (street, city, state, zip code)");
        return;
      }

      // Validate phone number
      if (!newStore.contact.phone.trim()) {
        toast.error("❌ Phone number is required");
        return;
      }

      const storeData = {
        storeName: newStore.storeName,
        storeType: newStore.storeType,
        location: {
          displayName: newStore.location.displayName,
          address: {
            street: newStore.location.address.street,
            city: newStore.location.address.city,
            state: newStore.location.address.state,
            zipCode: newStore.location.address.zipCode
          },
          coordinates: newStore.location.coordinates,
          googleMapsLink: newStore.location.googleMapsLink
        },
        contact: {
          phone: newStore.contact.phone,
          manager: newStore.contact.manager
        },
        operatingHours: newStore.operatingHours,
        status: newStore.status,
        isActive: newStore.isActive
      };

      console.log('Adding store:', storeData);

      const response = await axios.post(
        `${backendUrl}/api/business-details/stores`,
        storeData,
        { headers: { 'token': token } }
      );

      if (response.data.success) {
        toast.success("✅ Store added successfully!");
        setBusinessDetails(prev => ({
          ...prev,
          multiStore: {
            ...prev.multiStore,
            stores: response.data.data.stores || []
          }
        }));
        setShowStoreForm(false);
        resetStoreForm();
      } else {
        toast.error(response.data.message || "⚠️ Failed to add store");
      }
    } catch (error) {
      console.error("Add store failed:", error);
      toast.error(error.response?.data?.message || "⚠️ Error adding store");
    }
  };

  // ✅ FIXED: Delete store function with modal confirmation
  const handleDeleteStore = async (storeId) => {
    // Set the store to delete and show confirmation modal
    setStoreToDelete(storeId);
    setShowDeleteModal(true);
  };

  // ✅ ADDED: Confirm delete function
  const confirmDeleteStore = async () => {
    if (!storeToDelete) return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/business-details/stores/${storeToDelete}`,
        { headers: { 'token': token } }
      );

      if (response.data.success) {
        toast.success("✅ Store deleted successfully!");
        setBusinessDetails(prev => ({
          ...prev,
          multiStore: {
            ...prev.multiStore,
            stores: response.data.data.stores || []
          }
        }));
      } else {
        toast.error(response.data.message || "⚠️ Failed to delete store");
      }
    } catch (error) {
      console.error("Delete store failed:", error);
      toast.error(error.response?.data?.message || "⚠️ Error deleting store");
    } finally {
      // Close the modal and reset
      setShowDeleteModal(false);
      setStoreToDelete(null);
    }
  };

  // ✅ ADDED: Cancel delete function
  const cancelDeleteStore = () => {
    setShowDeleteModal(false);
    setStoreToDelete(null);
    toast.info("Store deletion cancelled");
  };

  const handleSetDefaultStore = async (storeId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/business-details/stores/default/${storeId}`,
        {},
        { headers: { 'token': token } }
      );

      if (response.data.success) {
        toast.success("✅ Default store updated!");
        setBusinessDetails(prev => ({
          ...prev,
          multiStore: {
            ...prev.multiStore,
            defaultStore: storeId
          }
        }));
      }
    } catch (error) {
      console.error("Set default store failed:", error);
      toast.error(error.response?.data?.message || "⚠️ Error setting default store");
    }
  };

  // ✅ FIXED: Added missing handleEditStore function
  const handleEditStore = (store) => {
    setEditingStore(store);
    setNewStore({
      ...store,
      // Ensure all nested objects exist
      location: store.location || {
        displayName: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        coordinates: { lat: 0, lng: 0 },
        googleMapsLink: ""
      },
      contact: store.contact || {
        phone: "",
        manager: ""
      },
      operatingHours: store.operatingHours || {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "09:00", close: "18:00", closed: false },
        sunday: { open: "09:00", close: "18:00", closed: true }
      }
    });
    setShowStoreForm(true);
  };

  // ✅ FIXED: Update store function with proper storeId handling
  const handleUpdateStore = async () => {
    console.log('=== UPDATE STORE FUNCTION CALLED ===');
    console.log('1. Editing Store:', editingStore);
    console.log('2. New Store Data:', newStore);
    console.log('3. Token present:', !!token);

    try {
      if (!newStore.storeName.trim()) {
        console.log('❌ Validation failed: Store name required');
        toast.error("❌ Store name is required");
        return;
      }

      // Validate phone number
      if (!newStore.contact.phone.trim()) {
        console.log('❌ Validation failed: Phone number required');
        toast.error("❌ Phone number is required");
        return;
      }

      // ✅ FIX: Include storeId in the storeData
      const storeData = {
        storeId: editingStore.storeId, // ✅ ADD THIS LINE - CRITICAL FIX
        storeName: newStore.storeName,
        storeType: newStore.storeType,
        location: newStore.location,
        contact: newStore.contact,
        operatingHours: newStore.operatingHours,
        status: newStore.status,
        isActive: newStore.isActive
      };

      console.log('4. Store ID being updated:', editingStore?.storeId);
      console.log('5. Store data to send:', storeData);

      if (!editingStore?.storeId) {
        console.log('❌ No store ID found for update');
        toast.error("❌ Cannot update store: No store ID found");
        return;
      }

      if (!token) {
        console.log('❌ No authentication token');
        toast.error("❌ Authentication token missing. Please login again.");
        handleLogout();
        return;
      }

      console.log('6. Making API call to update store...');
      const response = await axios.put(
        `${backendUrl}/api/business-details/stores/${editingStore.storeId}`,
        storeData,
        {
          headers: {
            'token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('7. API Response:', response.data);

      if (response.data.success) {
        console.log('✅ Store update successful');
        toast.success("✅ Store updated successfully!");

        // Update the stores list with the updated store
        setBusinessDetails(prev => {
          const updatedStores = prev.multiStore.stores.map(store =>
            store.storeId === editingStore.storeId
              ? { ...store, ...storeData } // ✅ Use the complete storeData including storeId
              : store
          );

          console.log('8. Updated stores list:', updatedStores);

          return {
            ...prev,
            multiStore: {
              ...prev.multiStore,
              stores: updatedStores
            }
          };
        });

        setShowStoreForm(false);
        setEditingStore(null);
        resetStoreForm();

        console.log('9. Form reset and modal closed');
      } else {
        console.log('❌ API returned success: false');
        toast.error(response.data.message || "⚠️ Failed to update store");
      }
    } catch (error) {
      console.log('❌ Update store failed with error:', error);
      console.log('Error response:', error.response);
      console.log('Error message:', error.message);

      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);

        if (error.response.status === 401 || error.response.status === 403) {
          toast.error("❌ Session expired. Please login again.");
          handleLogout();
          return;
        }

        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          "⚠️ Error updating store";
        toast.error(errorMessage);
      } else if (error.request) {
        console.log('No response received:', error.request);
        toast.error("⚠️ No response from server. Please check your connection.");
      } else {
        console.log('Error setting up request:', error.message);
        toast.error("⚠️ Error updating store: " + error.message);
      }
    }
  };

  // ✅ ADDED: Reset store form function
  const resetStoreForm = () => {
    setNewStore({
      storeName: "",
      storeType: "warehouse",
      location: {
        displayName: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        coordinates: { lat: 0, lng: 0 },
        googleMapsLink: ""
      },
      contact: {
        phone: "",
        manager: ""
      },
      operatingHours: {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "09:00", close: "18:00", closed: false },
        sunday: { open: "09:00", close: "18:00", closed: true }
      },
      status: "active",
      isActive: true
    });
  };

  const handleNewStoreChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');

      if (subChild) {
        // For nested objects like location.address.street
        setNewStore(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        // For one-level nested objects
        setNewStore(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      // For top-level fields
      setNewStore(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ✅ FIXED: Change admin password
  const handleChangePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("❌ Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("❌ New passwords do not match!");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("❌ New password must be at least 6 characters long.");
      return;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/settings/change-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { token } }
      );

      toast.success(data.message || "🔑 Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });

      toast.info("You will be logged out shortly. Please login with your new password.");

      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error("Password change failed:", error);
      const errorMessage = error.response?.data?.message ||
        "Error changing password. Please check your current password.";
      toast.error(errorMessage);
    }
  };

  // ✅ FIXED: Change admin email
  const handleChangeEmail = async () => {
    if (!settings.email) {
      toast.error("❌ Email cannot be empty.");
      return;
    }

    if (!emailPassword) {
      toast.error("❌ Please enter your password to change email.");
      return;
    }

    try {
      setChangingEmail(true);
      const { data } = await axios.put(
        `${backendUrl}/api/settings/change-email`,
        { email: settings.email, password: emailPassword },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message || "📧 Email updated successfully!");
        setEmailPassword("");
        toast.info("Please login again with your new email");
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        toast.error(data.message || "⚠️ Failed to update email");
      }
    } catch (error) {
      console.error("Email change failed:", error);
      const errorMessage = error.response?.data?.message ||
        "Error changing email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setChangingEmail(false);
    }
  };

  // ✅ FIXED: Loading state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 text-lg mb-4">⚠️ Error Loading Settings</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={() => setError(null)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if ((loadingSettings || loadingBusiness) && !loadingTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
        <div className="w-12 h-12 border-2 border-brand-bronze/20 border-t-brand-bronze rounded-full animate-spin mb-6"></div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Initializing Archive</h2>
        <p className="text-[9px] text-brand-muted uppercase tracking-widest mt-2">Harmonizing Business Credentials...</p>
      </div>
    );
  }

  const tabs = [
    {
      id: "general",
      label: "Administrative Access",
      icon: faGlobe,
      description: "Manage core credentials"
    },
    {
      id: "business",
      label: "Brand Portfolio",
      icon: faBuilding,
      description: "Business identity & locations"
    },
    {
      id: "security",
      label: "Security Protocol",
      icon: faLock,
    }
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Curation */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-8 space-y-12">
              <div className="space-y-2">
                <h1 className="text-3xl font-serif text-brand-ink">Sanctum</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-bronze">System Configuration</p>
              </div>

              <nav className="space-y-4">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-6 px-6 py-5 transition-all duration-500 group relative border border-transparent ${isActive
                        ? "bg-brand-ink text-white"
                        : "text-brand-muted hover:border-brand-bronze/20"
                        }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} className={`text-lg transition-colors duration-500 ${isActive ? 'text-brand-bronze' : 'text-brand-bronze/40 group-hover:text-brand-bronze'}`} />
                      <div className="flex-1 text-left">
                        <div className="text-[11px] font-bold uppercase tracking-widest leading-none mb-1">{tab.label}</div>
                        <div className={`text-[9px] uppercase tracking-[0.15em] opacity-40`}>
                          {tab.description}
                        </div>
                      </div>
                      {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-1/2 bg-brand-bronze" />}
                    </button>
                  );
                })}

                <div className="pt-8 mt-8 border-t border-brand-bronze/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-6 px-6 py-5 text-red-400 hover:text-red-600 transition-colors group"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-lg opacity-40 group-hover:opacity-100" />
                    <div className="flex-1 text-left">
                      <div className="text-[11px] font-bold uppercase tracking-widest leading-none mb-1">Deauthorize</div>
                      <div className="text-[9px] uppercase tracking-[0.15em] opacity-40">Terminate Session</div>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Configuration Canvas */}
          <main className="flex-1 luxury-card p-12 bg-white/50 backdrop-blur-sm">
            {currentTab && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-12">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-bronze">{currentTab.label}</h2>
                  <div className="flex-1 h-[1px] bg-brand-bronze/10"></div>
                </div>

                {/* Tab Consciousness */}
                {activeTab === "general" && (
                  <GeneralSettingsContent
                    settings={settings}
                    handleChange={handleChange}
                    emailPassword={emailPassword}
                    setEmailPassword={setEmailPassword}
                    passwordVisibility={passwordVisibility}
                    togglePasswordVisibility={togglePasswordVisibility}
                    changingEmail={changingEmail}
                    handleChangeEmail={handleChangeEmail}
                    saving={saving}
                    handleSave={handleSave}
                  />
                )}

                {activeTab === "business" && (
                  <BusinessDetailsContent
                    businessDetails={businessDetails}
                    handleBusinessChange={handleBusinessChange}
                    handleSocialMediaChange={handleSocialMediaChange}
                    handleLogoChange={handleLogoChange}
                    removeLogo={removeLogo}
                    logoPreviews={logoPreviews}
                    handleSaveBusiness={handleSaveBusiness}
                    savingBusiness={savingBusiness}
                    showStoreForm={showStoreForm}
                    setShowStoreForm={setShowStoreForm}
                    editingStore={editingStore}
                    setEditingStore={setEditingStore}
                    newStore={newStore}
                    setNewStore={setNewStore}
                    handleAddStore={handleAddStore}
                    handleUpdateStore={handleUpdateStore}
                    handleEditStore={handleEditStore}
                    handleDeleteStore={handleDeleteStore}
                    handleSetDefaultStore={handleSetDefaultStore}
                    handleNewStoreChange={handleNewStoreChange}
                    resetStoreForm={resetStoreForm}
                    showDeleteModal={showDeleteModal}
                    confirmDeleteStore={confirmDeleteStore}
                    cancelDeleteStore={cancelDeleteStore}
                  />
                )}

                {activeTab === "security" && (
                  <SecurityContent
                    passwords={passwords}
                    handlePasswordChange={handlePasswordChange}
                    passwordVisibility={passwordVisibility}
                    togglePasswordVisibility={togglePasswordVisibility}
                    handleChangePassword={handleChangePassword}
                    saving={saving}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Persistence Modal - Store Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-brand-ink/40 animate-fadeIn">
          <div className="luxury-card max-w-sm w-full p-10 text-center bg-white space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-brand-ink mb-2">Confirm Asset Declassification</h3>
              <p className="text-[11px] text-brand-muted uppercase tracking-widest leading-relaxed">
                Are you certain you wish to purge this location from the brand archive? This action is irreversible.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDeleteStore}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// General Settings Component
const GeneralSettingsContent = ({
  settings,
  handleChange,
  emailPassword,
  setEmailPassword,
  passwordVisibility,
  togglePasswordVisibility,
  changingEmail,
  handleChangeEmail,
  saving,
  handleSave
}) => {
  return (
    <div className="space-y-12">
      <div className="luxury-card p-10 space-y-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Identity Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Primary Access Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="luxury-input"
              placeholder="admin@legacyfurniture.com"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Authentication Protocol</label>
            <div className="relative">
              <input
                type={passwordVisibility.emailPassword ? "text" : "password"}
                placeholder="Enter password to authorize change"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                className="luxury-input pr-12"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-bronze/40 hover:text-brand-bronze transition-colors"
                onClick={() => togglePasswordVisibility("emailPassword")}
              >
                <FontAwesomeIcon icon={passwordVisibility.emailPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleChangeEmail}
            disabled={changingEmail}
            className="text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 bg-brand-ink text-white hover:bg-brand-bronze transition-all duration-500 disabled:opacity-50"
          >
            {changingEmail ? "Synchronizing..." : "Update Credentials"}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-12 border-t border-brand-bronze/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-4 bg-brand-ink text-white px-10 py-5 group hover:bg-brand-bronze transition-all duration-500 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSave} className="text-brand-bronze group-hover:text-white transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Commit All Archives</span>
        </button>
      </div>
    </div>
  );
};


const BusinessDetailsContent = ({
  businessDetails,
  handleBusinessChange,
  handleSocialMediaChange,
  handleLogoChange,
  removeLogo,
  logoPreviews,
  handleSaveBusiness,
  savingBusiness,
  showStoreForm,
  setShowStoreForm,
  editingStore,
  setEditingStore,
  newStore,
  setNewStore,
  handleAddStore,
  handleUpdateStore,
  handleEditStore,
  handleDeleteStore,
  handleSetDefaultStore,
  handleNewStoreChange,
  resetStoreForm,
  showDeleteModal,
  confirmDeleteStore,
  cancelDeleteStore
}) => {
  const safeBusinessDetails = businessDetails || {
    company: { name: "", tagline: "", description: "" },
    contact: { customerSupport: { email: "", phone: "", hours: "" } },
    location: { displayAddress: "", googleMapsLink: "" },
    socialMedia: { facebook: "", instagram: "", tiktok: "", whatsapp: "" },
    logos: { website: { url: "" }, admin: { url: "" }, favicon: { url: "" } },
    stores: []
  };

  const currentStoreCount = safeBusinessDetails.stores?.length || 0;

  return (
    <div className="space-y-24">
      {/* Brand Aesthetic Identity */}
      <section className="space-y-12">
        <header className="flex items-center gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-bronze">Visual Identity Ledger</h3>
          <div className="flex-1 h-[1px] bg-brand-bronze/10"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { type: 'website', label: 'External Mark', desc: 'Primary brand signature' },
            { type: 'admin', label: 'Internal Mark', desc: 'Sanctum signature' },
            { type: 'favicon', label: 'Digital Icon', desc: 'Browser presence' }
          ].map((logo) => {
            const hasExisting = safeBusinessDetails.logos[logo.type]?.url;
            const hasPreview = logoPreviews[logo.type];
            const showLogo = hasPreview || hasExisting;

            return (
              <div key={logo.type} className="group flex flex-col items-center text-center space-y-6">
                <div className="relative w-32 h-32 luxury-card p-1 flex items-center justify-center overflow-hidden bg-brand-cream/20">
                  {showLogo ? (
                    <div className="relative w-full h-full p-2">
                      <img
                        src={hasPreview ? logoPreviews[logo.type] : safeBusinessDetails.logos[logo.type].url}
                        alt={logo.label}
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeLogo(logo.type)}
                        className="absolute -top-1 -right-1 bg-red-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-xl"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-bronze/10">
                      <FontAwesomeIcon icon={faBuilding} className="text-4xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-ink/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-brand-ink uppercase tracking-widest">{logo.label}</h4>
                  <p className="text-[9px] text-brand-muted uppercase tracking-widest opacity-60">{logo.desc}</p>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleLogoChange(e, logo.type)}
                    accept="image/*"
                    className="hidden"
                    id={`${logo.type}-upload`}
                  />
                  <label
                    htmlFor={`${logo.type}-upload`}
                    className="cursor-pointer border border-brand-bronze/20 px-6 py-2 text-[9px] font-bold uppercase tracking-widest text-brand-ink hover:bg-brand-ink hover:text-white transition-all duration-500 inline-block"
                  >
                    {showLogo ? 'Override Asset' : 'Inject Mark'}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand Narrative & Logistics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <header className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-bronze">Corporate Manifesto</h3>
            <p className="text-[9px] text-brand-muted uppercase tracking-widest">Public-facing brand credentials</p>
          </header>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Legal Entity Name</label>
              <input
                type="text"
                name="company.name"
                value={safeBusinessDetails.company.name}
                onChange={handleBusinessChange}
                className="luxury-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Strategic Tagline</label>
              <input
                type="text"
                name="company.tagline"
                value={safeBusinessDetails.company.tagline}
                onChange={handleBusinessChange}
                className="luxury-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Narrative Archive</label>
              <textarea
                name="company.description"
                value={safeBusinessDetails.company.description}
                onChange={handleBusinessChange}
                rows={4}
                className="luxury-input resize-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <header className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-bronze">Liaison Channels</h3>
            <p className="text-[9px] text-brand-muted uppercase tracking-widest">Client engagement & support vectors</p>
          </header>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Concierge Email</label>
                <input
                  type="email"
                  name="contact.customerSupport.email"
                  value={safeBusinessDetails.contact.customerSupport.email || ""}
                  onChange={handleBusinessChange}
                  className="luxury-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Direct Hotline</label>
                <input
                  type="text"
                  name="contact.customerSupport.phone"
                  value={safeBusinessDetails.contact.customerSupport.phone || ""}
                  onChange={handleBusinessChange}
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Operational Window</label>
              <input
                type="text"
                name="contact.customerSupport.hours"
                value={safeBusinessDetails.contact.customerSupport.hours || ""}
                onChange={handleBusinessChange}
                className="luxury-input"
                placeholder="e.g. 24/7 Care"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Headquarters Address</label>
              <textarea
                name="location.displayAddress"
                value={safeBusinessDetails.location.displayAddress}
                onChange={handleBusinessChange}
                rows={2}
                className="luxury-input resize-none"
                required
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="space-y-12">
        <header className="flex items-center gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-bronze">Network Presence</h3>
          <div className="flex-1 h-[1px] bg-brand-bronze/10"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Facebook", name: "facebook" },
            { label: "Instagram", name: "instagram" },
            { label: "TikTok", name: "tiktok" },
            { label: "WhatsApp", name: "whatsapp" },
          ].map((social) => (
            <div key={social.name} className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-muted opacity-60">{social.label}</label>
              <input
                type="url"
                name={social.name}
                value={safeBusinessDetails.socialMedia?.[social.name] || ""}
                onChange={handleSocialMediaChange}
                className="luxury-input"
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* Location Management */}
      <section className="space-y-12">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-bronze">Asset Management</h3>
            <p className="text-[9px] text-brand-muted uppercase tracking-widest">Registered physical assets ({currentStoreCount})</p>
          </div>
          <button
            onClick={() => {
              setEditingStore(null);
              resetStoreForm();
              setShowStoreForm(true);
            }}
            className="px-8 py-3 bg-brand-ink text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-bronze transition-all duration-500 flex items-center gap-3"
          >
            <FontAwesomeIcon icon={faPlus} className="text-brand-bronze" />
            Induct Location
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {safeBusinessDetails.stores?.length > 0 ? (
            safeBusinessDetails.stores.map((store) => (
              <div key={store._id} className="luxury-card p-10 group hover:border-brand-bronze/40 transition-all duration-700 bg-white/40">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-serif text-brand-ink">{store.storeName}</h4>
                      {store.isDefault && (
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-brand-bronze/10 text-brand-bronze px-2 py-1">Primary Asset</span>
                      )}
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-brand-muted opacity-60 italic">{store.storeType}</p>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditStore(store)} className="text-brand-ink hover:text-brand-bronze transition-colors"><FontAwesomeIcon icon={faEdit} /></button>
                    <button onClick={() => handleDeleteStore(store._id)} className="text-brand-ink hover:text-red-500 transition-colors"><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-bronze mt-1 opacity-60" />
                    <div className="text-[10px] uppercase tracking-widest text-brand-muted leading-relaxed">
                      {store.location.displayName || store.location.address.street}
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-brand-bronze/5">
                  {!store.isDefault && (
                    <button
                      onClick={() => handleSetDefaultStore(store._id)}
                      className="text-[9px] font-bold uppercase tracking-widest text-brand-bronze hover:text-brand-ink transition-colors"
                    >
                      Establish as Primary
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 luxury-card bg-brand-cream/10 border-dashed">
              <FontAwesomeIcon icon={faStore} className="text-4xl text-brand-bronze/20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Archive Clear</p>
            </div>
          )}
        </div>
      </section>

      {/* Global Commitment */}
      <div className="flex justify-end pt-20 border-t border-brand-bronze/10">
        <button
          onClick={handleSaveBusiness}
          disabled={savingBusiness}
          className="flex items-center gap-4 bg-brand-ink text-white px-12 py-6 group hover:bg-brand-bronze transition-all duration-500 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSave} className="text-brand-bronze group-hover:text-white transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Synchronize Global Portfolio</span>
        </button>
      </div>

      {showStoreForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-8 backdrop-blur-xl bg-brand-ink/40 animate-fadeIn">
          <div className="luxury-card max-w-2xl w-full bg-white max-h-[90vh] overflow-y-auto p-12 space-y-12">
            <header className="flex justify-between items-center">
              <h3 className="text-2xl font-serif text-brand-ink">{editingStore ? 'Location Calibration' : 'Location Induction'}</h3>
              <button onClick={() => setShowStoreForm(false)} className="text-brand-ink hover:text-brand-bronze transition-colors">
                <FontAwesomeIcon icon={faXmark} className="text-xl" />
              </button>
            </header>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Designation</label>
                  <input type="text" name="storeName" value={newStore.storeName} onChange={handleNewStoreChange} className="luxury-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Facility Class</label>
                  <select name="storeType" value={newStore.storeType} onChange={handleNewStoreChange} className="luxury-input">
                    <option value="showroom">Showroom</option>
                    <option value="warehouse">Logistics Hub</option>
                    <option value="outlet">Outlet</option>
                  </select>
                </div>
              </div>
              <div className="pt-12 flex justify-end gap-6 border-t border-brand-bronze/10">
                <button onClick={() => setShowStoreForm(false)} className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Cancel</button>
                <button onClick={editingStore ? handleUpdateStore : handleAddStore} className="px-10 py-4 bg-brand-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-bronze transition-all duration-500">
                  {editingStore ? 'Update Archive' : 'Commit Induction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SecurityContent = ({
  passwords,
  handlePasswordChange,
  passwordVisibility,
  togglePasswordVisibility,
  handleChangePassword,
  saving
}) => {
  return (
    <div className="space-y-12">
      <div className="luxury-card p-10 space-y-10">
        <header className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-bronze">Vault Rotation</h3>
          <p className="text-[9px] text-brand-muted uppercase tracking-widest">Update your administrative access encryption</p>
        </header>
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Current Cipher</label>
            <div className="relative">
              <input type={passwordVisibility.oldPassword ? "text" : "password"} name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} className="luxury-input pr-12" placeholder="••••••••••••" />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-bronze/40 hover:text-brand-bronze transition-colors" onClick={() => togglePasswordVisibility("oldPassword")}>
                <FontAwesomeIcon icon={passwordVisibility.oldPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">New Encryption Key</label>
              <div className="relative">
                <input type={passwordVisibility.newPassword ? "text" : "password"} name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="luxury-input pr-12" placeholder="••••••••••••" />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-bronze/40 hover:text-brand-bronze transition-colors" onClick={() => togglePasswordVisibility("newPassword")}>
                  <FontAwesomeIcon icon={passwordVisibility.newPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted opacity-60">Confirm Key</label>
              <div className="relative">
                <input type={passwordVisibility.confirmPassword ? "text" : "password"} name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="luxury-input pr-12" placeholder="••••••••••••" />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-bronze/40 hover:text-brand-bronze transition-colors" onClick={() => togglePasswordVisibility("confirmPassword")}>
                  <FontAwesomeIcon icon={passwordVisibility.confirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <button onClick={handleChangePassword} disabled={saving} className="flex items-center gap-4 bg-brand-ink text-white px-10 py-5 group hover:bg-brand-bronze transition-all duration-500 disabled:opacity-50">
            <FontAwesomeIcon icon={faLock} className="text-brand-bronze group-hover:text-white transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Authorize Rotation</span>
          </button>
        </div>
      </div>
      <div className="luxury-card p-10 bg-brand-cream/30 border-brand-bronze/10">
        <div className="flex gap-6 items-center">
          <div className="w-12 h-12 rounded-full bg-brand-bronze/10 flex items-center justify-center text-brand-bronze shrink-0">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-ink mb-1">Security Notice</h4>
            <p className="text-[10px] text-brand-muted uppercase tracking-[0.1em] leading-relaxed">
              Rotating your administrative cipher will terminate all active sessions. You will be required to re-authenticate following completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;