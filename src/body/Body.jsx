import { useEffect, useState } from 'react';
import './body.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const URL = "https://shopwork-back.onrender.com";

export default function Body() {
    const [allCustomers, setAllCustomers] = useState([]);
    const sortNames = (fetchedData) => {
      fetchedData.sort((a,b) => {
        let fa = a.name.toLowerCase();
        let fb = b.name.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
      })
    }
    const customers = async () => {
        const fetchedData = (await axios.get(`${URL}/api/customers`)).data;
        sortNames(fetchedData);
        setAllCustomers(fetchedData)
    }
    useEffect(() => {
      customers()
    },[]);

    const handleDelete = async (id) => {
        await axios.delete(`${URL}/api/customers/${id}`)
        const fetchedData = (await axios.get(`${URL}/api/customers`)).data;
        sortNames(fetchedData);
        setAllCustomers(fetchedData)
    }
    const navigate = useNavigate();
    const handleNewCustomer = () => {
      navigate("/newcustomer");
    }

    const handleUpdate = (id) => {
      navigate("/updatecustomer",  { state: id });
    }

    const handleDesc = (id) => {
      navigate("/viewcustomer", {state: id});
    }

    const handleEntry = (id) => {
      navigate("/entry", {state: id});
    }
    
  return (
    <div>
        <button className='button' onClick={() => handleNewCustomer()}>Add New Customer</button>
        <div className='custTable'>
        <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Father/Husband Name</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
           <tbody>
           {allCustomers.map((cust, i) => (
              <tr>
              <th scope="row">{i+1}</th>
              <td className = 'custName' onClick = {() => handleDesc(cust._id)}>{cust.name}</td>
              <td>{cust.fname}</td>
              <td><button onClick={() => handleEntry(cust._id)}className='entryButton'>Add an Entry</button></td>
              <td><button onClick={() => handleUpdate(cust._id)}className='updateButton'>Update</button></td>
              <td><button onClick={() => handleDelete(cust._id)} className='deleteButton'>Delete</button></td>
            </tr>
          ))}
            </tbody>
           </table>
           </div>
    </div>
  )
}



