import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

export const LogoutButton = ({ logout }) => (
  <button onClick={() => logout()}>Logout</button>
);

export const LoginButton = ({ login }) => (
  <button onClick={() => login()}>Login</button>
);

export class AuthProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null
    };
  }
  login = async () => {
    const {
      data: { included: [{ attributes: { username } }] }
    } = await axios.post(`${API_ENDPOINT}/sessions`);

    this.setState({
      username
    });
  };
  logout = () => {
    this.setState({
      username: null
    });
  };
  componentWillMount() {
    if (!this.props.render && !this.props.children) {
      throw new Error("A render prop or child must be provided!");
    }
  }
  render() {
    const render = this.props.render || this.props.children;
    return render({
      login: this.login,
      logout: this.logout,
      username: this.state.username
    });
  }
}
