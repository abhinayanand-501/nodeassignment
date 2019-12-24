const express = require('express');
const router = express.Router();
const uuid = require('uuid'); // Used to create a unique id
const jwt = require('jsonwebtoken'); // Used to access sign in method and get a token
const tokenValidator = require('../utils/tokenvalidator').tokenValidator; // Used to validate the token sent in the request
const jsonPatch = require('json-patch'); // Used to apply json patch to the json object and json patch object 
const download = require('image-downloader'); // Used to download the image from the url into the provided destination 
const resizeimage = require('resize-optimize-images'); // Used to resize the downloaded image to the required dimensions ex:50x50.\
const fs = require('fs'); // Used to read the resized file.
const logger = require('../utils/logger');

// Path -/api/login 
// User logs in using this service and a token is generated and sent back as a response.
router.post('/login', function(req, res){
    if((!!req.body.username && req.body.username !== '') || (!!req.body.password && req.body.password !=='')){
        logger.infologger('Request came into the login api with username : '+ req.body.username + ' and password : '+req.body.password);
        let id = uuid.v1();
        let token = jwt.sign({id: id}, 'jwtsecretkey', {expiresIn: 86400});
        logger.infologger('Sign in successful with id : '+id+ ' and token : '+token);
        res.status(200).send({auth: true, token: token});
    } else {
        logger.errorlogger('Either username/password is missing or invalid');
        res.status(404).send({message: 'Please provide valid username/password'});
    }
});

//Path -/api/patch-json
// It is used to patch the jsondata with the data to be patched and the updated json is sent as response.
router.post('/patch-json', tokenValidator, function(req, res){

    if(!!req.body.jsondata && (typeof req.body.jsondata) === "object" && !!req.body.patchdata && (typeof req.body.patchdata) === "object" && Object.keys(req.body.patchdata).length !==0){
        logger.infologger('Request came into the patch json with valid inputs');
        let jsondata = req.body.jsondata;
        let patchdata = req.body.patchdata;
        let resultdata = jsonPatch.apply(jsondata, patchdata);
        logger.infologger('Successfully applied json patch');
        res.status(200).send(resultdata);
    } else {
        logger.errorlogger('Invalid inputs, either of the objects is null or not valid');
        res.status(404).send({status:404, message:"Send valid inputs. Need a json object as 'jsondata' and json patch object as 'patchdata' which is an array of patch operations to be done."});
    }
    
});

//Path - /api/thumbnail
// It is used to download the image, resize the image and send the resized image as a response.
router.post('/thumbnail',tokenValidator, function(req, res){

    if(!!req.body.imageurl && req.body.imageurl !==''){
        logger.infologger('Request came into thumbnail with the imageurl : '+req.body.imageurl);
        let downloaddest = './downloadedfiles';
        download.image({
            url: req.body.imageurl,
            dest: downloaddest
        })
        .then(({filename}) => {
            logger.infologger('Download of the file completed with the file location : '+filename);
            resizeimage({
                images:[filename],
                width:50,
                height:50
            })
            .then(()=> {
                let imagetype = filename.split('.')[1];
                fs.readFile(filename, function(err, data){
                    if(err) {
                        logger.errorlogger('No image found at the path : '+filename);
                        res.writeHead(400, {'Content-type':'text/html'})
                        console.log(err);
                        res.end("No such image");
                    } else {
                        logger.infologger('Resizing of the image is successfully completed');
                        res.writeHead(200,{'Content-type':'image/'+imagetype});
                        res.end(data);
                    }
                });
            })
            .catch((err)=>{
                logger.errorlogger('Error while resizing the image');
                res.status(404).send({status:404, error: err});
            });
        })
        .catch((err) => {
            console.log('Error is : '+ err);
            logger.errorlogger('Error while downloading the image, maynot be a valid url');
            res.status(404).send({status:404, error: 'File not found for downloading'})
        });
    } else {
        logger.errorlogger('Image url is not defined or empty');
        res.status(404).send({message: 'Please provide valid image url'});
    }
});

module.exports = router;