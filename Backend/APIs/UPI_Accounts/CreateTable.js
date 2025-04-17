const CreateUpiTable = async (upiDatabase) => {
    const queary = `CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    RegisteredName TEXT NOT NULL,
    Age INTEGER CHECK(Age >= 18),
    City TEXT,
    Address TEXT,
    PhoneNumber TEXT UNIQUE NOT NULL,
    BankAccountNumber TEXT UNIQUE NOT NULL,
    UpiPIN TEXT NOT NULL,
    BankName TEXT NOT NULL,
    BankIFSC TEXT NOT NULL,
    BankBranchLocation TEXT,
    AadhaarNumber TEXT UNIQUE NOT NULL,
    PAN TEXT UNIQUE NOT NULL,
    UpiCredentialNumber TEXT UNIQUE NOT NULL,
    BankID TEXT UNIQUE NOT NULL,
    AccountBalance DECIMAL(15,2)
);
`
await upiDatabase.run(queary,(err)=>{
    if(err){
        throw new Error(`Error While Creating UPI Accounts Table in(./APIs/CreateTable.js), : \n    ${err}`)
    }
    else{
        console.log("UPI Accounts Table Created Successfully")
    }
})
}

module.exports = {
    CreateUpiTable
}