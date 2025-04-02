const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            console.log('Error Name:', error.name);
            console.log('Error Message:', error.message);
            console.log('Error Stack:', error.stack);
            
            res.status(500).json({
                message: error.message,
                name: error.name,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
};

export default TryCatch;