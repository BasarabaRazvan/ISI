import React from 'react'
import { useState} from "react";
import './Auth.css'

function Register() {
  const initialValues = { email: "", password: ""};
  const [formValues, setFormValues] = useState(initialValues);
  // const [formErrors, setFormErrors] = useState({});
  // const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container-register">
      <form onSubmit={handleSubmit}  className="form">
        <div className="form-title">
          <h1>Register</h1>
        </div>
        <div className="ui-form">
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
            <a href='/login'><i>Login Now</i></a>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register