import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { deepPurple } from '@mui/material/colors';
// Styled
import { Search, SearchIconWrapper, StyledInputBase } from './index.styles';
// Service
import PinService from "../../services/pin.service";


const Navbar = (props) => {
  const { drawerWidth, handleDrawerToggle, currentUser, setPins } = props;

  const [searchInputs, setSearchPins] = useState("");

  const navigate = useNavigate();
  
  const handleSearch = (key) => {
    if(key === "Enter") {
      navigate('/');
      PinService.searchPins(searchInputs)
        .then(res => {
          setPins(res.data);
          setSearchPins("");
        })
        .catch(e => console.log(e));
    }
    return
  }

  return (
    <AppBar
      position="fixed"
      style={{boxShadow: "none", borderBottom: "1px solid #dbdbdb"}}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar style={{justifyContent: 'space-between', background: '#fff' }}>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            value={searchInputs}
            onChange={(e) => setSearchPins(e.target.value)}
            onKeyDown={(e) => handleSearch(e.key)}
          />
        </Search>

        <Box sx={{ flexGrow: 0, display: 'flex' }} justifyContent="space-around">
          <IconButton
            disableRipple
            sx={{
              p: 0,
              display: { xs: 'none', sm: 'flex' },
              ':hover': { backgroundColor: 'transparent' }
            }}
          >
            <Link className="react-link" to={`/profile/${currentUser?.user._id}`}>
              <Avatar
                alt="profile-avatar"
                variant="rounded"
                src={currentUser?.user.thumbnail}
                sx={{
                  bgcolor: deepPurple[500],
                  fontSize: "1.25rem"
                }}
              >
                {currentUser?.user.username.charAt(0)}
              </Avatar>
            </Link>
          </IconButton>

          <IconButton
            disableRipple
            sx={{
              ':hover': { backgroundColor: 'transparent' }
            }}
          >
            <Link to='/createPin'>
              <Avatar
                sx={{ bgcolor: '#7d879c' }}
                alt="Create"
                variant="rounded"
              >
                <AddIcon />
              </Avatar>
            </Link>
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  )
}

export default Navbar;