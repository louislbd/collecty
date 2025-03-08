import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { setToken } from "../service/store";
import { apiService } from '../service/api';
import { showError, showSuccess } from './Tostify/PopUp';

function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [requestDoing, setRequestDoing] = useState<boolean>(false);

    async function login() {
        if (!email || !password) {
            showError('All fields are required');
            return;
        }

        const data = { 'email': email, 'password': password };

        setIsDisabled(true);
        setRequestDoing(true);
        apiService.post({
            url: 'auth/login',
            data: data,
        })
        .then((response: any) => {
            dispatch(setToken({token: response.data.token, user_id: response.data.user_id}));
            showSuccess('You are logged in with a new account !');
            setRequestDoing(false);
            navigate('/my-space');
        }).catch((_: any) => {
            showError('An error occurred');
            setRequestDoing(false);
        }).finally(() => {
            setRequestDoing(false);
            setIsDisabled(false);
        });
    }

    return (
        <div className='w-full h-full flex justify-center bg-transparent'>
            <div className='bg-[#76ABAE] h-5/6 rounded-lg w-[40%] shadow-xl shadow-[#31363F] p-6 flex items-center '>
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <h2 className='text-center text-2xl text-white font-bold'>Login</h2>
                    <div className='flex flex-col w-full h-full items-center gap-6 justify-center'>
                        <input className="w-3/4 h-10 rounded-md ring-0 outline-0.1 outline-[#31363F] p-2" placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
                        <input className="w-3/4 h-10 rounded-md ring-0 outline-0.1 outline-[#31363F] p-2" type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input>
                        { !requestDoing && <button className="w-[40%] h-8 bg-[#EEEEEE] rounded-md mt-6" onClick={() => login()} disabled={isDisabled}>Login</button>}
                        { requestDoing && <p>Login ...</p>}
                        <div>
                            Not registered yet ? <a href='/auth/register' className='text-green-600 font-bold'>Register</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;