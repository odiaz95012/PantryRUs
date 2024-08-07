import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Inventory } from '../types';


type Props = {
    inventory: Inventory[];
    onSearchChange: (filteredItems: Inventory[]) => void;
}

const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: string) => option,
});

export default function Search(props: Props) {
    const handleInputChange = (event: React.SyntheticEvent, value: string) => {
        // Filter the itemNames based on the input value
        const filteredItems = props.inventory.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        // Call the callback function with the filtered items
        props.onSearchChange(filteredItems);
    };
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={props.inventory.map((option) => option.name)}
            filterOptions={filterOptions}
            onInputChange={handleInputChange} // Handle input chang
            sx={{ width: '65%', padding: 2 }}
            renderInput={(params) => <TextField {...params} label={"Item"} />}

        />
    );
}