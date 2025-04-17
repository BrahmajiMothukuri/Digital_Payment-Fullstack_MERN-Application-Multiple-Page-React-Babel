const creditAmount = (fromUpiNumber, Amount, upiDB, usersDB) => {
    return new Promise((resolve, reject) => {
        const creditQuery = `
            UPDATE Users
            SET AccountBalance = AccountBalance - ${Amount}
            WHERE PhoneNumber = "${fromUpiNumber}";`;

        // Execute the query on upiDB
        upiDB.run(creditQuery, function (err) {
            if (err) {
                return reject(`Technical Err (Money Not Debited from UPI DB): ${err}`);
            }

            // Execute the same query on usersDB
            usersDB.run(creditQuery, function (err) {
                if (err) {
                    return reject(`Technical Err (Money Not Debited from Users DB): ${err}`);
                }

                //console.log("Amount Debited Successfully from both DBs");
                resolve({ success: true, message: "Amount Debited Successfully from both DBs" });
            });
        });
    });
};
module.exports={
    creditAmount
}