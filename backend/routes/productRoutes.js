// ━━━ PRODUCT / MARKETPLACE ROUTES ━━━
const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');
const { validateRequired } = require('../middleware/validate');

router.post('/', authenticate, uploadProductImages, validateRequired('name', 'price', 'category'), ctrl.createProduct);
router.get('/', ctrl.getAllProducts);
router.get('/my', authenticate, ctrl.getMyProducts);
router.get('/:id', ctrl.getProductById);
router.put('/:id', authenticate, ctrl.updateProduct);
router.delete('/:id', authenticate, ctrl.deleteProduct);

module.exports = router;
