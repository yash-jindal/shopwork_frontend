import { useLocation, useNavigate } from 'react-router-dom';
import './entry.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
const URL = "https://shopwork-back.onrender.com";

export default function Entry() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state;
    const [customer, setCustomer] = useState();
    const getCustomer = async () => {
      try{
        const fetchedData = (await axios.get(`${URL}/api/customers/${id}`)).data;
        setCustomer(fetchedData);
      }catch(err){
        throw err
      }
    }
    const calcInterest = (date, rate, amount) => {
        const today = new Date();
        const entryDate = new Date(date);
        const oneDay = 24*60*60*1000;
        const diffDays = Math.round(Math.abs((today-entryDate)/oneDay));
        return [diffDays, Math.round(((amount*rate)/3000)*diffDays)];
    }
    const handleClick = async (e) => {
        e.preventDefault();
        const type = document.getElementById("type").value;
        const amount = document.getElementById("amount").value;
        const date = document.getElementById("date").value;
        console.log(date);
        const remark = document.getElementById("remark").value;
        const [days, interest] = calcInterest(date, customer?.interestRate, amount);
        
        if(type === "credit"){
            const entry = {
              credit: amount,
              debit: 0,
              interest: interest,
              days: days,
              date: date,
              remark: remark
            }
            const base = parseInt(customer?.payable?.base) + parseInt(amount);
            const totalInterest = parseInt(customer?.payable?.interest) + parseInt(interest);
            const total = parseInt(customer?.payable?.total) + parseInt(amount) + parseInt(interest);
            const payable = {
              base: base,
              interest: totalInterest,
              total: total
            }
            
            try{
              await axios.post(`${URL}/api/customers/${id}`, entry);
            }catch(err){
                throw err;
            }
            try{
              await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable);
            }catch(err){
              throw err;
            }
        }else{
          const entry = {
            credit: 0,
            debit: amount,
            interest: interest,
            days: days,
            date: date,
            remark: remark
          }
          const base = parseInt(customer?.payable?.base) - parseInt(amount);
          const totalInterest = parseInt(customer?.payable?.interest) - parseInt(interest);
          const total = parseInt(customer?.payable?.total) - parseInt(amount) - parseInt(interest);
            const payable = {
              base: base,
              interest: totalInterest,
              total: total
            }
          try{
            await axios.post(`${URL}/api/customers/${id}`, entry)
          }catch(err){
              throw err;
          }
          try{
            await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable);
          }catch(err){
            throw err;
          }
        }
        navigate("/");
    }
    useEffect(() => {
      getCustomer();
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
          <label>Choose Type</label>
          <br />
          <select id="type" className='option'>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <div className="form-group">
          <label>Enter Amount</label>
          <input id="amount" type="number" className="form-control"/>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input id="date" type="datetime-local" className="form-control"/>
        </div>
        <div className="form-group">
          <label>Remark</label>
          <input id="remark" type="text" className="form-control"/>
        </div>
        <button onClick={(e) => handleClick(e)} className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
