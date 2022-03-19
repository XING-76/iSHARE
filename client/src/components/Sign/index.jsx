import { useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import GoogleIcon from '@mui/icons-material/Google';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
// react-google-login
import GoogleLogin from 'react-google-login';
// sweetalert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// Logo
import Logo from '../Logo/LogoW';
import shareVideo from '../../assets/share.mp4';
import { Wrapper } from './index.styles.js';
// Service
import AuthService from '../../services/auth.service';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#000000',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#000000',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#000000',
    },
    '&:hover fieldset': {
      borderColor: '#000000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000000',
    },
  },
});

const Sign = (props) => {
  const { setCurrentUser } = props;

  const [form, setForm] = useState("signIn");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const CustomSwal = withReactContent(Swal);

  const handleToggleForm = () => {
    form === "signIn" ? setForm("signUp") : setForm("signIn");
    setUsername("");
    setEmail("");
    setPassword("");
    setMessage("");
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDownSubmit = (key) => {
    if(key === "Enter") {
      handleSubmit();
    }
    return
  }

  const handleSubmit = () => {
    let reqObj = {};
    if(form === "signIn") {
      reqObj = { email, password };
      AuthService.signin(reqObj)
        .then(res => {
          if(res.data.token) {
            localStorage.setItem("user", JSON.stringify(res.data))
          }
          CustomSwal
            .fire({
              toast: true,
              icon: 'success',
              title: res.data.msg,
              position: 'bottom-left',
              showConfirmButton: false,
              timer: 2000
            })
            .then(() => {
              setCurrentUser(AuthService.getCurrentUser());
              navigate('/');
            })
        })
        .catch(error => setMessage(error.response.data));
    } else {
      reqObj = { username, email, password, role: "creator" };
      AuthService.signup(reqObj)
        .then((res) => {
          CustomSwal
            .fire({
              icon: 'success',
              title: res.data.title,
              text: res.data.text,
              showConfirmButton: false,
              timer: 3000
            })
            .then(() => {
              handleToggleForm();
            })
        })
        .catch(error => setMessage(error.response.data));
    }
  }

  const handleGoogleSignIn = (googleData) => {
    AuthService.googleSignIn(googleData.profileObj)
      .then(res => {
        if(res.data.token) {
          localStorage.setItem("user", JSON.stringify(res.data))
        }
        CustomSwal
          .fire({
            toast: true,
            icon: 'success',
            title: res.data.msg,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 2000
          })
          .then(() => {
            setCurrentUser(AuthService.getCurrentUser());
            navigate('/');
          })
      })
      .catch(error => setMessage(error.response.data));
  }

  const handleGoogleFailure = (result) => {
    CustomSwal
      .fire({
        icon: 'error',
        title: result.error,
        showConfirmButton: false,
        timer: 2000
      })
  };

  return (
    <Wrapper>
      <div className="sign-field">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          muted
          autoPlay
        />
        <div className="sign-form">
          <Typography
            variant="h6"
            noWrap
            component="p"
            sx={{ display: "block", width: "8rem", p: "1.25rem" }}
          >
            <Logo/>
          </Typography>
          {
            form === "signIn" ?
            (
              <Box
                className="signIn-form"
                component="form"
                sx={{
                  width: "280px",
                  bgcolor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  p: "2rem",
                  borderRadius: "1.25rem"
                }}
                noValidate
                autoComplete="off"
                onKeyDown={(e) => handleKeyDownSubmit(e.key)}
              >
                <Typography variant="h5" component="div" sx={{textAlign: "center"}}>
                  Sign In
                </Typography>
                <CssTextField
                  id="sign-in-email"
                  label="Email"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  fullWidth
                  size="small"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <CssTextField
                  id="sign-in-password"
                  label="Password"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {
                  message && (<Alert severity="error" sx={{marginTop: ".5rem"}}>{message}</Alert>)
                }
                <Stack spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    disableElevation
                    color="error"
                    sx={{textTransform: "none"}}
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                  >
                    Sign In
                  </Button>
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    cookiePolicy={'single_host_origin'}
                    onSuccess={handleGoogleSignIn}
                    onFailure={handleGoogleFailure}
                    render={renderProps => (
                      <Button
                        variant="contained"
                        disableElevation
                        color="info"
                        sx={{textTransform: "none"}}
                        startIcon={<GoogleIcon />}
                        onClick={renderProps.onClick}
                      >
                        Sign in with Google
                      </Button>
                    )}
                  />
                </Stack>
                <Typography
                  variant="button"
                  display="block"
                  component="a"
                  mt={2}
                  sx={{ textAlign: "center", cursor: "pointer", textTransform: "none" }}
                  onClick={handleToggleForm}
                >
                  Sign Up Here
                </Typography>
              </Box>
            ) :
            (
              <Box
                className="signUp-form"
                component="form"
                sx={{
                  width: "280px",
                  bgcolor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  p: "2rem",
                  borderRadius: "1.25rem"
                }}
                noValidate
                autoComplete="off"
                onKeyDown={(e) => handleKeyDownSubmit(e.key)}
              >
                <Typography variant="h5" component="div" sx={{textAlign: "center"}}>
                  Sign Up
                </Typography>
                <CssTextField
                  id="sign-up-username"
                  label="Username"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  fullWidth
                  size="small"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <CssTextField
                  id="sign-up-email"
                  label="Email"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  fullWidth
                  size="small"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <CssTextField
                  id="sign-up-password"
                  label="Password"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {
                  message && (<Alert severity="error" sx={{marginTop: ".5rem"}}>{message}</Alert>)
                }
                <Stack spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    disableElevation
                    color="error"
                    sx={{textTransform: "none"}}
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </Button>
                </Stack>
                <Typography
                  variant="button"
                  display="block"
                  component="a"
                  mt={2}
                  sx={{ textAlign: "center", cursor: "pointer", textTransform: "none" }}
                  onClick={handleToggleForm}
                >
                  Back to Sign In
                </Typography>
              </Box>
            )
          }
        </div>
      </div>
    </Wrapper>
  )
}


export default Sign;