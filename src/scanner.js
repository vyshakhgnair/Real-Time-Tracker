import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import './scanner.css';


function Scanner( { redNo, onSave } ) {
  const [ scanResult,setScanResult]=useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [secondValue, setSecondValue] = useState(null);
  const [rescan, setRescan] = useState(false);

  useEffect(()=>{
    const scanner=new Html5QrcodeScanner('reader',{
      qrbox:{
        width:300,
        height:300,
      },
      fps:5,
    });
   
    scanner.render(success,error);
    
    function success(result) {
      scanner.clear();
      setScanResult(result);

      // Check if the result matches the specific format "164066/3"
      const formatRegex = /^(\d+)\/(\d+)$/;
      const match = result.match(formatRegex);

      if (match) {
        const first = match[1];
        const second = match[2];
        setFirstValue(first);
        setSecondValue(second);
        if (first===null || second===null) {
          // Do something with the values
          setRescan(true);
        } 
      }
    }
  
    function error(err){
      console.warn(err);
  
    }

  },[]);




  return (
    <div className="Scanner">
    <h1>QR Scanner</h1>
    {scanResult ? (
      <div className="scanner-result">
        Success: <a href={scanResult}>{scanResult}</a>
        {firstValue && secondValue && (
          <div>
            <div>
              <label>M Number:</label>
              <span>{firstValue}</span>
            </div>
            <div>
              <label>Traceability:</label>
              <span>{secondValue}</span>
            </div>
            {rescan && (
              <button className="rescan-button" onClick={() => setScanResult(null)}>Scan Again</button>
            )}
            {!rescan && (
              <button className="save-button" onClick={() => onSave(redNo, firstValue, secondValue)}>Save</button>
            )}
          </div>
        )}
      </div>
    ) : (
      <div id="reader"></div>
    )}
  </div>
);
}

export default Scanner;