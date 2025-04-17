const getUser = async (db,PhoneNumber)=>{
    queary = `SELECT * FROM Users WHERE PhoneNumber = ${PhoneNumber}`
    await db.get(queary,(err,row)=>{
        if(err){
            throw new Error("Server Down")
        }
        else{
            return row 
        }
    })
}