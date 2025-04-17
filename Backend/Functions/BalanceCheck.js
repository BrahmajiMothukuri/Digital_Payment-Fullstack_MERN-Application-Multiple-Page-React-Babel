const { query } = require("express")

const getBalance = async (db,PhoneNumber,res) => {
    query = `
    SELECT AccountBalance FROM Users WHERE PhoneNumber=${PhoneNumber}
    `
    await db.get(query,(err,row)=>{
        if(err){
            throw new Error("Server Down")
        }
        else{
            res.status(200).send(row)
            console.log("Got Balance Details",row)
        }
    })

}