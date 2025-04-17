const check_UPI_Account = async (phoneNum, db) => {
    console.log(phoneNum)
    return new Promise((resolve, reject) => {
        const Query = `SELECT * FROM Users WHERE PhoneNumber = ?`;
        db.get(Query, [phoneNum], (err, row) => {  // Using `get()` for a single record
            if (err) {
                reject(`Error While Checking Bank Account: ${err}`);
            } else {
                resolve(row ? [row] : []); // Return as an array for consistency
            }
        });
    });
};
module.exports={
    check_UPI_Account,
}