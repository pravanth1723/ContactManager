const express=require('express');
const router=express.Router();

const {getContacts,getContact,createNewContact,updateContact,deleteContact}=require("../controllers/contactController")
const validateToken=require('../middleware/validateTokenHandler');
router.use(validateToken); 
// here all the methods will contact the contactController.js file for further activity

//get all
router.route("/").get(getContacts);
//create
console.log('came');
router.route("/").post(createNewContact);
//get a contact by id
router.route("/:id").get(getContact);
// put funtion for update
router.route("/:id").put(updateContact);
//delete
router.route("/:id").delete(deleteContact);

//we can aslo write in the below format
//router.route("/:id").delete(deleteContact).put(updateContact).get(getContact);

module.exports=router;
