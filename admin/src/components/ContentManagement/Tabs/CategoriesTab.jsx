import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFolderTree,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faPlus,
  faTag,
  faTags,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';


const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;



// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md w-full mx-2">
        <div className="flex items-center p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-shrink-0">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-500 text-lg sm:text-xl mr-3"
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Confirm Deletion
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-gray-700 mb-1 text-sm sm:text-base">
            Are you sure you want to delete this {itemType}?
          </p>
          {itemName && (
            <p className="text-gray-900 font-medium text-sm sm:text-base">
              "{itemName}"
            </p>
          )}
          <p className="text-red-600 text-xs sm:text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2 text-xs sm:text-sm" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', parentId: '', description: '', imageFile: null, imagePreview: null });
  const toast = useToast();
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    itemType: '',
    itemName: '',
    onConfirm: null
  });

  // Fetch data from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message, type = 'error') => {
    if (type === 'success') toast.success(message);
    else if (type === 'delete') toast.delete(message);
    else toast.error(message);
  };

  const showConfirmation = (itemType, itemName, onConfirm) => {
    setConfirmationModal({
      isOpen: true,
      itemType,
      itemName,
      onConfirm: () => {
        setConfirmationModal({ isOpen: false, itemType: '', itemName: '', onConfirm: null });
        onConfirm();
      }
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal({ isOpen: false, itemType: '', itemName: '', onConfirm: null });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      showToast('Error fetching categories');
      console.error('Error fetching categories:', error);
    }
  };



  const resetForm = () => {
    if (newCategory.imagePreview) URL.revokeObjectURL(newCategory.imagePreview);
    setNewCategory({ name: '', parentId: '', description: '', imageFile: null, imagePreview: null });
    setEditingItem(null);
  };

  const handleImageChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (isEditing) {
        setEditingItem(prev => ({ ...prev, imageFile: file, imagePreview: preview }));
      } else {
        setNewCategory(prev => ({ ...prev, imageFile: file, imagePreview: preview }));
      }
    }
  };

  // Category Functions
  const addCategory = async () => {
    if (newCategory.name.trim() === '') {
      showToast('Please enter a name');
      return;
    }

    setLoading(true);

    try {
      if (newCategory.parentId) {
        // Add as subcategory
        const response = await fetch(`${API_BASE_URL}/categories/${newCategory.parentId}/subcategories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.name })
        });

        if (response.ok) {
          await fetchCategories();
          resetForm();
          showToast('Subcategory created successfully!', 'success');
        } else {
          const errorData = await response.json();
          showToast(errorData.error || 'Failed to create subcategory');
        }
      } else {
        // Add as main category
        const formData = new FormData();
        formData.append('name', newCategory.name);
        if (newCategory.description) formData.append('description', newCategory.description);
        if (newCategory.imageFile) formData.append('image', newCategory.imageFile);

        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const newCat = await response.json();
          setCategories(prev => [...prev, newCat]);
          resetForm();
          showToast('Category created successfully!', 'success');
        } else {
          const errorData = await response.json();
          showToast(errorData.error || 'Failed to create category');
        }
      }
    } catch (error) {
      showToast('Network error occurred');
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async () => {
    if (!editingItem || editingItem.name.trim() === '') {
      showToast('Please enter a name');
      return;
    }

    setLoading(true);

    try {
      if (editingItem.type === 'subcategory') {
        const response = await fetch(`${API_BASE_URL}/categories/${editingItem.parentId}/subcategories/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editingItem.name })
        });

        if (response.ok) {
          await fetchCategories();
          setEditingItem(null);
          showToast('Subcategory updated successfully!', 'success');
        } else {
          const errorData = await response.json();
          showToast(errorData.error || 'Failed to update subcategory');
        }
      } else {
        const formData = new FormData();
        formData.append('name', editingItem.name);
        if (editingItem.description) formData.append('description', editingItem.description);
        if (editingItem.imageFile) formData.append('image', editingItem.imageFile);

        const response = await fetch(`${API_BASE_URL}/categories/${editingItem._id}`, {
          method: 'PUT',
          body: formData
        });

        if (response.ok) {
          await fetchCategories();
          resetForm();
          showToast('Category updated successfully!', 'success');
        } else {
          const errorData = await response.json();
          showToast(errorData.error || 'Failed to update category');
        }
      }
    } catch (error) {
      showToast('Network error occurred');
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, type, parentId = null, itemName = '') => {
    showConfirmation(type, itemName, async () => {
      setLoading(true);

      try {
        if (type === 'subcategory' && parentId) {
          const response = await fetch(`${API_BASE_URL}/categories/${parentId}/subcategories/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await fetchCategories();
            showToast('Subcategory deleted successfully!', 'success');
          } else {
            const errorData = await response.json();
            showToast(errorData.error || 'Failed to delete subcategory');
          }
        } else {
          const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setCategories(prev => prev.filter(cat => cat._id !== id));
            showToast('Category deleted successfully!', 'success');
          } else {
            const errorData = await response.json();
            showToast(errorData.error || 'Failed to delete category');
          }
        }
      } catch (error) {
        showToast('Network error occurred');
        console.error('Error deleting item:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  const startEditing = (item, type = 'category', parentId = null) => {
    setEditingItem({
      ...item,
      type,
      parentId
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">


      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmationModal.onConfirm}
        itemType={confirmationModal.itemType}
        itemName={confirmationModal.itemName}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-3 sm:p-4 rounded-lg flex items-center text-sm sm:text-base">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-black mr-3"></div>
            Loading...
          </div>
        </div>
      )}

      {/* Add New Item Section */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">
          {editingItem ? `Edit Category` : 'Add Category'}
        </h3>



        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder={editingItem ? 'Category Name' : 'Category Name'}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base font-medium"
            value={editingItem ? editingItem.name : newCategory.name}
            onChange={(e) => editingItem
              ? setEditingItem({ ...editingItem, name: e.target.value })
              : setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Short Description (optional)"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base font-medium"
            value={editingItem ? (editingItem.description || '') : newCategory.description}
            onChange={(e) => editingItem
              ? setEditingItem({ ...editingItem, description: e.target.value })
              : setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
        </div>

        {/* Image Upload Area */}
        {(!editingItem || editingItem.type === 'category') && (
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white overflow-hidden shrink-0">
                {editingItem?.imagePreview || newCategory.imagePreview || editingItem?.image ? (
                  <img
                    src={editingItem?.imagePreview || newCategory.imagePreview || editingItem?.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-image text-gray-300 text-xl" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  onChange={(e) => handleImageChange(e, !!editingItem)}
                />
              </div>
            </div>
          </div>
        )}

        {!editingItem && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (for subcategories)</label>
            <select
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
              value={newCategory.parentId}
              onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value })}
            >
              <option value="">Select Parent Category (optional)</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {editingItem ? (
            <>
              <button
                className="flex-1 px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
                onClick={updateItem}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2 text-xs sm:text-sm" />
                Update Category
              </button>
              <button
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center text-sm sm:text-base"
                onClick={() => setEditingItem(null)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2 text-xs sm:text-sm" />
                Cancel
              </button>
            </>
          ) : (
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
              onClick={addCategory}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-xs sm:text-sm" />
              Add {newCategory.parentId ? 'Subcategory' : 'Category'}
            </button>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
          <FontAwesomeIcon icon={faFolder} className="mr-2 text-black text-sm sm:text-base" />
          Categories & Subcategories
        </h3>
        {categories.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No categories found. Create your first category above.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <div className="min-w-full">
              {/* Mobile Card View */}
              <div className="sm:hidden space-y-2 p-2">
                {categories.map(category => (
                  <div key={category._id} className="space-y-2">
                    {/* Main Category Card */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded shadow-sm overflow-hidden bg-gray-200 shrink-0">
                            {category.image ? (
                              <img src={category.image} alt={category.name} className="w-full h-full object-cover grayscale" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FontAwesomeIcon icon={faFolder} />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-black hover:text-blue-900 disabled:opacity-50 p-1"
                            onClick={() => {
                              setNewCategory({ ...newCategory, parentId: category._id });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title="Add Subcategory"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                          </button>
                          <button
                            className="text-black hover:text-blue-900 disabled:opacity-50 p-1"
                            onClick={() => startEditing(category, 'category')}
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                            onClick={() => deleteItem(category._id, 'category', null, category.name)}
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                        Main Category
                      </div>
                    </div>

                    {/* Subcategories */}
                    {category.subcategories?.map(subcategory => (
                      <div key={subcategory._id} className="bg-white p-3 rounded-lg border border-gray-200 ml-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faFolderTree} className="mr-2 text-green-500 text-sm" />
                            <span className="font-medium text-gray-900 text-sm">{subcategory.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-black hover:text-blue-900 disabled:opacity-50 p-1"
                              onClick={() => startEditing(subcategory, 'subcategory', category._id)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-xs" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                              onClick={() => deleteItem(subcategory._id, 'subcategory', category._id, subcategory.name)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded inline-block mt-1">
                          Subcategory
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map(category => (
                    <React.Fragment key={category._id}>
                      {/* Main Category Row */}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                            {category.image ? (
                              <img src={category.image} alt={category.name} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300">
                                <FontAwesomeIcon icon={faFolder} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">Main Category</td>
                        <td className="px-4 py-4 text-sm font-medium">
                          <button
                            className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50"
                            onClick={() => {
                              setNewCategory({ ...newCategory, parentId: category._id });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title="Add Subcategory"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                          <button
                            className="text-black hover:text-blue-900 mr-3 disabled:opacity-50"
                            onClick={() => startEditing(category, 'category')}
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            onClick={() => deleteItem(category._id, 'category', null, category.name)}
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>

                      {/* Subcategories */}
                      {category.subcategories?.map(subcategory => (
                        <tr key={subcategory._id}>
                          <td className="px-4 py-4 whitespace-nowrap"></td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 pl-8">
                            <FontAwesomeIcon icon={faFolderTree} className="mr-2 text-green-500" />
                            {subcategory.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">Subcategory</td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <button
                              className="text-black hover:text-blue-900 mr-3 disabled:opacity-50"
                              onClick={() => startEditing(subcategory, 'subcategory', category._id)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              onClick={() => deleteItem(subcategory._id, 'subcategory', category._id, subcategory.name)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;
