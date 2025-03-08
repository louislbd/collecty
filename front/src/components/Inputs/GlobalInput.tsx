import React from 'react';

interface GlobalInputProps {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    value?: string | number;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GlobalInput: React.FC<GlobalInputProps> = ({
    id,
    type = 'text',
    label,
    placeholder = 'Field',
    value,
    disabled,
    onChange
}) => {

    return (
        <div className='w-72 h-8 ring-0 outline-0 space-y-1 bg-opacity-80'>
            <p className='text-base text-white font-semibold'>{label} :</p>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                onChange={onChange}
                className={
                    `w-full h-full p-2 text-gray-800 focus:text-black
                    rounded-md border-none ring-transparent
                    focus:ring-1 focus:outline-collecty-p
                    border-b-2 border-b-collecty-p
                    `}
            />
        </div>
    );
};

export default GlobalInput;