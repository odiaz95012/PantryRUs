import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Inventory } from '../types';
import ConfirmUpdateModal from './ConfirmUpdateModal';
import DeleteModal from './DeleteModal';

type Props = {
    inventory: Inventory;
};

export default function ImgMediaCard(props: Props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            {<CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={props.inventory.image ? props.inventory.image : "/no-image.png"} 
            />}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.inventory.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Quantity: {props.inventory.quantity}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <ConfirmUpdateModal quantity={props.inventory.quantity.toString()} itemName={props.inventory.name}/>
                <DeleteModal itemQuantity={props.inventory.quantity} itemName={props.inventory.name} itemImage={props.inventory.image!}/>
            </CardActions>
        </Card>
    );
}