import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Autocomplete,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ParkingSpace } from '../types';

// Mock data for cities and streets (you would fetch this from an API)
const KENYA_CITIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Malindi',
  'Kitale',
  'Garissa',
  'Kakamega',
];

const MOCK_STREETS: { [key: string]: string[] } = {
  'Nairobi': [
    'Kenyatta Avenue',
    'Moi Avenue',
    'Tom Mboya Street',
    'Kimathi Street',
    'Mama Ngina Street',
    'Harambee Avenue',
    'City Hall Way',
    'Muindi Mbingu Street',
  ],
  'Mombasa': [
    'Moi Avenue',
    'Digo Road',
    'Nyerere Avenue',
    'Nkrumah Road',
  ],
};

interface SidebarProps {
  selectedSpace: ParkingSpace | null;
  onCityChange: (city: string | null) => void;
  onStreetChange: (street: string | null) => void;
  onBookingRequest: (space: ParkingSpace) => void;
}

export default function Sidebar({
  selectedSpace,
  onCityChange,
  onStreetChange,
  onBookingRequest,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCityChange = (city: string | null) => {
    setSelectedCity(city);
    setSelectedStreet(null);
    onCityChange(city);
  };

  const handleStreetChange = (street: string | null) => {
    setSelectedStreet(street);
    onStreetChange(street);
  };

  const drawerContent = (
    <Box sx={{ width: isMobile ? '100vw' : 300, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Find Parking</Typography>
        {isMobile && (
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <List>
        <ListItem>
          <Autocomplete
            fullWidth
            options={KENYA_CITIES}
            value={selectedCity}
            onChange={(_, newValue) => handleCityChange(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select City" variant="outlined" />
            )}
          />
        </ListItem>

        <ListItem>
          <Autocomplete
            fullWidth
            options={selectedCity ? MOCK_STREETS[selectedCity] || [] : []}
            value={selectedStreet}
            onChange={(_, newValue) => handleStreetChange(newValue)}
            disabled={!selectedCity}
            renderInput={(params) => (
              <TextField {...params} label="Select Street" variant="outlined" />
            )}
          />
        </ListItem>

        {selectedSpace && (
          <ListItem>
            <Box width="100%">
              <Typography variant="subtitle1" gutterBottom>
                Selected Spot: {selectedSpace.spaceNumber}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Status: {selectedSpace.status}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Price: KES {selectedSpace.pricePerHour}/hour
              </Typography>
              {selectedSpace.status === 'available' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => onBookingRequest(selectedSpace)}
                  sx={{ mt: 2 }}
                >
                  Pay Now
                </Button>
              )}
            </Box>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && !isOpen && (
        <IconButton
          sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, bgcolor: 'background.paper' }}
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isMobile ? '100%' : 300,
            height: '100%',
            zIndex: theme.zIndex.drawer,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
} 