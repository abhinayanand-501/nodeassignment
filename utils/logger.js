const fs = require('fs');
const {createLogger, format} = require('winston');
const { combine, timestamp, prettyPrint } = format;

// Create the log directory if it does not exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
    fs.mkdirSync('logs/info');
    fs.mkdirSync('logs/error');
    }
    
module.exports = {
    infologger :(message) =>{

	let infologger = createLogger({
        format: combine(
            timestamp(),
            prettyPrint()
        ),
        transports: [
        new (require('winston-daily-rotate-file'))({
            filename: 'logs/info/%DATE%-info.log',
            datePattern: 'YYYY-MM-HH',
            level:'info'
        })
        ],
        exitOnError: false
   });

   infologger.info(message);
    },
    errorlogger :(message) => {

        let errorlogger = createLogger({
        format: combine(
            timestamp(),
            prettyPrint()
        ),
        transports: [
        new (require('winston-daily-rotate-file'))({
            filename: 'logs/error/%DATE%-error.log',
            datePattern: 'YYYY-MM-HH',
            level: 'error'
        })
        ],
        exitOnError: false
    });

    errorlogger.error(message);

    }
}