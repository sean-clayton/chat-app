import React, { Component } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import Messages from "./Messages";

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: null
    };
  }
  async componentDidMount() {
    const {
      data: { included: [{ attributes: { username } }] }
    } = await axios.post(`${API_ENDPOINT}/sessions`);

    this.setState({
      username
    });
  }
  render() {
    return (
      <div>
        <p>{this.state.username}</p>
        <Messages />
      </div>
    );
  }
}

export default App;
