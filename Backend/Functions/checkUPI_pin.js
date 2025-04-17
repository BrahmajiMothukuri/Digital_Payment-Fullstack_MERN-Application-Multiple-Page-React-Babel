
const check_Upi_Pin = async (Pin,BCRYPT,Data) => {
    //console.log(Pin,"\n",Data)
    //console.log(Data["UpiPIN"]==Pin)
    const match = await BCRYPT.compare(Pin,Data["UpiPIN"]);
   //console.log(match)
    if(match){
        return true 
    }
    return false
}
module.exports={
    check_Upi_Pin
}