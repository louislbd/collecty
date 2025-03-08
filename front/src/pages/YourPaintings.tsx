import { useEffect } from "react";
import { apiService } from "../service/api";
//import PaintingCard from "../datas/Painting";
import { useSelector } from "react-redux";
import { RootState } from "../service/store";
import { showError, showSuccess } from '../components/Tostify/PopUp';

function YourPaintings() {
    const auth = useSelector((state: RootState) => state.auth);
    //const [paintings, setPaintings] = useState([]);

    const getPaintings = async () => {
        apiService.get({
            url: 'assets/' + auth.user_id,
            needAuth: true
        })
            .then((response) => {
                console.log(response);
                showSuccess('Your paintings');
            }).catch((error) => {
                console.log(error);
                showError('An error occurred');
            });
    }

    useEffect(() => {
        getPaintings();
        // eslint-disable-next-line
    }, [auth.user_id]);


    return (
        <div>
            <h1 className='text-3xl font-bold'>My Paintings Page</h1>
            <div className='w-full h-[2px] rounded-sm bg-[#27AE60] my-4'></div>
            <h2>My paintings for sale :</h2>
            <h2>TODO recupere mes annonces</h2>
        </div>
    );
}

export default YourPaintings;