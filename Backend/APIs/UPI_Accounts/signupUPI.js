const create_UPI_Account = async (upiDB, userData) => {
    return new Promise((resolve, reject) => {
        const Data = [
            userData.FirstName, 
            userData.LastName,
            userData.RegisteredName, 
            userData.Age, 
            userData.City,
            userData.Address,
            userData.PhoneNumber, 
            userData.BankAccountNumber,
            userData.UpiPIN,
            userData.BankName,
            userData.BankIFSC, 
            userData.BankBranchLocation,
            userData.AadhaarNumber,
            userData.PAN, 
            userData.UpiCredentialNumber,
            userData.BankID,
            userData.AccountBalance
        ];

        const Query = `INSERT INTO Users (
            FirstName, 
            LastName,
            RegisteredName, 
            Age, 
            City,
            Address,
            PhoneNumber, 
            BankAccountNumber,
            UpiPIN,
            BankName,
            BankIFSC, 
            BankBranchLocation,
            AadhaarNumber,
            PAN, 
            UpiCredentialNumber,
            BankID,
            AccountBalance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        upiDB.run(Query, Data, function(err) {
            if (err) {
                reject(`Error While Creating UPI Account: ${err}`);
            } else {
                console.log("UPI Account Created Successfully");
                resolve({ success: true, lastID: this.lastID, message:"UPI Account Created Successfully"});
            }
        });
    });
};

module.exports = {
    create_UPI_Account
};










// const create_UPI_Account = async (upiDB,userData) => {
//     const Data = [
//         userData.FirstName, 
//         userData.LastName,
//         userData.RegisteredName, 
//         userData.Age, 
//         userData.City,
//         userData.Address,
//         userData.PhoneNumber, 
//         userData.BankAccountNumber,
//         userData.UpiPIN,
//         userData.BankName,
//         userData.BankIFSC, 
//         userData.BankBranchLocation,
//         userData.AadhaarNumber,
//         userData.PAN, 
//         userData.UpiCredentialNumber,
//         userData.BankID,
//         userData.AccountBalance
//     ];

//     const Queary = `INSERT INTO Users (
//         FirstName, 
//         LastName,
//         RegisteredName, 
//         Age, 
//         City,
//         Address,
//         PhoneNumber, 
//         BankAccountNumber,
//         UpiPIN,
//         BankName,
//         BankIFSC, 
//         BankBranchLocation,
//         AadhaarNumber,
//         PAN, 
//         UpiCredentialNumber,
//         BankID,
//         AccountBalance
//     )
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
//     await upiDB.run(Queary,Data,(err)=>{
//         if(err){
//             throw new Error(`Error While Creating UPI Account, \n Err : ${err}`)
//         }
//         else{
//             console.log("UPI Account Created Successfully")
//         }
//     })

// }
// module.exports = {
//     create_UPI_Account
// }