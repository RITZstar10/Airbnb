import express from "express";
import cors from "cors";
import jwt  from "jsonwebtoken";
import { UserModel } from './models/user.model.js';
import { Place } from './models/Place.js'
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import imageDownloader from 'image-downloader';
import multer from "multer";
import fs from "fs";
const app = express();

dotenv.config({
    path: './.env'
});

app.use(express.json());
app.use(cookieParser());
app.use('uploads', express.static(__dirname+'/uploads'));

const port = 4000;

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));


mongoose.connect(process.env.MONGO_URL);

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

   try {
     const user = await UserModel.create({
         name,
         email,
         password
     })
     res.json(user);
   } catch (error) {
    res.status(422)
    .json(error)   
   }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email){
        res.json('Email field is required!')
    }

    const user = await UserModel.findOne({email});

    if(!user){
        res.json('User not found!');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        res
        .status(422)
        .json('Password is incorrect!');
    }

    jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET, {}, (err, token) => {
        if(err) {
            throw err;
        }
        res.cookie('token', token).json(user);
    });


});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if(err) throw err;
            const user = await UserModel.findById(userData).select("-password")
            res.json(user);
        })
    } else {
        res.json(null);
    }
});

app.post('/logout', (Req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
})

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadFiles = [];
    for(let i=0; i<req.files.length; i++){
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadFiles);
});

app.post('/places', (req, res) => {
    const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests} = req.body;
    const {token} = req.cookies;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if(err) throw err;
            const placeDoc = await Place.create({
                owner: userData.id,
                title, address, photos:addedPhotos, 
                description, perks, extraInfo, 
                checkIn, checkOut, maxGuests
            });
            res.json(placeDoc)
        });
});

app.get('/places', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Place.find({owner: id}));
    });
});

app.get('/test', (req, res) => {
    res.json('Test Ok!')
});

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
});