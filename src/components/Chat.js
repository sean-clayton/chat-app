import React from "react";
import g from "glamorous";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

const Input = g.input({
  flex: 1,
  padding: "0.75em 1.25em",
  borderRadius: "9999px",
  border: "2px solid #ddd",
  boxShadow: "0 0 0 transparent",
  transition: ".1s ease box-shadow",
  ":hover": {
    boxShadow: "0 .5em .5em rgba(0,0,0,.05)"
  },
  ":focus": {
    border: "2px solid #7cf",
    boxShadow: "0 .5em .5em rgba(0,0,0,.05)"
  }
});

const Button = g.button(
  {
    padding: "0.75em 1.25em",
    border: "none",
    borderRadius: "9999px",
    color: "#fff",
    cursor: "pointer"
  },
  ({ disabled }) => ({
    backgroundColor: disabled ? "#ddd" : "#0d6"
  })
);

const ChatFormWrapper = g.form({
  display: "flex",
  justifyContent: "space-between",
  padding: "1em",
  backgroundColor: "rgba(255,255,255,.5)",
  borderRadius: "0 0 .25em .25em",
  boxShadow: "inset 0 1px 0 rgba(0,0,0,.1)"
});

// const ChatMessage

export const ChatList = g.ul({
  backgroundColor: "#fff",
  display: "flex",
  flex: 1
});

export const ChatMessage = ({
  message: { attributes: { message, created_at } }
}) => (
  <li>
    {message} {created_at}
  </li>
);

export const ChatSubmit = props => (
  <Button type="submit" {...props}>
    Submit
  </Button>
);

export const ChatInput = ({ message, updateMessage, ...props }) => (
  <Input
    {...props}
    name="message"
    type="text"
    value={message}
    autoComplete="off"
    onChange={e => updateMessage(e.target.value)}
  />
);

export class ChatMessages extends React.Component {
  state = {
    messages: []
  };

  async componentDidMount() {
    const { data: { data: messages } } = await this.props.getMessages();
    this.setState({
      messages
    });
  }
  render() {
    return this.props.render(this.state.messages);
  }
}

export class ChatForm extends React.Component {
  state = {
    message: ""
  };
  submitHandler = async e => {
    e.preventDefault();
    const message = this.state.message;
    this.setState({
      message: ""
    });
    await this.props.sendMessage(message);
  };
  updateMessage = message => {
    this.setState({
      message
    });
  };
  render() {
    const children = React.Children.map(this.props.children, child => {
      switch (child.type) {
        case ChatInput:
          return React.cloneElement(child, {
            ...child.props,
            message: this.state.message,
            updateMessage: this.updateMessage,
            disabled: this.props.disabled
          });
        case ChatSubmit:
          return React.cloneElement(child, {
            ...child.props,
            disabled: this.props.disabled
          });
        default:
          return child;
      }
    });
    return (
      <ChatFormWrapper onSubmit={this.submitHandler}>
        {children}
      </ChatFormWrapper>
    );
  }
}

export class ChatProvider extends React.Component {
  sendMessage = async message => {
    await axios.post(`${API_ENDPOINT}/messages`, {
      data: {
        data: {
          type: "messages",
          attributes: {
            message
          }
        }
      }
    });
    await this.getMessages();
  };
  getMessages = async () => axios.get(`${API_ENDPOINT}/messages`);
  render() {
    const children = React.Children.map(this.props.children, child => {
      if (child) {
        switch (child.type) {
          case ChatMessages:
            return React.cloneElement(child, {
              getMessages: this.getMessages
            });
          case ChatForm:
            return React.cloneElement(child, {
              sendMessage: this.sendMessage
            });
          default:
            return child;
        }
      } else {
        return null;
      }
    });
    return children;
  }
}
