import CreatePaintingForm from '../components/CreatePaintingForm';

function CreatePainting() {
    return (
        <div>
            <h1 className='text-3xl font-bold'>Create Painting:</h1>
            <div className='w-full h-[2px] rounded-sm bg-[#27AE60] my-4'></div>
            <CreatePaintingForm />
        </div>
    );
}

export default CreatePainting;