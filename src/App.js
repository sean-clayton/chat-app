import React from "react";
import g from "glamorous";
import { AuthProvider } from "./Auth";
import { ChatProvider, ChatMessages, ChatForm, ChatInput, ChatSubmit, ChatList, ChatMessage } from "./Chat";

const MainContent = g.main({
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(0,0,0,.1)",
  borderRadius: ".25em",
  height: "100%",
  width: "100%",
  maxHeight: "32em",
  maxWidth: "48em",
  boxShadow: "0 1.5em 2em rgba(0,0,0,.05)"
});

const AppHeader = g.header({
  backgroundColor: "#07f",
  color: "#fff",
  padding: "1em",
  borderRadius: ".25em .25em 0 0",
  boxShadow: "inset 0 -1px 0 rgba(0,0,0,.1)"
});

const MessagesLoading = g.div({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fafafa",
  color: "#aaa"
});

class App extends React.Component {
  async componentDidMount() {
    await this.props.login();
  }

  render() {
    return (
      <MainContent>
        <AppHeader>{this.props.username ? this.props.username : "Logging In..."}</AppHeader>
        <ChatProvider username={this.props.username}>
          <ChatMessages
            render={messages =>
              messages.length ? (
                <ChatList>{messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}</ChatList>
              ) : (
                <MessagesLoading>Loading Messages...</MessagesLoading>
              )
            }
          />
          <ChatForm disabled={this.props.username === null}>
            <ChatInput placeholder={this.props.username ? "Type here" : "Logging In..."} />
            <ChatSubmit cta css={{ marginLeft: "1em" }} />
          </ChatForm>
        </ChatProvider>
      </MainContent>
    );
  }
}

export default () => <AuthProvider render={authUtils => <App {...authUtils} />} />;
