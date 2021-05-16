import React, {useState} from 'react' ;
import axios from 'axios' ;

function Register() {

    const [state, setstate] = useState({name:"", password:"", email:"", age:0})
    const submitHandler = async (e) =>{
        e.preventDefault();
        await axios({
            method: 'post',
            url: 'http://localhost:5000/users',
            data: {
                ...state
            },
            config:{
            'headers': {'content-type': 'json/application',
                    'Access-Control-Allow-Origin' :'*'
                },
            }
          }).then((res) => {
            console.log(res)
        }).catch((error) => {
            console.log("Error : ",error)
        });
    }
    return (
        <>
           <h1>Register New User</h1>
           <form onSubmit={submitHandler}>
               <input type="text" name="user"  onChange={e=> setstate({...state, name : e.target.value})} value={state.name} placeholder="Enter Name" />
               <input type="text" name="pass"  onChange={e=> setstate({...state, password : e.target.value})} value={state.password} placeholder="Enter Password" />
               <input type="email" name="email" onChange={e=> setstate({...state, email:e.target.value})} value={state.email} placeholder="Enter email" />
               <input type="text" name="age"  onChange={e=> setstate({...state, age : e.target.value})} value={state.age} placeholder="Enter Age" />

               <button type="submit"> SignUp</button>

            </form> 
        </>
    )
}

export default Register
