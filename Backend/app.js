
//console.log("🚀 Starting...");
const EXPRESS = require("express")
//console.log("🚀 Express Installed");
const PATH = require("path")
//console.log("🚀 Path Installed.");
const SQLITE3 = require("sqlite3")
//console.log("🚀 Sqlite3 Installed...");
const app = EXPRESS()
//console.log("🚀 Express CALLED...");
app.use(EXPRESS.json())
//console.log("🚀 JSON convertor...");
const BCRYPT = require("bcrypt") 
//console.log("🚀 Bcrypt Installed...");
const {UserTransactionsTable} = require("./APIs/UPI_Accounts/UserDataBase/userTransactionTable")
const {createBankAccount} = require("./APIs/createBankUser_API")
const {createBankAccountTable} = require("./APIs/createUsersTable")
const {CreateUpiTable} = require("./APIs/UPI_Accounts/CreateTable")
const {createTransactionsTable} = require("./APIs/UPI_Accounts/CreateTransactionsTable")
const {create_UPI_Account} = require("./APIs/UPI_Accounts/signupUPI")
const {insertIntoDB} = require("./Functions/insertData")
const {checkAuth} = require("./Functions/checkAuthentication")
const { channel } = require("diagnostics_channel")
const {check_Upi_Pin} = require("./Functions/checkUPI_pin")
const {checkUserBankStatus} = require("./APIs/checkUserBankStatus")
const {check_UPI_Account} = require("./Functions/check_UPI_Account") 

const LoginStatus = {
    isLoggedIn:false,
    user:[],
    UserID:"",
    BankID:"",
    userRequestCredentials:{},
}
const instanceLOGIN = {
    isUserLoggedIn:false,
    User:{}
}
const instanceTRANSACTION = {
    isTransactionStarted:false,
    FromUser:{},
    ToUser:{},
    TransferAmount:0,
    transactionSTATUS:{},
    recentTransaction:{}

}
const AccountCreationStatus = {
    processInitiated:false,
    isAccountCreated:false,
}

const PORT = 2025
let usersDB = null 
let upiDB = null
let transactionsDB = null


const usersDbPath = PATH.join(__dirname, "DATABASE", "UsersDatabase.db");
const upiDbPath = PATH.join(__dirname, "DATABASE", "upiDatabase.db");
const transactionsDbPath = PATH.join(__dirname,"DATABASE","transactions.db")

const createUsersDatebase = () => {
    usersDB = new SQLITE3.Database(usersDbPath,(err)=>{
        if(err){
            console.log(err)
            throw new Error(`error at student_club_members Db \n err:- ${err.message}`)
            // throw new Error("Error While Create Users Database at (createUsersDatebase Function)")
        }
        else{
            console.log("Database (UsersDatabase.db) created successfully");
        }
    })
}

const createUpiDatabase = () => {
    upiDB = new SQLITE3.Database(upiDbPath,err=>{
        if(err){
            console.log(err)
            throw new Error("error while creating UPI database \n Err : ",err)
        }
        else {
            console.log("UPI DataBase Created Successfully")
        }
    })

}

const createTransactionsDatabase = () =>{
    
    transactionsDB = new SQLITE3.Database(transactionsDbPath,err=>{
        if(err){
            console.log(err)
            throw new Error("error while creating Transactions database \n Err : ",err)
        }
        else{
            console.log("Transactions DataBase Created Successfully")
        }
    })
    

}

const initializeDatabaseAndServer = async () =>{
    try{
        await createUsersDatebase()
        app.listen(PORT,()=>{
            console.log(`App is Running at http://localhost:${PORT}/`)
        })

    }
    catch(err)
    {
        console.log("Error : ",err)

    }
}
const initializeUpiDatabase = async () => {
    try{
        await createUpiDatabase()
    }
    catch(err){
        console.log(err)
    }
}
const initializeTransactionsDatabase = async () => {
    try{
        await createTransactionsDatabase()
    }
    catch(err){
        console.log(err)
    }
}
initializeDatabaseAndServer()
initializeUpiDatabase()
initializeTransactionsDatabase()

