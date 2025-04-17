const checkAuth = (status) =>async (req, res, next) => {
    const isAuthenticated = status["isLoggedIn"] // Example condition
    if (!isAuthenticated) {
        console.log("Auth Failed")
        return res.status(403).send("Access Denied");
    }
   console.log("Auth Function Checked")
    next();
};

module.exports={
    checkAuth
}

