const router = require('express').Router()
const { movieController } = require('../controllers')

router.get('/showAll', movieController.showAll)
router.get('/showSpecific', movieController.showSpecific)
router.post('/add', movieController.add)
router.patch('/edit/:id', movieController.edit)
router.patch('/set/:id', movieController.set)

module.exports = router