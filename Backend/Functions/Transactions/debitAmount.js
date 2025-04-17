const debitAmount = (toUpiNumber, Amount, upiDB, usersDB) => {
    return new Promise((resolve, reject) => {
        const debitQuery = `
            UPDATE Users
            SET AccountBalance = AccountBalance + ${Amount}
            WHERE PhoneNumber = "${toUpiNumber}";`;

        // Execute the query on upiDB
        upiDB.run(debitQuery, function (err) {
            if (err) {
                return reject(`Technical Err (Money Not Credited in UPI DB): ${err}`);
            }
            // Execute the same query on usersDB
            usersDB.run(debitQuery, function (err) {
                if (err) {
                    return reject(`Technical Err (Money Not Credited in Users DB): ${err}`);
                }

                //console.log("Amount Credited Successfully to both DBs");
                resolve({ success: true, message: "Amount Credited Successfully to both DBs" });
            });
        });
    });
};
module.exports={
    debitAmount
}