const createUsersBankAccountsTable = () => {
    try{
        createBankAccountTable(usersDB)
    }
    catch(err){
        console.log(err)
    }
}
const createUpiAccountsTable=()=>{
    CreateUpiTable(upiDB)
}
const createTransactionsTableFun=()=>{
    try{
        createTransactionsTable(transactionsDB)
    }
    catch(err){
        console.log(err)
    }
}

const createUsersTransactionsTable = () => {
    try{
        UserTransactionsTable(transactionsDB)
    }
    catch(err){
        console.log(err)
    }
}

const addBankUsers = () => {
    try{
        createBankAccount(usersDB)
    }
    catch(err){
        console.log(err)
    }

}
app.get("/users/",async (req,res)=>{
    const sQueary = `
    SELECT * FROM Users
    `
    const data = await usersDB.all(sQueary,(err,data)=>{
        if(err){
            console.log("Err in sending data")
        }
        else{
            console.log("got Data")
            res.send(data)
        }
    })
    
})

app.post("/users/signup/checkAccountStatus/",async (req,res)=>{
    const {PhoneNumber}= req.body 
  try{
        let User = await checkUserBankStatus(String(PhoneNumber),usersDB,res)
        //console.log(User)
        if(User.length === 0){
            User = null
        }
        if(User !== null)
            {   LoginStatus["isLoggedIn"]=true
                LoginStatus["user"]=User
              //  console.log(LoginStatus)
                res.status(200).send({userData:User})

            }
            else{
                res.status(404).send({message:"User Does Not Have Bank Account"})
            }
   }
   catch(err){
    console.log(err)
    res.send(err.message)
   }

})

app.post("/users/signup/createUpiAccount/",async (req,res)=>{
    const userData = req.body 
    console.log("After PIN: ==>",userData)
    //res.status(200).send({message:"Data Recived"})
    const {
         UpiPIN,
    } = userData
    const hashedPassword = await BCRYPT.hash(UpiPIN,10)
    userData["UpiPIN"] = hashedPassword
    console.log(UpiPIN,"==>",hashedPassword)
    console.log(userData)
    try{
    const Status = await create_UPI_Account(upiDB,userData)
    console.log(Status)
    if(Status.success){
        AccountCreationStatus["isAccountCreated"] = true
        AccountCreationStatus["processInitiated"] = true
        res.status(200).send(Status)
    }
    }
    catch(err){
        console.log("Error :- \n        ",err)
         if(err.includes("UNIQUE constraint failed")){
            res.status(200).send({ success: false, lastID:null ,message:"UNIQUE constraint failed"})
         }
        
    }
})

app.get("/app/invalid/mobile",(req,res)=>{
    res.sendFile(PATH.join(__dirname,"../Frontend/signUp/SQL_Consrtrain_Fail.html"))
})

app.get("/users/tranction/check/user",checkAuth(LoginStatus), async(req,res)=>{})

app.post("/users/check/balance", checkAuth(LoginStatus), async (req,res)=>{
    const Data = LoginStatus["user"]
    const {UpiPIN} = req.body
    Match = check_Upi_Pin(UpiPIN,BCRYPT,Data)
    if(Match){
        try{
        await getBalance(usersDB,Data["PhoneNumber"],res)
        }
        catch(err){
            res.status(403).send("Server Down")
        }
    }
    else{
        res.status(403).send("Wrong UPI Pin");
    }
})
app.post("/app/users/login/",async (req,res)=>{
    const {PhoneNumber,UpiPIN} = req.body 
    try{
    const Data = await getUser(upiDB,phoneNum)
    if(Data.length==0){
        res.status(505).send("Invalid Details")
        console.log("User Has No UPI Account")
    }
    else{
        const match = check_Upi_Pin(UpiPIN,BCRYPT,Data)
        if(match){
        LoginStatus["isLoggedIn"]=true
        LoginStatus["user"]=Data 
        res.status(200).send(Data)}
        else{
            res.status(404).send(" Invalid UPI Pin ")
            console.log("Invalid UPI Pin")
        }
    }
    }
    catch(err){
        res.status(403).send("Server Down")
        console.log("Error While Logging in")
    }

})
app.get("/users/logout/",async (req,res)=>{
    LoginStatus["isLoggedIn"] = false
    LoginStatus["user"] = null
})

app.get("/app/users/signup",(req,res)=>{
    res.sendFile(PATH.join(__dirname, "../Frontend/signUp/signup.html"));
})

