const express = require("express");
const router = express.Router();
const helper = require("../auth/helpers");
const validation = require("./validation");

const wikiController = require("../controllers/wikiController")


router.get("/wikis/", wikiController.index);
router.get("/wikis/private", wikiController.private);

router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", helper.ensureAuthenticated,validation.validateWikis,wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", validation.validateWikis, wikiController.update);





module.exports = router;



