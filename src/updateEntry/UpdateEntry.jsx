import { useEffect, useState } from 'react';
import './updateEntry.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
const URL = "https://shopwork-back.onrender.com";

export default function Updatecustomer() {

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.objectId;
  const _id = location.state.entryId;

  const calcInterest = (date, credit, debit, rate) => {
    const today = new Date();
    const entryDate = new Date(date);
    const oneDay = 24*60*60*1000;
    const diffDays = Math.round(Math.abs((today-entryDate)/oneDay));
    console.log(credit);
    if(credit == 0){
        return [diffDays, Math.round(((debit*rate)/3000)*diffDays)];
    }else{
      return [diffDays, Math.round(((credit*rate)/3000)*diffDays)];
    }
}

  const handleClick = async (e) => {
    e.preventDefault()
    const credit = document.getElementById("credit").value;
    const debit = document.getElementById("debit").value;
    const date = document.getElementById("date").value;
    const remark = document.getElementById("remark").value;
    const [days, interest] = calcInterest(date, credit, debit, interestRate);
    const newEntry = {
      id: _id,
      credit: credit,
      debit: debit,
      interest: interest,
      days: days,
      date: date,
      remark: remark
    }
    if(credit == 0){
      if(entry.credit == 0){
        const base = parseInt(customer?.payable?.base) + parseInt(entry.debit) - parseInt(debit);
        const newInterest = parseInt(customer?.payable?.interest) + parseInt(entry.interest) - parseInt(interest);
        const total = parseInt(customer?.payable?.total) + parseInt(entry.debit) + parseInt(entry.interest) - parseInt(debit) - parseInt(interest);
        const payable = {
          base: base,
          interest: newInterest,
          total: total
        }
        try{
          await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable)
        }catch(err){
          throw err
        }
      }else{
        const base = parseInt(customer?.payable?.base) - parseInt(entry.credit) - parseInt(debit);
        const newInterest = parseInt(customer?.payable?.interest) - parseInt(entry.interest) - parseInt(interest);
        const total = parseInt(customer?.payable?.total) - parseInt(entry.credit) - parseInt(entry.interest) - parseInt(debit) - parseInt(interest);
        const payable = {
          base: base,
          interest: newInterest,
          total: total
        }
        try{
          await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable)
        }catch(err){
          throw err
        }
      }
    }else{
      if(entry.credit == 0){
        const base = parseInt(customer?.payable?.base) + parseInt(entry.debit) + parseInt(credit);
        const newInterest = parseInt(customer?.payable?.interest) + parseInt(entry.interest) + parseInt(interest);
        const total = parseInt(customer?.payable?.total) + parseInt(entry.debit) + parseInt(entry.interest) + parseInt(credit) + parseInt(interest);
        const payable = {
          base: base,
          interest: newInterest,
          total: total
        }
        try{
          await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable)
        }catch(err){
          throw err
        }
      }else{
        const base = parseInt(customer?.payable?.base) - parseInt(entry.credit) + parseInt(credit);
        const newInterest = parseInt(customer?.payable?.interest) - parseInt(entry.interest) + parseInt(interest);
        const total = parseInt(customer?.payable?.total) - parseInt(entry.credit) - parseInt(entry.interest) + parseInt(credit) + parseInt(interest);
        const payable = {
          base: base,
          interest: newInterest,
          total: total
        }
        try{
          await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable)
        }catch(err){
          throw err
        }
      }
    }
    
    try{
      await axios.put(`${URL}/api/customers/editEntry/${id}`, newEntry)
    }catch(err){
        throw err;
    }
    navigate("/viewcustomer", {state: id});
  }
  const [entry, setEntry] = useState([]);
  const [interestRate, setInterestRate] = useState([]);
  const [customer, setCustomer] = useState([]);

  const getCustomer = async () => {
    const customer = (await axios.get(`${URL}/api/customers/${id}`)).data;
    setCustomer(customer);
    setInterestRate(customer?.interestRate);
    customer?.transaction?.every((ent) => {
      if(ent._id === _id){
        setEntry(ent);
        return false;
      }
      return true;
    })
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
          <label>Credit</label>
          <input defaultValue={entry.credit} type="number" className="form-control" id="credit"/>
        </div>
        <div className="form-group">
          <label>Debit</label>
          <input defaultValue={entry.debit} type="number" className="form-control" id="debit"/>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input defaultValue={entry.date} type="datetime-local" className="form-control" id="date"/>
        </div>
        <div className="form-group">
          <label>Remark</label>
          <input defaultValue={entry.remark} type="text" className="form-control" id="remark"/>
        </div>
        <button onClick={(e) => handleClick(e)} className="btn btn-primary">Submit</button>
      </form>
    </div>
    
  )
}
