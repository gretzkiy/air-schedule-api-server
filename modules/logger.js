const logger = ({ event, msg }) => {
    try {
        console.log(`${event}: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    } catch (error) {
        console.log('Error.');
    }
};

module.exports = logger;
