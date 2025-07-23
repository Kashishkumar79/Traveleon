class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // ✅ parent class ko message pass karo
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
