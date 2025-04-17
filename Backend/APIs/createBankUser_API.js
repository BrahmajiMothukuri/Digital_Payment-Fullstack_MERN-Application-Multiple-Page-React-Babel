const {usersData} = require("./UsersData")
// console.log(usersData)


const getQuery = (personData) => {
    const Values = Object.values(personData)
    const createUserQueary = `INSERT INTO Users (
        FirstName, 
        LastName,
        RegisteredName, 
        Age, 
        City,
        Address,
        PhoneNumber, 
        BankAccountNumber,
        BankName,
        BankIFSC, 
        BankBranchLocation,
        AadhaarNumber,
        PAN, 
        UpiCredentialNumber,
        BankID,
        AccountBalance
    )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
     return {createUserQueary,Values}
}

const InsertUser = async (Queary,personData,usersDatabase) => {
    await usersDatabase.run(Queary,personData,(err)=>{
        if(err){
            throw new Error(`Error While Creating UserAccount(${personData}) :\n->\t ${err}`)
        }
        else {
            const data = {...personData}
            console.log("Account Created Successfully : ",data.FirstName," Acc no:",data.BankAccountNum)
        }
    })

    
}

const createBankAccount = (usersDatabase) => {
    for(let personData of usersData){
        let {createUserQueary,Values}= getQuery(personData)
        InsertUser(createUserQueary,Values,usersDatabase)
    }
 }

 module.exports={
    createBankAccount
 }