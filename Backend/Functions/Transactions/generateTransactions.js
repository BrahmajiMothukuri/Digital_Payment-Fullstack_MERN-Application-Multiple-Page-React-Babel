function generateTransactionId() {
    return 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

module.exports={
    generateTransactionId
}