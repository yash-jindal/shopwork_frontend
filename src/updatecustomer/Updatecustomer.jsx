import { useEffect, useState } from 'react';
import './updatecustomer.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
const URL = "https://shopwork-back.onrender.com";

export default function Updatecustomer() {

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
  const location = useLocation();
  const id = location.state;

  const handleClick = async (e) => {
    e.preventDefault()
    try{
      await axios.put(`${URL}/api/customers/${id}`, profile);
      navigate("/");
    }catch(err){
      throw err;
    }
  }
  const [customer, setCustomer] = useState([]);

  const getCustomer = async () => {
    const customer = (await axios.get(`${URL}/api/customers/${id}`)).data;
    setCustomer(customer);
  }
  useEffect(() => {
    getCustomer()
  },[])

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
          <input defaultValue={customer.name} onChange={(e) => handleChange(e)}type="text" className="form-control" id="name"/>
        </div>
        <div className="form-group">
          <label>Father/Husband Name</label>
          <input defaultValue={customer.fname} onChange={(e) => handleChange(e)} type="text" className="form-control" id="fname"/>
        </div>
        <div className="form-group">
          <label>Grandfather Name</label>
          <input defaultValue={customer.gfname} onChange={(e) => handleChange(e)} type="text" className="form-control" id="gfname"/>
        </div>
        <div className="form-group">
          <label>Interest Rate</label>
          <input defaultValue={customer.interestRate} onChange={(e) => handleChange(e)} type="text" className="form-control" id="interestRate"/>
        </div>
        <button onClick={(e) => handleClick(e)} className="btn btn-primary">Submit</button>
      </form>
    </div>
    
  )
}
