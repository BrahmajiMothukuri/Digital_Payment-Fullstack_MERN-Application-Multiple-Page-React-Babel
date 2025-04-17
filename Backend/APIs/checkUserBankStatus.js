const checkUserBankStatus = async (phoneNum,usersDB,res)=>{
    return new Promise((resolve, reject) => {
        const Query = `SELECT * FROM Users WHERE PhoneNumber = "${phoneNum}"`;
        usersDB.all(Query, (err, rows) => {
            if (err) {
                reject(`Error While Checking Bank Account: ${err}`);
            } else {
                resolve(rows); // This ensures the function returns the result properly
            }
        });
    });
}
module.exports={
    checkUserBankStatus,
}