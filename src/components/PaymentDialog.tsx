import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ParkingSpace } from '../types';
import { initiatePayment } from '../services/mpesa';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  parkingSpace: ParkingSpace;
  onPaymentComplete: () => void;
}

export default function PaymentDialog({
  open,
  onClose,
  parkingSpace,
  onPaymentComplete,
}: PaymentDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duration, setDuration] = useState(1); // Default 1 hour
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = parkingSpace.pricePerHour * duration;

  const handlePayment = async () => {
    if (!phoneNumber.match(/^254\d{9}$/)) {
      setError('Please enter a valid phone number in the format 254XXXXXXXXX');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await initiatePayment(
        totalAmount,
        phoneNumber,
        parkingSpace.spaceNumber,
        duration
      );

      if (response.ResponseCode === '0') {
        onPaymentComplete();
        onClose();
      } else {
        setError(response.ResponseDescription);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay for Parking Space {parkingSpace.spaceNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Duration</InputLabel>
            <Select
              value={duration}
              label="Duration"
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => (
                <MenuItem key={hours} value={hours}>
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ my: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body1" gutterBottom>
              Price per hour: KES {parkingSpace.pricePerHour}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Duration: {duration} {duration === 1 ? 'hour' : 'hours'}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              Total Amount: KES {totalAmount}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Phone Number"
            placeholder="254XXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="normal"
            helperText="Enter your M-Pesa phone number starting with 254"
            error={!!error}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : `Pay KES ${totalAmount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 