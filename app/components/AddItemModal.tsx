"use client";
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UpdateQuantity from './UpdateQuantity';
import "../styles.css";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { animated, useSpring } from '@react-spring/web';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Alert from '@mui/material/Alert';
import AWS from 'aws-sdk';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.default',
    border: '2px solid #000',
    color: 'text.primary',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type Props = {
    handleParentClose?: () => void;
    itemName: string;
    itemQuantity: string;
    itemImage?: File;
    previewUrl?: string;
    clearFields?: () => void;
};

function ChildModal(props: Props) {
    const [open, setOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [itemImageUrl, setItemImageUrl] = React.useState('');
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const springs = useSpring({
        from: { y: -100 },
        to: { y: 0 },
    });




   const insertItem = async () => {
    try {
        // Upload the file to S3 and get the URL
        const imageUrl = await uploadFileToS3(props.itemImage!);
        setItemImageUrl(imageUrl!);
        // Create an item object with the quantity attribute and the image URL
        const item = {
            quantity: parseInt(props.itemQuantity),
            image: imageUrl
        };

        // Create a reference to the Firestore document
        const itemRef = doc(db, 'inventory', props.itemName);

        // Set the document in Firestore
        await setDoc(itemRef, item);

        setIsSuccess(true);
        props.clearFields && props.clearFields();
    } catch (error) {
        setIsError(true);
        console.error(error);
    }
};



    useEffect(() => {
        if (isSuccess) {
            props.handleParentClose && props.handleParentClose();
        }
    }, [isSuccess]);


    // Function to upload a file to S3
    const uploadFileToS3 = async (file: File) => {
        const fileExtension = file.name.split('.').pop(); // Get file extension

        const s3 = new AWS.S3({
            accessKeyId: 'AKIAUADVGEK76NIEZUYP',
            secretAccessKey: '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',
            region: 'us-west-1',
          });
      
          const params = {
            Bucket: 'pantry-r-us',
            Key: `${props.itemName.replace(' ', '')}.${fileExtension}`,
            Body: file
          };
      
          try {
            const data = await s3.upload(params).promise(); // Wait for the upload to finish
            return data.Location;
          } catch (error) {
            setIsError(true);
          }
    };

    return (
        <React.Fragment>
            <Button
                onClick={handleOpen}
                variant="contained"
                color="success"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px' // Adjust padding as needed
                }}
            >
                Add Item to Pantry
                <AddIcon sx={{ fontSize: 25, marginLeft: 1 }} />
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box
                    sx={{
                        ...style,
                        width: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: 'fit-content',
                    }}
                >
                    <h5 style={{ fontSize: '2.25rem' }} className="theme-dark">
                        Confirm Item Details
                    </h5>
                    <Typography
                        id="child-modal-description"
                        variant="caption"
                        sx={{ textAlign: 'center', padding: 2, fontSize: '.75rem' }}
                    >
                        Please confirm the details of the item you are adding:
                    </Typography>
                    <Grid container direction="row" alignItems="center" spacing={2} sx={{ width: '100%', margin: '0 auto' }}>
                        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }} alignItems="center" justifyContent="center">
                            {isError && <Alert icon={<CloseIcon fontSize="inherit" />} severity="error" sx={{width: '100%'}}>
                                There was an error adding the item to the pantry. Please try again.
                            </Alert>

                            }
                        </Grid>
                    </Grid>
                    <Box sx={{ width: '100%', textAlign: 'left', mt: 2, mb: 2 }}>
                        <Grid container direction="row" alignItems="center" spacing={2} sx={{ width: '100%', margin: '0 auto' }}>
                            <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
                                    <strong>Name:</strong>
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.95rem', textAlign: 'center' }}>
                                    {props.itemName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
                                    <strong>Quantity:</strong>
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.95rem', textAlign: 'center' }}>
                                    {props.itemQuantity}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8} lg={12} sx={{ width: '100%', textAlign: 'center' }} alignItems="center" justifyContent="center">
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body1" sx={{ fontSize: '1.25rem' }}>
                                        <strong>Item Image:</strong>
                                    </Typography>
                                    <img
                                        src={props.previewUrl}
                                        alt="Item Preview"
                                        style={{ width: '30%', height: 'auto', borderRadius: '5px' }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container direction="row" justifyContent="center" spacing={2}>
                        <Grid item xs={12} sm={10} md={8} lg={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <animated.div style={{ ...springs }}>
                                    <IconButton
                                        onClick={insertItem}
                                        color="success"
                                        edge="end"
                                        aria-label="confirm"
                                        size="small"
                                        sx={{
                                            borderRadius: 1,
                                            padding: '8px 16px',
                                            backgroundColor: 'success.main',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'success.dark',
                                            },
                                        }}
                                    >
                                        Confirm <CheckIcon sx={{ ml: 0.5 }} />
                                    </IconButton>
                                </animated.div>
                                <animated.div style={{ ...springs }}>
                                    <IconButton
                                        onClick={props.handleParentClose && props.handleParentClose}
                                        color="primary"
                                        aria-label="cancel"
                                        size="small"
                                        sx={{
                                            borderRadius: 1,
                                            padding: '8px 16px',
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            },
                                        }}
                                    >
                                        Cancel <CloseIcon sx={{ ml: 0.5 }} />
                                    </IconButton>
                                </animated.div>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Modal>
        </React.Fragment>
    );
}

export default function AddItemModal() {
    const [open, setOpen] = React.useState(false);
    const [itemName, setItemName] = React.useState('');
    const [itemQuantity, setItemQuantity] = React.useState('');
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleQuantityChange = (quantity: string) => {
        setItemQuantity(quantity);
    };

    const [itemImage, setItemImage] = useState<File | null>();
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the first file

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }
            setItemImage(file);

            // Create a preview URL for the image
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const clearFields = () => {
        setItemName('');
        setItemQuantity('');
        setItemImage(null);
        setPreviewUrl('');
    }


    return (
        <>
            <IconButton onClick={handleOpen}>
                <AddCircleIcon sx={{ fontSize: 50 }} />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{
                    ...style,
                    width: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '150px',
                }}>
                    <h6 style={{ fontSize: '2.25rem', padding: 3 }} className='theme-dark'>
                        Add Item to Pantry
                    </h6>
                    <h1 style={{ fontSize: '1.5rem', padding: 10 }} className='theme-dark'>
                        Input Item Details
                    </h1>
                    <Typography
                        id="parent-modal-description"
                        variant="caption"
                        sx={{ textAlign: 'center', fontSize: '0.85rem' }}
                    >
                        Please enter the information for the item you would like to add into the pantry.
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ width: '100%', margin: '0 auto' }}
                    >
                        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }} alignItems="center" justifyContent="center">
                            <label style={{ display: 'block', marginBottom: '10px' }}>Item Name</label>
                            <TextField
                                id="item-name"
                                label="Item Name"
                                variant="outlined"
                                required
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }} alignItems="center" justifyContent="center">
                            <label style={{ display: 'block', marginBottom: '10px' }}>Item Quantity</label>
                            <UpdateQuantity updateQuantity={handleQuantityChange} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%' }} alignItems="center" justifyContent="center">
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}

                            >
                                Upload Image
                                <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                            </Button>
                        </Grid>

                    </Grid>

                    <Box padding={1.5}>
                        <ChildModal
                            handleParentClose={handleClose}
                            itemName={itemName}
                            itemQuantity={itemQuantity}
                            itemImage={itemImage!}
                            previewUrl={previewUrl}
                            clearFields={clearFields}
                        />
                    </Box>

                </Box>
            </Modal>
        </>
    );
}
