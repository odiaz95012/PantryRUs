"use client";
import * as React from 'react';
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
import { animated, useSpring } from '@react-spring/web';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { Alert } from '@mui/material';

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
  quantity: string;
  itemName: string;
  handleParentClose?: () => void;
};

function ChildModal(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
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

  async function updateItemQuantity(itemId: string, newQuantity: string) {
    try {
      const itemRef = doc(db, 'inventory', itemId);

      // Update the document
      await updateDoc(itemRef, {
        quantity: parseInt(newQuantity),
      });
      setIsSuccess(true);
      console.log('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating quantity:', error);
      setIsError(true);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      props.handleParentClose && props.handleParentClose();
    }
  }, [isSuccess, props]);

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Update</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 'fit-content',
          }}
        >
          <h5 style={{ fontSize: '2.25rem' }} className="theme-dark">
            Update
          </h5>
          {isError && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error" sx={{ width: '100%' }}>
              There was an error adding the item to the pantry. Please try again.
            </Alert>
          )}
          <Typography
            id="child-modal-description"
            variant="caption"
            sx={{ textAlign: 'center', padding: 2, fontSize: '.75rem' }}
          >
            Updated Quantity
          </Typography>
          <TextField inputProps={{ type: 'number' }} disabled value={props.quantity} color='success' />
          <Typography
            id="child-modal-description"
            variant="caption"
            sx={{ textAlign: 'center', padding: 2, fontSize: '.85rem' }}
          >
            Is this correct?
          </Typography>

          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: '100%', margin: '0 auto' }}
          >
            <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }} alignItems="center" justifyContent="center">
              <animated.div style={{ ...springs }}>
                <IconButton
                  onClick={() => updateItemQuantity(props.itemName, props.quantity)}
                  color="success"
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
            </Grid>
            <Grid item xs={12} sm={10} md={8} lg={6} sx={{ width: '100%' }}>
              <animated.div style={{ ...springs }}>
                <IconButton
                  onClick={props.handleParentClose && props.handleParentClose}
                  color="primary"
                  aria-label="confirm"
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
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function ConfirmUpdateModal(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [itemQuantity, setItemQuantity] = React.useState<string>(props.quantity); // Initialize with prop value

  const handleQuantityChange = (quantity: string) => {
    setItemQuantity(quantity);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Update</Button>
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
          <h6 style={{ fontSize: '2.25rem' }} className='theme-dark'>
            Update Stock
          </h6>
          <Typography
            id="parent-modal-description"
            variant="caption"
            sx={{ textAlign: 'center', fontSize: '0.85rem' }}
          >
            Please enter the updated quantity for this item.
          </Typography>
          <Typography
            id="quantity-label"
            variant="body1"
            sx={{ padding: 2.5, textAlign: 'center' }}
          >
            Quantity
          </Typography>
          <UpdateQuantity quantity={parseInt(itemQuantity)} updateQuantity={handleQuantityChange} />
          <Box padding={1.5}>
            <ChildModal quantity={itemQuantity} handleParentClose={handleClose} itemName={props.itemName} />
          </Box>
        </Box>
      </Modal>
    </>
  );
}
