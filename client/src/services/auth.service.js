import axios from "axios";

const API_USER_URL = "https://ishare-v1.herokuapp.com/auth";

class AuthService {
  getToken() {
    let token;
    if(localStorage.getItem("user")) {
      return token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = '';
      return token;
    }
  }
  signin(reqObj) {
    return axios.post(`${API_USER_URL}/signin`, reqObj);
  }
  signout() {
    localStorage.removeItem("user");
  }
  signup(reqObj) {
    return axios.post(`${API_USER_URL}/signup`, reqObj);
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getProfileUser(user_id) {
    const token = this.getToken();
    return axios.get( `${API_USER_URL}/profile/${user_id}`, { headers: { Authorization: token } } );
  }

  googleSignIn(googleData) {
    return axios.post(`${API_USER_URL}/google`, googleData);
  }
}

export default new AuthService();