app.post("/users/signup/set/pin",(req,res)=>{
    console.log("submit triggered")
    res.status(200).send({msg:"Data Recived"})
})
app.get("/user/setPin",async (req,res)=>{
    console.log(req.query)
    const credentials = req.query 
    LoginStatus.userRequestCredentials = credentials
   // console.log("after subittng details:---> ",LoginStatus)
    res.sendFile(PATH.join(__dirname,"../Frontend/signUp/setUpiPIN.html"))

})
app.get("/users/getUserData/",(req,res)=>
    {  
    const Authentication = ((LoginStatus.isLoggedIn) && (LoginStatus.user[0].UserID==LoginStatus.userRequestCredentials.userID && LoginStatus.user[0].BankID===LoginStatus.userRequestCredentials.bankID))
    //console.log(Authentication)
    //console.log(LoginStatus)
        if(Authentication){
                res.status(200).send({user:LoginStatus["user"]})
        }
        else{
                res.status(404).send({message:"Authentication Failed"})
        }
    })



app.get("/invalid/authentication",(req,res)=>{

    res.sendFile(PATH.join(__dirname,"../Frontend/signUp/AuthenticationFail.html"))
    
})    

// Get all UPI Users..?

app.get("/all/UPI/users", (req, res) => {
    const query = "SELECT * FROM Users";
    upiDB.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error fetching UPI users:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(rows);
    });
});

app.get("/App/UPI/Create/Success",(req,res)=>{
    if(AccountCreationStatus["isAccountCreated"] && AccountCreationStatus["processInitiated"]){
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Success.html"))
    }
    else if(AccountCreationStatus["isAccountCreated"]===false && AccountCreationStatus["processInitiated"]){
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/signUp/AuthenticationFail.html"))
    }
})

app.get("/app/login/signup",(req,res)=>{
    res.sendFile(PATH.join(__dirname,"../Frontend/Home_and_Login/Login.html"))
})
app.post("/app/Auth/check/login/",async (req,res)=>{
   
    const userData = req.body 
    const {PhoneNumber,enteredUpiPIN} = userData
    //console.log(req.body)
   const User = await check_UPI_Account(PhoneNumber,upiDB) 
   // console.log("User : ",User)
    if(User.length===0){
        res.status(404).send({message:"Mobile Number Does Not Have UPI Account"})
    }
    else if(User.length===1){
        const upiPinStatus = await check_Upi_Pin(enteredUpiPIN,BCRYPT,User[0])
        if(upiPinStatus){
            instanceLOGIN.isUserLoggedIn=true
            instanceLOGIN.User=User
            res.status(200).send({message:"Authentication",status:"Success"})
           // console.log("UPI PIN IS CORRECT : ",upiPinStatus)

        }
        else{
            //console.log("UPI PIN IS INCORRECT : ",upiPinStatus) 
            res.status(401).send({message:"Authentication",status:"Unauthorized"})
        }
    }
    
})
app.get("/user/application/open/",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.status(200).sendFile(PATH.join(__dirname,"../Frontend/Home_and_Login/Home.html"))
    }
    else{
        res.status(404).sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})
