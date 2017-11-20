import React from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

export const ChatSubmit = () => <button type="submit">Submit</button>;
export const ChatInput = () => <input type="text" />;

export class ChatMessages extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }
  async componentDidMount() {
    const { data: { data: messages } } = await this.props.getMessages();

    this.setState({
      messages
    });
  }
  render() {
    return (
      <pre>
        <code>{JSON.stringify(this.state.messages, null, 2)}</code>
      </pre>
    );
  }
}

export class ChatForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.submitHandler}>{this.props.children}</form>
    );
  }
}

export class ChatProvider extends React.Component {
  chatSubmitHandler = async e => {
    e.preventDefault();
    await axios.post(`${API_ENDPOINT}/messages`, {});
  };
  getMessages = async () => axios.get(`${API_ENDPOINT}/messages`);
  render() {
    const children = React.Children.map(this.props.children, child => {
      console.log({ type: child.type });
      switch (child.type) {
        case ChatMessages:
          return React.cloneElement(child, {
            getMessages: this.getMessages
          });
        case ChatForm:
          return React.cloneElement(child, {
            submitHandler: this.chatSubmitHandler
          });
        default:
          return child;
      }
    });
    return <div>{children}</div>;
  }
}
