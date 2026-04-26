import express from 'express';
import {
  getAllCategories,
  createCategory,
  addSubcategory,
  updateCategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory,
  getCategoriesDebug
} from '../controllers/categoryController.js';

import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/list', getAllCategories);
router.post('/', upload.single('image'), createCategory);
router.post('/:categoryId/subcategories', addSubcategory);
router.put('/:id', upload.single('image'), updateCategory);
router.put('/:categoryId/subcategories/:subcategoryId', updateSubcategory);
router.delete('/:id', deleteCategory);
router.delete('/:categoryId/subcategories/:subcategoryId', deleteSubcategory);
router.get('/debug', getCategoriesDebug);
export default router;