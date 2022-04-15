const { Router } = require('express');
const { rutasProtegidas } = require('../middlewares/autentication');
const { getUsuario } = require('../middlewares/getuser');
const router = Router();
router.use(require('./signup'));
router.use(require('./login'));
router.use([rutasProtegidas]) //Las siguientes rutas solo funcionan si el usuario: 1) Ya inicio sesion
router.use(require('./users')); //  3) Su Campo Status es True
router.use(require('./categories')); //  3) Su Campo Status es True

router.use(require('./productos')); //  3) Su Campo Status es True
router.use(require('./ventas')); //  3) Su Campo Status es True
router.use(require('./cuentas')); //  3) Su Campo Status es True
router.use(require('./cortes')); //  3) Su Campo Status es True



/*

router.use(require('./imagen'))

//Rutas Protegidas
router.use(require('./start')); //  2) Tiene un Token valido
router.use(require('./area'));
router.use(require('./activities'));
router.use(require('./centrals'));
router.use(require('./CM'));
router.use(require('./hallazgos'));
router.use(require('./rutas'))
*/
module.exports = router;