import { useNavigate } from 'react-router-dom';

function MyProducts() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>NotFound Page</h1>
            <button onClick={() => navigate('/my-space')}>
                Go back
            </button>
        </div>
    );
}

export default MyProducts;