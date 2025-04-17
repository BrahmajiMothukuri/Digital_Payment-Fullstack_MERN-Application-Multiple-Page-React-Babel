const UserTransactionsTable = async (transactionsDB) => {
    const Queary = `
CREATE TABLE TransactionHistory (
    TransactionID TEXT PRIMARY KEY,
    SenderName TEXT,
    ReceiverName TEXT,
    AmountSent REAL,
    DateTime TEXT,
    SenderBankID TEXT,
    SenderBankName TEXT,
    ReceiverBankID TEXT,
    ReceiverBankName TEXT
);
`
await transactionsDB.run(Queary,(err)=>{
    if(err){
        throw new Error(`Error While Creating User Transactions Table in(./APIs/UPI_Accounts), : \n    ${err}`)
    }
    else{
        console.log("User Transactions Table Created Successfully")
    }
})
}
module.exports={
    UserTransactionsTable
}