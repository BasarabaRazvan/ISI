import React from 'react'
import { useState} from "react";
import './Auth.css'
import { registerWithEmailAndPassword } from '../firebase';

function Register() {
  const initialValues = { username: " ", email: "", password: ""};
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerWithEmailAndPassword(formValues.username, formValues.email, formValues.password);
  };

  return (
    <div className="container-register">
      <div className="Auth-form-container">
        <form onSubmit={handleSubmit}  className="form">
          <div className="form-title">
            <h1>Register</h1>
          </div>
          <div className="ui-form">
            <div className="field">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formValues.username}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <input
                type="password"
                name="password"
                placeholder="Parola"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>
            <button className="fluid ui button blue">Submit</button>

            <div className='register-button'>
              <p>Ai deja cont?</p>
              <a href='/'><i>Login Now</i></a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register