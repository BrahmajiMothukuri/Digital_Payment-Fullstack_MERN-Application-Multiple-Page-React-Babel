const createTransactionsTable = async (transactionsDB) => {
    const Queary = `
CREATE TABLE Transactions (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    FromUserMobile TEXT NOT NULL,
    FromUserRegisteredName TEXT NOT NULL,
    ToPersonMobile TEXT NOT NULL,
    ToPersonRegisteredName TEXT NOT NULL,
    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    TransactionId TEXT UNIQUE NOT NULL,
    FromBankName TEXT NOT NULL,
    FromBankId TEXT NOT NULL,
    ToBankName TEXT NOT NULL,
    ToBankId TEXT NOT NULL,
    Amount REAL NOT NULL,
    PaymentStatus TEXT CHECK(PaymentStatus IN ('completed', 'failed', 'pending')) NOT NULL
);
`
await transactionsDB.run(Queary,(err)=>{
    if(err){
        throw new Error(`Error While Creating Transactions Table in(./APIs/UPI_Accounts), : \n    ${err}`)
    }
    else{
        console.log("Transactions Table Created Successfully")
    }
})
}
module.exports={
    createTransactionsTable
}