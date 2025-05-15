const router = require('express').Router();
const PetController = require('../controllers/PetController');

// Middlewares
const verifyToken = require('../helpers/verify-token');

router.post('/create', verifyToken, PetController.create);
router.get('/', PetController.getAll);
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/:id', PetController.getPetById);
router.delete('/:id', PetController.removePetById);
router.patch('/:id', verifyToken, PetController.updatePet);

module.exports = router;