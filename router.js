const express = require("express");
const authcontroller = require('./authcontroller');

const studentcontroller  = require('./controller');

const router = express.Router();

router.route('/student-status').get(studentcontroller.getuserbystats);

router.route("/:id").patch(studentcontroller.patchstudent).get(studentcontroller.getstudentbyid).delete(authcontroller.protect,authcontroller.restrict('admin'),studentcontroller.deletestudent);

router.route("/").post(studentcontroller.poststudent).get(authcontroller.protect,studentcontroller.getallstudents);

module.exports = router;