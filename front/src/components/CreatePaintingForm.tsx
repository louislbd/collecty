import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiService } from '../service/api';
import { useSelector } from "react-redux";
import { RootState } from "../service/store";
import GlobalInput from './Inputs/GlobalInput';
import { showError, showSuccess } from './Tostify/PopUp';

function CreatePaintingForm() {
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [imageData, setImageData] = useState<File | null>(null);
    const [secret, setSecret] = useState<string>('');

    const [assetDetails, setAssetDetails] = useState({
        authorName: '',
        assetName: '',
        assetDescription: '',
        xrpAddress: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'secret') {
            setSecret(value);
        } else {
            setAssetDetails((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImageUrl(imageUrl);
            setImageData(file);
        }
    };

    async function createPainting() {
        if (!assetDetails.authorName || !assetDetails.assetName || !assetDetails.xrpAddress || !secret || !previewImageUrl || !imageData || !assetDetails.assetDescription) {
            showError('All fields are required');
            return;
        }

        const formDatas: FormData = new FormData();

        formDatas.append('author', assetDetails.authorName);
        formDatas.append('asset_name', assetDetails.assetName);
        formDatas.append('user_id', auth.user_id!);
        formDatas.append('asset_description', assetDetails.assetDescription);
        formDatas.append('xrp_address', assetDetails.xrpAddress);
        formDatas.append('client_secret', secret);
        formDatas.append('image',  imageData);


        setIsLoading(true);
        apiService.postFormData({
            url: "assets/create",
            data: formDatas,
            store: { token: auth.token, user_id: auth.user_id },
            needAuth: true,
            extraHeaders: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                showSuccess('NFT created successfully');
                setPreviewImageUrl(null);
                setImageData(null);
                setSecret('');
                setAssetDetails({
                    authorName: '',
                    assetName: '',
                    assetDescription: '',
                    xrpAddress: '',
                });
                navigate('/your-collecty-vault');
            }).catch((error: any) => {
                showError('Error creating NFT');
            }).finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className='w-full h-full text-black'>
            <div className='flex flex-col items-start space-y-9'>
                <div className='space-y-10'>
                    <div className='text-white'>
                        <GlobalInput
                            id='authorName'
                            placeholder='Author Name'
                            type='text'
                            label='Author Name'
                            value={assetDetails.authorName}
                            disabled={false}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <GlobalInput
                            id='assetName'
                            placeholder='Asset Name'
                            type='text'
                            label='Asset Name'
                            value={assetDetails.assetName}
                            disabled={false}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <GlobalInput
                            id='assetDescription'
                            placeholder='Asset Description'
                            type='text'
                            label='Asset Description'
                            value={assetDetails.assetDescription}
                            disabled={false}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <GlobalInput
                            id='xrpAddress'
                            placeholder='XRP Address'
                            type='text'
                            label='XRP Address'
                            value={assetDetails.xrpAddress}
                            disabled={false}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <GlobalInput
                            id='secret'
                            placeholder='Secret'
                            type='password'
                            label='Secret'
                            value={secret}
                            disabled={false}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <input id="file" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} />
                {previewImageUrl && <img src={previewImageUrl} alt="Aperçu" style={{ width: 200, height: 200, marginTop: 10 }} />}
                <button className='text-white ring-2 p-2 mt-3 rounded-sm ring-collecty-p hover:bg-collecty-p' onClick={() => createPainting()} disabled={isLoading}>
                    Create painting
                </button>
            </div>
        </div>
    );
}

export default CreatePaintingForm;