const asyncHandler=require('express-async-handler');
const Contact=require('../models/contactModel');

const getContacts=asyncHandler(async(req,res)=>{
    const contacts=await Contact.find({user_id:req.user.id});
    // console.log(contacts);//for json res.json({message: ""});
    // console.log(contacts);
    // console.log(req.user.username);
    const username=req.user.username;
    res.status(200).json({contacts,username});
});

const createNewContact=asyncHandler(async(req,res)=>{ 
    console.log("Request Body is ",req.body);
    const{name,email,phone}=req.body;
    if(name && email && phone){

        const contact=await Contact.create({
            name,
            email,
            phone,
            user_id:req.user.id
        });
        res.status(201).json(contact);//for json res.json({message: ""});
        
    }
    else{
        res.status(400);
        throw new Error('All fields are mandotory!!!');
    }

});

const getContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error('Contact not found');
    }
    res.status(200).json(contact);//for json res.json({message: ""});
});

const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error('Contact not found');
    }
    if(contact.user_id.toString()!=req.user.id){
        res.status(403);
        throw new Error("User dont have access to do it");
    }
    const updatedcontact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    res.status(200).json(updatedcontact);//for json res.json({message: ""});
});

const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error('Contact not found');
    }
    if(contact.user_id.toString()!=req.user.id){
        res.status(403);
        throw new Error("User dont have access to do it");
    }
    await Contact.deleteOne({ _id: req.params.id });
    
    res.status(200).send('Contact Deleted');//for json res.json({message: ""});
});
module.exports={getContacts,getContact,createNewContact,updateContact,deleteContact};