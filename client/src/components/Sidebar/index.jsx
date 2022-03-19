import { Link, NavLink } from "react-router-dom";
// MUI
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LandscapeIcon from '@mui/icons-material/Landscape';
import TourIcon from '@mui/icons-material/Tour';
import PaletteIcon from '@mui/icons-material/Palette';
import SportsIcon from '@mui/icons-material/Sports';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PetsIcon from '@mui/icons-material/Pets';
import MoreIcon from '@mui/icons-material/More';
import HomeIcon from '@mui/icons-material/Home';
import { deepPurple } from '@mui/material/colors';
// Logo
import Logo from '../Logo/Logo';

const categories = [
  { id: "1", text: "All", icon: <HomeIcon/>},
  { id: "2", text: "Cars", icon: <DirectionsCarIcon/>},
  { id: "3", text: "Food", icon: <RestaurantIcon/>},
  { id: "4", text: "Nature", icon: <LandscapeIcon/>},
  { id: "5", text: "Travel", icon: <TourIcon/>},
  { id: "6", text: "Art", icon: <PaletteIcon/>},
  { id: "7", text: "Sport", icon: <SportsIcon/>},
  { id: "8", text: "Fitness", icon: <FitnessCenterIcon/>},
  { id: "9", text: "Animals", icon: <PetsIcon/>},
  { id: "10", text: "Others", icon: <MoreIcon/>}
]

const Sidebar = (props) => {
  const { drawerWidth, handleDrawerToggle, window, mobileOpen, currentUser, handleCategoryActive } = props;
  
  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
          
        >
          <Link
            to="/"
            style={{width: '6rem'}}
            onClick={() => handleCategoryActive("All")}
          >
            <Logo/>
          </Link>
        </Typography>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
          <Link
            to="/"
            style={{width: '6rem'}}
            onClick={() => handleCategoryActive("All")}
          >
            <Logo/>
          </Link>
        </Typography>
      </Toolbar>
      
      <Divider />
      
      <List>
        {categories.map((category) => (
          <NavLink
            key={category.id}
            to={`/${category.text}`}
            className={(navData) => navData.isActive ? "react-navlink active" : "react-navlink" }
            onClick={() => handleCategoryActive(category.text)}
          >
            <ListItemButton>
              <ListItemIcon>
                {category.icon}
              </ListItemIcon>
              <ListItemText primary={category.text}/>
            </ListItemButton>
          </NavLink>
        ))}
      </List>

      <Divider />

      <Stack mt={2}>
        <IconButton
          disableRipple
          sx={{
            paddingLeft: ".5rem",
            display:"flex",
            justifyContent: "flex-start",
            ':hover': { backgroundColor: 'transparent' }
          }}
          onClick={handleDrawerToggle}
        >
          {
            currentUser && (
              <Link
                className="react-link"
                style={{display: "flex"}}
                to={`/profile/${currentUser.user._id}`}
              >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                  <Avatar
                    alt="profile-avatar"
                    src={currentUser.user.thumbnail}
                    sx={{
                      bgcolor: deepPurple[500],
                      fontSize: "1.25rem"
                    }}
                  >
                    {currentUser.user.username.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="button"
                    mt={.6}
                    sx={{ cursor: "pointer", textTransform: "none" }}
                  >
                    {currentUser.user.username}
                  </Typography>
                  <NavigateNextIcon/>
                </Stack>
              </Link>
            )
          }
        </IconButton>
      </Stack>
        
      
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        { drawer }
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar;