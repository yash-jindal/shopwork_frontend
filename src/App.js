import Homepage from './homepage/Homepage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Newcustomer from './newcustomer/Newcustomer';
import Updatecustomer from './updatecustomer/Updatecustomer';
import Viewcustomer from './viewcustomer/Viewcustomer';
import Entry from './entry/Entry';
import UpdateEntry from './updateEntry/UpdateEntry';
import { useEffect } from 'react';
import axios from 'axios';

const run = async () => {
  try{
    await axios.get("https://shopwork-back.onrender.com");
  }catch(err){
    throw err;
  }
    
}
function App() {
  useEffect(() => {
    run()
  }, [])
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/newcustomer" element={<Newcustomer />}/>
            <Route path="/updatecustomer" element={<Updatecustomer />}/>
            <Route path="/viewcustomer" element={<Viewcustomer />}/>
            <Route path="/entry" element={<Entry />}/>
            <Route path="/updateEntry" element={<UpdateEntry />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
