import React from 'react'
import { useState} from 'react';
import './Auth.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logInWithEmailAndPassword } from '../firebase';

function Login() {
  const initialValues = { email: "", password: ""};
	const [formValues, setFormValues] = useState(initialValues);
	// const [user, loading, error] = useAuthState(auth);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		logInWithEmailAndPassword(formValues.email, formValues.password);
	};

  return (
		<div className="container-login">
		<form onSubmit={handleSubmit} className="form">
			<div className="form-title">
				<h1>Login</h1>
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
					<p>Nu ai deja cont?</p>
					<a href='/register'><i>Creaza acum</i></a>
				</div>
			</div>
		</form>
	</div>
  )
}

export default Login