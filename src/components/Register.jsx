import { GoogleAuthProvider } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { AuthContext } from './context/AuthProvider';


const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUser, googleProviderLogin } = useContext(AuthContext);
    const [createUserEmail, setCreatedUserEmail] = useState('');
    const [token] = useToken(createUserEmail)
    const [signUpError, setSignUPError] = useState('')
    const googleProvider = new GoogleAuthProvider();
    const navigate = useNavigate();

    if (token) {
        // console.log(token)
        navigate('/');
    }

    const handleSignUp = data => {
        // console.log(data.email);
        setSignUPError('');
        createUser(data.email, data.password, data.role)
            .then(result => {
                toast.success('User Created Successfully.')

                const userInfo = {
                    displayName: data.name
                }
                updateUser(userInfo)
                    .then(() => {
                        saveUser(data.name, data.email, data.role);

                    })
                    .catch(err => console.log(err));
            })
            .catch(error => {
                // console.log(error)
                setSignUPError(error.message)
            });
    }

    const handleGoogleSignIn = () => {
        googleProviderLogin(googleProvider)
            .then(result => {
                const user = result.user;
                // console.log(user);
                saveUser(user?.displayName, user?.email);
                navigate('/');
            })
            .catch(error => console.error(error))
    }

    const saveUser = (name, email, role) => {
        const user = { name, email, role };
        fetch('https://resale-handing-server-side.vercel.app/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(email)
                setCreatedUserEmail(email);


            })

    }







    return (
        <div className='h-[800px] flex justify-center items-center'>
            <div className='w-96 p-7'>
                <h2 className='text-2xl font-bold text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Name</span></label>
                        <input type="text" {...register("name", {
                            required: "Name is Required"
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input type="email" {...register("email", {
                            required: true
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input type="password" {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be 6 characters long" },
                            pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/, message: 'Password must have uppercase, number and special characters' }
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Role</span></label>

                        <select {...register('role')} className="input input-bordered w-full max-w-xs">
                            <option defaultValue="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                        </select>
                    </div>
                    <input className='btn btn-accent w-full mt-4' value="Sign Up" type="submit" />
                    {signUpError && <p className='text-red-600'>{signUpError}</p>}
                </form>
                <p className='mt-4'>Already have an account <Link className='text-secondary underline' to="/login">Please Login</Link></p>
                <div className="divider">OR</div>
                <button onClick={handleGoogleSignIn} className='btn btn-outline w-full'>CONTINUE WITH GOOGLE</button>

            </div>
        </div>
    );
};

export default Register;