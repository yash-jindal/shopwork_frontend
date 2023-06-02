import { useLocation, useNavigate } from 'react-router-dom'
import './viewcustomer.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
const URL = "https://shopwork-back.onrender.com";


export default function Viewcustomer() {
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
  
  const calcInterest = (date, credit, debit, rate) => {
      const today = new Date();
      const entryDate = new Date(date);
      const oneDay = 24*60*60*1000;
      const diffDays = Math.round(Math.abs((today-entryDate)/oneDay));

      if(credit == 0){
          return [diffDays, Math.round(((debit*rate)/3000)*diffDays)];
      }else{
        return [diffDays, Math.round(((credit*rate)/3000)*diffDays)];
      }
  }

  const handleRefresh = async () => {
    let diff = 0;
    customer?.transaction?.forEach(async (trans, i) => {
      const [days, newInterest] = calcInterest(trans.date, trans.credit, trans.debit, customer.interestRate);
      const updatedInterest = {
        id: trans._id,
        interest: newInterest,
        days: days
      }
      if(trans.credit == 0){
        diff = diff + (parseInt(trans.interest) - parseInt(newInterest));
      }else{
        diff = diff + (parseInt(newInterest) - parseInt(trans.interest));
      }

      try{
        await axios.put(`${URL}/api/customers/interestUpdate/${id}`, updatedInterest)
      }catch(err){
        throw err;
      }
    })
        const base = parseInt(customer?.payable?.base);
        const interest = parseInt(customer?.payable?.interest) + diff;
        const total = parseInt(customer?.payable?.total) + diff;

        const payable = {
          base: base,
          interest: interest,
          total: total
        }
        console.log(payable);
        try{
          await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable);
        }catch(err){
          throw err;
        }
        window.location.reload();
  }
  useEffect(() => {
    getCustomer();
  }, []);

  const handleDelete = async(_id) => {
    const value = {
      subId: _id
    }
    customer?.transaction?.forEach(async (entry) => {
      if(entry._id === _id){
        if(entry.credit == 0){
          const base = parseInt(customer?.payable?.base) + parseInt(entry.debit);
          const interest = parseInt(customer?.payable?.interest) + parseInt(entry.interest);
          const total = parseInt(customer?.payable?.total) + parseInt(entry.debit) + parseInt(entry.interest);
          const payable = {
            base: base,
            interest: interest,
            total: total
          }
          try{
            await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable);
          }catch(err){
            throw err;
          }
        }else{
          const base = parseInt(customer?.payable?.base) - parseInt(entry.credit);
          const interest = parseInt(customer?.payable?.interest) - parseInt(entry.interest);
          const total = parseInt(customer?.payable?.total) - parseInt(entry.credit) - parseInt(entry.interest);
          const payable = {
            base: base,
            interest: interest,
            total: total
          }
          try{
            await axios.put(`${URL}/api/customers/updatePayable/${id}`, payable);
          }catch(err){
            throw err;
          }
        }
      }
    })
    try{
      await axios.put(`${URL}/api/customers/deleteEntry/${id}`, value);
    }catch(err){
      throw err
    }
    getCustomer();
  }
  const navigate = useNavigate();
  const handleEdit = (_id) => {
      const value = {
        objectId: id,
        entryId: _id
      }
      navigate("/updateEntry", {state: value});
  }

  const handleHome = () => {
    navigate("/");
  }

  return (
    <div>
      <div className='cust'>
      <div className='update'>
      <button onClick = {() => handleHome()} className='updateEntry'>Home</button>
      </div>
        <h1>{customer?.name} / {customer?.fname}</h1>
        <button className = "buttons" onClick={() => handleRefresh()}>Refresh</button>
      </div>
      <br />
      <div id="result" className={customer?.payable?.base < 0 ? "red" : "green"}>
        <span>Base: </span>
        <span id="base">{customer?.payable?.base}</span>
        <br />
        <br />
        <span>Interest: </span>
        <span id="interest">{customer?.payable?.interest}</span>
        <br />
        <br />
        <span>Total Payable: </span>
        <span id="total">{customer?.payable?.total}</span>
      </div>
      <br />
      <table className="table table-striped custTable">
        <thead>
          <tr>
            <th scope="col">S.no</th>
            <th scope="col">Credit</th>
            <th scope="col">Debit</th>
            <th scope="col">Interest</th>
            <th scope="col">Date</th>
            <th scope="col">Remark</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {customer?.transaction.map((entry, i) => (
               <tr>
               <th scope="row">{i+1}</th>
               <td>{entry.credit}</td>
               <td>{entry.debit}</td>
               <td className={entry.credit === 0 ? "red" : "green"}>{entry.interest} ({entry.days} days)</td>
               <td>{entry.date}</td>
               <td>{entry.remark}</td>
               <td><button onClick={() => handleEdit(entry._id)}>Edit Entry</button></td>
               <td><button onClick={() => handleDelete(entry._id)}>Delete Entry</button></td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
