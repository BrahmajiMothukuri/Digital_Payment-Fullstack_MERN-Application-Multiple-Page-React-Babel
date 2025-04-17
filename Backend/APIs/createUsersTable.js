const createBankAccountTable = async (usersDatabase)=>{
    const createUserTableQueary = `CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL
    RegisteredName TEXT NOT NULL,
    Age INTEGER CHECK(Age >= 18),
    City TEXT,
    Address TEXT,
    PhoneNumber TEXT UNIQUE NOT NULL,
    BankAccountNumber TEXT UNIQUE NOT NULL,
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
await usersDatabase.run(createUserTableQueary,(err)=>{
    if(err){
        throw new Error(`Error in Creating Bank users Table at (/APIs/createUsersTable.js) : \n err: ${err}`)
    }
    else{
        console.log("Bank Accounts Table Created Successfully")
    }
})
}
module.exports = {
    createBankAccountTable
}