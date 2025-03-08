import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiService } from '../service/api';
import { showError, showSuccess } from './Tostify/PopUp';

function SigninForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [requestDoing, setRequestDoing] = useState<boolean>(false);

    async function signin() {
        if (!username || !email || !password || !repeatedPassword || password !== repeatedPassword) {
            showError('All fields are required, passwords also must be the same');
            return;
        }

        const datas = { 'username': username, 'email': email, 'password': password };
        setIsLoading(true);
        setRequestDoing(true);
        apiService.post({
            url: 'auth/register',
            data: datas,
        })
            .then((_: any) => {
                showSuccess('You are registered with a new account !');
                setIsLoading(false);
                setRequestDoing(false);
                navigate('/auth/login');
            }).catch((_: any) => {
                setRequestDoing(false);
                showError('An error occurred');
            });
    }

    return (
        <div className='w-full h-full flex justify-center bg-transparent'>
            <div className='bg-[#76ABAE] h-5/6 rounded-lg w-[40%] shadow-xl shadow-[#31363F] p-6 flex items-center '>
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <h2 className='text-center text-2xl text-white font-bold'>Register</h2>
                    <div className='flex flex-col w-full h-full items-center gap-6 justify-center'>
                        <input className="w-3/4 h-10 rounded-md ring-0 outline-0.1 outline-[#31363F] p-2" placeholder='Username' onChange={(e) => setUsername(e.target.value)}></input>
                        <input className="w-3/4 h-10 rounded-md ring-0 outline-0.1 outline-[#31363F] p-2" placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
                        <input className="w-3/4 h-10 rounded-md ring-0 outline-0.1 outline-[#31363F] p-2" placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input>
                        <input className="w-3/4 h-10 rounded-md ring-0 outline-0.1 outline-[#31363F] p-2" placeholder='Repeat password' onChange={(e) => setRepeatedPassword(e.target.value)}></input>
                        { !requestDoing && <button className="w-[40%] h-8 bg-[#EEEEEE] rounded-md mt-6" disabled={isLoading} onClick={() => signin()}>Confim</button>}
                        { requestDoing && <p>Registering ...</p>}
                        <div>
                            Already registered? <a href='/auth/login' className='text-green-600 font-bold'>Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SigninForm;