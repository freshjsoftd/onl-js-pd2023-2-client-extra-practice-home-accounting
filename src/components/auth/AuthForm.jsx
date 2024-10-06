import { useState } from 'react';
// ====================================
import api from '../../api'

function AuthForm() {
	const [fullName, setFullName] = useState('');

	const [email, setEmail] = useState('');

	const [password, setPassword] = useState('');

	const [users, setUsers] = useState([]);

  const registrationHandle = async () => {
    try {
      const {data} = await api.post('/auth/registration', {
        fullName,
        email,
        password,
      })
      console.log(data)
      // localStorage.setItem('accessToken', data.accessToken)
    } catch (error) {
      console.log('Registration error is: ------', error)
    }
  }

  const loginHandle = async () => {
    try {
      const {data} = await api.post('/auth/login', {
        email,
        password,
      })
      console.log(data)
      localStorage.setItem('accessToken', data.accessToken)
    } catch (error) {
      console.log('Login error is: ------', error)
    }
  }

  const logoutHandle = async () => {
    try {
      const {data} = await api.get('/auth/logout')
      localStorage.removeItem('accessToken')
      console.log(data)
      setUsers([])
    } catch (error) {
      console.log('Logout error is: ------', error)
    }
  }

  const refreshHandle = async () => {
    try {
      const {data} = await api.get('/auth/refresh')
      localStorage.setItem('accessToken', data.accessToken)
      console.log(data)
    } catch (error) {
      console.log('Refresh error is: ------', error)
    }
  }

  const getUsers = async () => {
    const {data} = await api.get('/auth/users')
    setUsers(data)
  }

	return (
		<>
      <ol>
        {users.map((users) => {
          return (
            <li key={users._id}>{users._id}....{users.email}</li>
          )
        })}
      </ol>
			<input
				type='text'
        name='fullName'
				placeholder='Full Name'
				value={fullName}
				onChange={(e) => setFullName(e.target.value)}
			/>
			<input
				type='text'
        name='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type='password'
        name='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={registrationHandle}>Sign Up</button>
			<button onClick={loginHandle}>Sign In</button>
			<button onClick={logoutHandle}>Logout</button>
			<button onClick={refreshHandle}>Refresh</button>
			<button onClick={getUsers}>Get users</button>
		</>
	);
}

export default AuthForm;
