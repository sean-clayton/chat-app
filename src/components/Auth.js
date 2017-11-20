import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

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
  render() {
    return (
      this.props.render({
        login: this.login,
        logout: this.logout,
        username: this.state.username
      }) || null
    );
  }
}
