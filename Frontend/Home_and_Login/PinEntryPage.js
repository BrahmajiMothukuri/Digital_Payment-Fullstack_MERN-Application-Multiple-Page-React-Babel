UpiPinEntry = () => {
    const [pin, setPin] = React.useState("");

    const handleKeyPress = (value) => {
      if (value === "backspace") {
          setPin(pin.slice(0, -1));
      } else if (value === "confirm") {
          //alert("PIN Entered: " + pin);
          const Path = "/app/user/check/pin"
          const Options = {
              method:"POST",
              headers:{
                  "Content-Type":"application/json"
              },
              body:JSON.stringify({enteredUpiPIN:pin})
          }
          fetch(Path,Options)
          .then(res=>{
              if(res.ok){
                  return res.json()
              }
              else{
                  throw new Error("wrong pin")
              }
              
          }).then(data=>{
              console.log(data)
          })
          .catch(err=>{
              console.log("err :  \n   :",err)
          })




      } else if (pin.length < 6) {
          setPin(pin + value);
      }
  };
    const goBack = async ()=>{
              await this.setState({featureTriggered:false})
            }
     return (
      <div className="Body">
      <div className="container">
          <div className="header">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>Axis Bank</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/UPI-Logo-vector.svg" alt="UPI Logo" />
          </div>
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>ENTER UPI PIN</p>
          <div className="pin-display">
              {Array(6).fill(null).map((_, index) => (
                  <div key={index} className={`dot ${index < pin.length ? "filled" : ""}`}></div>
              ))}
          </div>
          <div className="keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "backspace"].map((num, index) => (
                  <button
                      key={index}
                      className={`key ${num === "backspace" ? "special" : ""}`}
                      onClick={() => num !== "" && handleKeyPress(num)}
                  >
                      {num === "backspace" ? "⌫" : num}
                  </button>
              ))}
          </div>
          <button className="key confirm" style={{ width: "90%", marginTop: "20px" }} onClick={() => handleKeyPress("confirm")}>
              ✔ Confirm
          </button>
          <button className="back-btn" style={{ width: "100%", marginTop: "20px" }} onClick={() => goBack()}>
             Back
          </button>
      </div>
       </div>
    );

     }


export default UpiPinEntry