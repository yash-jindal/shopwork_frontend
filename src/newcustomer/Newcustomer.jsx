import { useState } from 'react';
import './newcustomer.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const URL = "https://shopwork-back.onrender.com";

export default function Newcustomer() {

  const [profile, setProfile] = useState({
    name: undefined,
    fname: undefined,
    gfname: undefined,
    interestRate: undefined
  });
  const handleChange = (e) => {
    setProfile(prev=>({...prev, [e.target.id]: e.target.value}));
  }
  const navigate = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault()
    try{
      await axios.post(`${URL}/api/customers`, profile);
      navigate("/");
    }catch(err){
      throw err;
    }
  }

  const handleHome = () => {
    navigate("/");
  }

  return (
    <div className='cust'>

      <div className='update'>
      <button onClick = {() => handleHome()} className='updateEntry'>Home</button>
      </div>
      <form className='form'>
        <div className="form-group">
          <label>Name</label>
          <input onChange={(e) => handleChange(e)}type="text" className="form-control" id="name"/>
        </div>
        <div className="form-group">
          <label>Father/Husband Name</label>
          <input onChange={(e) => handleChange(e)} type="text" className="form-control" id="fname"/>
        </div>
        <div className="form-group">
          <label>Grandfather Name</label>
          <input onChange={(e) => handleChange(e)} type="text" className="form-control" id="gfname"/>
        </div>
        <div className="form-group">
          <label>Interest Rate</label>
          <input onChange={(e) => handleChange(e)} type="text" className="form-control" id="interestRate"/>
        </div>
        <button onClick={(e) => handleClick(e)} className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