app.get("/app/user/get/details",async (req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.status(200).send({userData:instanceLOGIN.User})
    }
    else{
        res.status(404).send({message:"Login Err",status:"Server Down"})
    }
})
app.get("/app/unAuthorized",(req,res)=>{
    res.sendFile(PATH.join(__dirname,"./Frontend/AccountCreation/Fail.html"))
})
app.get("/app/user/logout",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        instanceLOGIN.isUserLoggedIn=false 
        instanceLOGIN.User={}
        res.sendFile(PATH.join(__dirname,"../Frontend/Home_and_Login/Login.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})
app.get("/app/user/profile",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.sendFile(PATH.join(__dirname,"../Frontend/Home_and_Login/Profile.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})
app.get("/app/user/check/balance",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.sendFile(PATH.join(__dirname,"../Frontend/checkBalance/index.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})
app.post("/app/user/check/pin",async (req,res)=>{
    console.log(req.body)
    const {enteredUpiPIN} = req.body 
    const Data = instanceLOGIN.User
    //console.log(enteredUpiPIN)
    if(instanceLOGIN.isUserLoggedIn){
        const isPinCorrect = await check_Upi_Pin(enteredUpiPIN,BCRYPT,Data[0])
        // console.log(isPinCorrect,Data[0].PhoneNumber)
        if(isPinCorrect){
            const ActualData = await check_UPI_Account(Data[0].PhoneNumber,upiDB)
            console.log(ActualData)
            const {RegisteredName,AccountBalance,BankName,BankID,BankIFSC,BankAccountNumber,BankBranchLocation,UpiCredentialNumber} = ActualData[0]
            const resUserData = {RegisteredName,AccountBalance,BankName,BankID,BankIFSC,BankAccountNumber,BankBranchLocation,UpiCredentialNumber}
            if(ActualData.length===1){
                    res.status(200).send({"pin":isPinCorrect,UserData:resUserData,message:"Success"})
            }
            else{
                res.status(200).send({"pin":isPinCorrect,UserData:ActualData,message:"Server Down"})
            }
        }
        else{
            res.status(200).send({"pin":isPinCorrect})
        }

    }
    else{
        res.status(401).send({message:"Authentication",status:"Unauthorized"})
    }
})

app.get("/app/upi/send/amt",async (req,res)=>{
    //const {Amount,toUpiNumber,fromUpiNumber} = req.body
    const {creditAmount} = require("./Functions/Transactions/creditAmount")
    const {debitAmount} = require("./Functions/Transactions/debitAmount")
    const fromUpiNumber = "069.321.8961"
    const toUpiNumber = "661.155.6225"
    const Amount = 45000
    const credit = await creditAmount(fromUpiNumber,Amount,upiDB,usersDB)
    const debit = await debitAmount(toUpiNumber,Amount,upiDB,usersDB)

})
app.get("/app/send/mobile",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.status(200).sendFile(PATH.join(__dirname,"../Frontend/TransactionTypes/SendMoney/byMobile.html"))
    }
    else{
    res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})
app.post("/get/Mobile/User",async (req,res)=>{
    console.log(req.body)
    const {PhoneNumber} = req.body
    const AccHolder = {}
    const loginUserMobileNumber = instanceLOGIN.User[0]["PhoneNumber"]
    if(instanceLOGIN.isUserLoggedIn){
         //console.log("userdata in app: ---> ",instanceLOGIN.User)
         if(PhoneNumber !== loginUserMobileNumber){
         const AccHolder = await check_UPI_Account(instanceLOGIN.User[0]["PhoneNumber"],usersDB)
         console.log("-->AccHolder",AccHolder)
            await upiDB.get(`SELECT * FROM Users WHERE PhoneNumber="${PhoneNumber}"`,(err,row)=>{
                if(err){
                    console.log("Errrr: --> ",err)
                }
                else{
                    console.log("==>to user==>",row)
                    if(row !== undefined && AccHolder!== undefined && AccHolder.length===1)
                    {   instanceTRANSACTION.isTransactionStarted=true     
                        res.send({user:{"Name":row["RegisteredName"],"BankID":row["BankID"],"PhoneNumber":row["PhoneNumber"],
                        "BankingName":row["LastName"]+row["FirstName"],"BankName":row["BankName"]},
                        AccountHolder:AccHolder[0]
                    })
                    }
                    else{
                    res.send({user:null})    
                    }
                }
        })
    }
    else{
        res.send({user:null})
    }
    }
    else
    {
        res.status(404).send({message:"Authentication",status:"Unauthorized"})
    }
})


app.post("/app/start/transaction",(req,res)=>{
    if(instanceTRANSACTION.isTransactionStarted && instanceLOGIN.isUserLoggedIn){
        const {TransferAmount,ToUser,FromUser} = req.body  
        console.log("===>@@@===>",req.body)
        instanceTRANSACTION.ToUser = ToUser 
        instanceTRANSACTION.FromUser = FromUser
        instanceTRANSACTION.TransferAmount = TransferAmount
        //res.status(200).sendFile(__dirname,"../Frontend/UpiAccounts/CreditCheckPIN.html")
        res.status(200).send({status:true,message:"Got Data"})
    }
    else{
        res.status(404).send({status:false,message:"Authentication Fail"})
        //res.sendFile(__dirname,"../Frontend/AccountCreation/Fail.html")
    }
})


app.get("/upi/transfer/enter/pin",async (req,res)=>{
    console.log(instanceLOGIN.isUserLoggedIn,instanceTRANSACTION.isTransactionStarted)
    if(instanceLOGIN.isUserLoggedIn && instanceTRANSACTION.isTransactionStarted){
        res.sendFile(PATH.join(__dirname,"../Frontend/UpiAccounts/CreditCheckPIN.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})


app.post("/upi/transfer/check/pin",async (req,res)=>{
    console.log(req.body)
    const {enteredUpiPIN} = req.body 
    const Data = instanceLOGIN.User
   
    
    if(instanceLOGIN.isUserLoggedIn && instanceTRANSACTION.isTransactionStarted){
        const isPinCorrect = await check_Upi_Pin(enteredUpiPIN,BCRYPT,Data[0])
        const {generateTransactionId}=require("./Functions/Transactions/generateTransactions")
        const TransactionID = generateTransactionId()
        console.log("==> PIN : ",isPinCorrect)
        const tranctionData = {
            FromUserMobile:instanceTRANSACTION.FromUser.PhoneNumber,
            FromUserRegisteredName:instanceTRANSACTION.FromUser.RegisteredName,
            ToPersonMobile:instanceTRANSACTION.ToUser.PhoneNumber,
            ToPersonRegisteredName:instanceTRANSACTION.ToUser.Name,
            TransactionId:TransactionID,
            FromBankName:instanceTRANSACTION.FromUser.BankName,
            FromBankId:instanceTRANSACTION.FromUser.BankID,
            ToBankName:instanceTRANSACTION.ToUser.BankName,
            ToBankId:instanceTRANSACTION.ToUser.BankID,
            Amount:instanceTRANSACTION.TransferAmount,
            PaymentStatus:"",
        }
        const UserTransactionData = {               
            TransactionId:TransactionID,
            SenderName:instanceTRANSACTION.FromUser.RegisteredName,
            ReceiverName:instanceTRANSACTION.ToUser.Name,
            AmountSent:instanceTRANSACTION.TransferAmount,
            SenderBankID:instanceTRANSACTION.FromUser.BankID,
            SenderBankName:instanceTRANSACTION.FromUser.BankName,
            ReceiverBankID:instanceTRANSACTION.ToUser.BankName,
            ReceiverBankName:instanceTRANSACTION.ToUser.BankID,
        }

        if(isPinCorrect){
            const {creditAmount} = require("./Functions/Transactions/creditAmount")
            const {debitAmount} = require("./Functions/Transactions/debitAmount")
            const {insertTransaction} = require("./APIs/UPI_Accounts/InsertTrasaction/insertTransaction")
            const fromUpiNumber = instanceTRANSACTION.FromUser.PhoneNumber
            const toUpiNumber = instanceTRANSACTION.ToUser.PhoneNumber
            const Amount = instanceTRANSACTION.TransferAmount
                const credit = await creditAmount(fromUpiNumber,Amount,upiDB,usersDB)
                const debit = await debitAmount(toUpiNumber,Amount,upiDB,usersDB)
            if(credit && debit){
                const STATUS = {credit:true,debit:true,status:"Success",transactionsInfo:tranctionData}
                tranctionData["PaymentStatus"]="completed"
                instanceTRANSACTION.transactionSTATUS = STATUS
                instanceTRANSACTION.isTransactionStarted = false                
                instanceTRANSACTION.TransferAmount = 0
                instanceTRANSACTION.FromUser={}
                instanceTRANSACTION.ToUser={}
                instanceTRANSACTION.recentTransaction=tranctionData
                await insertTransaction(transactionsDB,tranctionData,STATUS,UserTransactionData,res) 
                console.log(tranctionData)  
            }
            else if(credit===true && debit === false){
                const STATUS = {credit:true,debit:false,status:"Pending"}
                instanceTRANSACTION.transactionSTATUS = STATUS
                tranctionData["PaymentStatus"]="pending"
                instanceTRANSACTION.isTransactionStarted = false                      
                instanceTRANSACTION.TransferAmount = 0
                instanceTRANSACTION.FromUser={}
                instanceTRANSACTION.ToUser={}
                instanceTRANSACTION.recentTransaction=tranctionData                
                insertTransaction(transactionsDB,tranctionData,STATUS,res) 

                console.log(tranctionData)                        
            }
            else if(credit===false && debit === true){
                const STATUS = {credit:false,debit:true,status:"Abnormal"}
                instanceTRANSACTION.transactionSTATUS = STATUS
                tranctionData["PaymentStatus"]="pending"
                instanceTRANSACTION.isTransactionStarted = false                
                instanceTRANSACTION.TransferAmount = 0
                instanceTRANSACTION.FromUser={}
                instanceTRANSACTION.ToUser={} 
                instanceTRANSACTION.recentTransaction=tranctionData                
                insertTransaction(transactionsDB,tranctionData,STATUS,res)  
                console.log(tranctionData)                   
            }
            else{
                const STATUS = {credit:false,debit:false,status:"Failed"}
                instanceTRANSACTION.transactionSTATUS = STATUS
                tranctionData["PaymentStatus"]="failed"
                instanceTRANSACTION.isTransactionStarted = false
                instanceTRANSACTION.TransferAmount = 0
                instanceTRANSACTION.FromUser={}
                instanceTRANSACTION.ToUser={}
                instanceTRANSACTION.recentTransaction=tranctionData                
                insertTransaction(transactionsDB,tranctionData,STATUS,res)  
                console.log(tranctionData)    
            }
        
        }
        else{
            res.status(200).send({"pin":isPinCorrect})
        }
    }
    else{
        res.status(401).send({message:"Authentication",status:"Unauthorized"})
    }
})



app.get("/app/transaction/status/",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn &&  Object.keys(instanceTRANSACTION.recentTransaction).length !== 0){
       
        res.sendFile(PATH.join(__dirname,"../Frontend/TransactionTypes/SendMoney/TransactionStatus.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})

app.get("/app/get/transaction/details",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn &&  Object.keys(instanceTRANSACTION.recentTransaction).length !== 0){
       
        res.status(200).send({transactionData:instanceTRANSACTION.recentTransaction})
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})


// app.get("/delete/upi/user/transaction/Data",async (req,res)=>{
//     await transactionsDB.run("DELETE FROM TransactionHistory",(err)=>{
//         if(err){
//             console.log("Err",err)
//         }
//         else{
//             console.log("table DATA Deleted")
//             res.send("table DATA Deleted")
//         }
//     })
// })


app.get("/app/transaction/history",async(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.sendFile(PATH.join(__dirname,"../Frontend/Home_and_Login/TransactionHistory.html"))
    }
    else{
        res.send("Auth Failed")
    }
})



app.get("/get/all/user/transactions",async (req,res)=>{

    // if(instanceLOGIN.isUserLoggedIn){



    const user = instanceLOGIN.User
    const userObj = user[0]
   // console.log(userObj)
    const Queary = `
    SELECT 
    'Sent' AS Type, 
    TransactionID, 
    ReceiverName AS Party, 
    AmountSent, 
    DateTime, 
    SenderBankID AS BankID, 
    SenderBankName AS BankName 
FROM TransactionHistory 
WHERE SenderName = "${userObj.RegisteredName}"

UNION ALL

SELECT 
    'Received' AS Type, 
    TransactionID, 
    SenderName AS Party, 
    AmountSent, 
    DateTime, 
    ReceiverBankID AS BankID, 
    ReceiverBankName AS BankName 
FROM TransactionHistory 
WHERE ReceiverName = "${userObj.RegisteredName}";
    `
    await transactionsDB.all(Queary,(err,row)=>{
        if(err){
            console.log(err)
        }
        else{
            res.status(200).send({transactionData:row})
        }
    })




    // }
    // else{
    //     res.status(404).send("Authentication Failed")
    // }
})


app.get("/app/user/qr/",(req,res)=>{
    if(instanceLOGIN.isUserLoggedIn){
        res.sendFile(PATH.join(__dirname,"../Frontend/TransactionTypes/SendMoney/QR.html"))
    }
    else{
        res.sendFile(PATH.join(__dirname,"../Frontend/AccountCreation/Fail.html"))
    }
})


///////////// NEW PAGES ////////////////////////////

app.get("/flowpay/app/",(req,res)=>{
    res.sendFile(PATH.join(__dirname,"../Frontend/WEBPAGE/initialPage.html"))
})