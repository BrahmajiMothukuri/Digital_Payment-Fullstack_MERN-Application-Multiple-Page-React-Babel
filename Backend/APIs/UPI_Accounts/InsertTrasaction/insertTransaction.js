const { usersData } = require("../../UsersData");

const insertTransaction = async (transactionsDB, transaction,STATUS,UserTransactionData,res) => {
    const {insertUserTransaction} = require("../UserDataBase/insertUserTrasaction")
    const query = `
    INSERT INTO Transactions (
        FromUserMobile, FromUserRegisteredName, ToPersonMobile, ToPersonRegisteredName, 
        TransactionId, FromBankName, FromBankId, ToBankName, ToBankId, Amount, PaymentStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    try {
        await transactionsDB.run(query, [
            transaction.FromUserMobile,
            transaction.FromUserRegisteredName,
            transaction.ToPersonMobile,
            transaction.ToPersonRegisteredName,
            transaction.TransactionId,
            transaction.FromBankName,
            transaction.FromBankId,
            transaction.ToBankName,
            transaction.ToBankId,
            transaction.Amount,
            transaction.PaymentStatus
        ]);
        console.log("Transaction inserted successfully.");
        console.log("--->" , UserTransactionData)
        await insertUserTransaction(transactionsDB,UserTransactionData)
        res.send({response:STATUS})
    } catch (err) {
        throw new Error(`Error inserting transaction: \n    ${err}`);
    }
};

module.exports = {
    insertTransaction
};
