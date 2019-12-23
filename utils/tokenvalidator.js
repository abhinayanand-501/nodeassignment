const jwt = require('jsonwebtoken'); // Used to access the verify method

module.exports = {
    tokenValidator : (req, res, next) => {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token,'jwtsecretkey',{expiresIn:86400},function(err){
                if(err) { res.status(500).send({status:500, error: 'Failed to authenticate token'})}
                else {
                    next();
                }
            });
        } else {
            res.status(401).send({statue:401,error: 'Authorization error, token required'});
        }
    }
}