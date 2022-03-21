import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
// MUI
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { red, grey } from '@mui/material/colors';
// sweetalert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// Components
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Pin from '../Pin';
import PinDetail from '../PinDetail';
import CreatePin from '../CreatePin';
import Profile from '../Profile';
import NotFound from '../NotFound';
import Loading from '../Loading';
// Service
import PinService from '../../services/pin.service';

const drawerWidth = 200;

const Home = (props) => {
  const { currentUser } = props;

  const location = useLocation();

  const CustomSwal = withReactContent(Swal);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRandomPins();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const fisherYatesShuffle = (arr) => {
    const randomPins = [...arr];
    for(let i = randomPins.length - 1 ; i > 0 ; i--) {
      let j = Math.floor( Math.random() * (i + 1) ); //random index
      [randomPins[i], randomPins[j]] = [randomPins[j], randomPins[i]]; // swap
    }
    return randomPins;
  }

  const getRandomPins = () => {
    setLoading(true);
    PinService.getPins()
      .then(res => {
        setPins(fisherYatesShuffle(res.data));
        setLoading(false);
      })
      .catch(e => console.log(e))
  }

  const handleCategoryActive = (category) => {
    setLoading(true);
    handleDrawerToggle();
    if(category === "All") {
      PinService.getPins()
      .then(res => {
        setPins(res.data);
        setLoading(true);
      })
      .catch(e => console.log(e))
    } else {
      PinService.getCategory(category)
        .then(res => {
          setPins(res.data);
          setLoading(true);
        })
        .catch((e) => console.log(e))
    }
  }

  const handleDownloadPin = (pinUrl, pinTitle, e) => {
    e.preventDefault();
    const cutUrl = pinUrl.split('/').splice(2)[4];
    const cutUrl_img = pinUrl.split('/').splice(2)[6];
    const downloadUrl = `https://res.cloudinary.com/ishare/image/upload/${cutUrl}/iSHARE_Pin/${cutUrl_img}`;
    PinService.downloadPin(downloadUrl, pinTitle);
  }

  const handleSavePin = (_id, e) => {
    e.preventDefault();
    CustomSwal
      .fire({
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Save',
        confirmButtonColor: red[600],
        cancelButtonColor: grey[500],
        title: "Save the Pin?",
      })
      .then((result) => {
        if (result.isConfirmed) {
          PinService.savePin(_id, currentUser.user._id)
            .then(res => {
              CustomSwal
                .fire({
                  icon: 'success',
                  title: res.data,
                  showConfirmButton: false,
                  timer: 1500
                })
            })
            .catch(err => console.log(err))
        }
      })
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Sidebar
        handleCategoryActive={handleCategoryActive}
        setPins={setPins}
        currentUser={currentUser}
        mobileOpen={mobileOpen}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Navbar
        setPins={setPins}
        currentUser={currentUser}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />

        {
          loading ? <Loading/> : <Outlet/>
        }

        <Routes>
          <Route
            path='/'
            element={
              <Pin
                handleSavePin={handleSavePin}
                handleDownloadPin={handleDownloadPin}
                pins={pins}
                setPins={setPins}
                handleDrawerToggle={handleDrawerToggle}
              />
            }
          />
          <Route
            path='/:category'
            element={
              <Pin
                handleSavePin={handleSavePin}
                handleDownloadPin={handleDownloadPin}
                pins={pins}
                setPins={setPins}
                handleDrawerToggle={handleDrawerToggle}
              />
            }
          />
          <Route
            path='/profile/:creatorID'
            element={
              <Profile
                handleSavePin={handleSavePin}
                handleDownloadPin={handleDownloadPin}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path='/createPin'
            element={
              <CreatePin setPins={setPins} currentUser={currentUser}/>
            }
          />
          <Route
            path="/PinDetail/:pinID"
            element={
              <PinDetail
                loading={loading}
                setLoading={setLoading}
                handleSavePin={handleSavePin}
                handleDownloadPin={handleDownloadPin}
                fisherYatesShuffle={fisherYatesShuffle}
                currentUser={currentUser}
              />
            }
          />
          <Route path="/notfound" element={<NotFound />}/>
          <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>

      </Box>

    </Box>
  );
}

export default Home;
