const insertUserTransaction = async (transactionsDB, transaction) => {
    const query = `
    INSERT INTO TransactionHistory (
        TransactionID, SenderName, ReceiverName, AmountSent, DateTime, 
        SenderBankID, SenderBankName, ReceiverBankID, ReceiverBankName
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    try {
        await transactionsDB.run(query, [
            transaction.TransactionID,
            transaction.SenderName || null,
            transaction.ReceiverName || null,
            transaction.AmountSent,
            transaction.DateTime || new Date().toISOString(),
            transaction.SenderBankID,
            transaction.SenderBankName,
            transaction.ReceiverBankID,
            transaction.ReceiverBankName
        ]);
        console.log("Transaction inserted into TransactionHistory table successfully.");
    } catch (err) {
        throw new Error(`Error inserting transaction into TransactionHistory Table: \n    ${err}`);
    }
};

module.exports = {
    insertUserTransaction
};
