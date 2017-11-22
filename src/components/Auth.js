import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

export class AuthProvider extends React.Component {
  state = {
    username: null
  };
  login = async () => {
    const {
      data: { included: [{ attributes: { username } }] }
    } = await axios.post(`${API_ENDPOINT}/sessions`);

    this.setState({
      username
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
      username: this.state.username
    });
  }
}
