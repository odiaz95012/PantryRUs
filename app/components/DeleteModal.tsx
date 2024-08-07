"use client";
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Delete from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Alert from '@mui/material/Alert';
import AWS from 'aws-sdk';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    display: 'flex', // Enable flexbox
    flexDirection: 'column', // Stack children vertically
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
};

type Props = {
    itemName: string;
    itemQuantity: number;
    itemImage: string;
};

export default function DeleteModal(props: Props) {
    const [open, setOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const deleteFromS3 = async () => {
        try {
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: 'us-west-1',
            });
            const getImageFileName = (url: string) => {
                const urlParts = url.split('/');
                return urlParts[urlParts.length - 1];
            }
            // Define the parameters
            const params = {
                Bucket: 'pantry-r-us', // Replace with your bucket name
                Key: getImageFileName(props.itemImage), // Replace with the path to your file in the bucket
            };

            // Call S3 to delete the file
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log("Error deleting file:", err);
                } else {
                    console.log("File deleted successfully:", data);
                }
            });
        } catch (error) {
            setIsError(true);
        }
    }
    const removeItem = async () => {
        try {
            // Delete the image from S3
            await deleteFromS3();
            // Reference to the specific document with itemName as the ID
            const itemRef = doc(db, 'inventory', props.itemName);

            // Delete the document
            await deleteDoc(itemRef);

            console.log('Item successfully removed!');
            setIsSuccess(true);
        } catch (error) {
            console.error('Error removing item: ', error);
            setIsError(true);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
        }
    }, [isSuccess]);


    return (
        <div>
            <Button onClick={handleOpen} color='error'>Remove</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1 id="modal-modal-title" className='theme-dark' style={{ fontSize: '1.75rem' }}>
                        Remove Inventory Item
                    </h1>
                    <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '1.25rem', color: 'rgba(255, 0, 0, 0.8);' }} variant='caption'>
                        Are you sure you want to remove this item?
                    </Typography>
                    <Grid container direction="row" alignItems="center" spacing={2} sx={{ width: '100%', margin: '0 auto' }}>
                        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }} alignItems="center" justifyContent="center">
                            {isError && <Alert icon={<CloseIcon fontSize="inherit" />} severity="error" sx={{ width: '100%' }}>
                                There was an error removing the item to the pantry. Please try again.
                            </Alert>

                            }
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ width: '100%', margin: '0 auto' }}
                    >
                        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }}>
                            <IconButton
                                onClick={removeItem}
                                color="error"
                                aria-label="confirm"
                                size="small"
                                sx={{
                                    borderRadius: 1, // This makes it rectangular
                                    mt: 1.5,
                                    padding: '8px 16px', // Adjust padding for better appearance
                                    backgroundColor: 'error.main', // Set background color
                                    color: 'white', // Set text/icon color
                                    '&:hover': {
                                        backgroundColor: 'error.dark', // Darken on hover
                                    },
                                }}
                            >
                                Remove <Delete sx={{ ml: 0.5 }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }}>
                            <IconButton
                                onClick={handleClose}
                                color="primary"
                                aria-label="confirm"
                                size="small"
                                sx={{
                                    borderRadius: 1, // This makes it rectangular
                                    mt: 1.5,
                                    padding: '8px 16px', // Adjust padding for better appearance
                                    backgroundColor: 'primary.main', // Set background color
                                    color: 'white', // Set text/icon color
                                    '&:hover': {
                                        backgroundColor: 'primary.dark', // Darken on hover
                                    },
                                }}
                            >
                                Cancel <CloseIcon sx={{ ml: 0.5 }} />
                            </IconButton>
                        </Grid>
                    </Grid>

                </Box>
            </Modal>
        </div>
    );
}