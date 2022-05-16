// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { MessageRenderer, FluentThemeProvider, MessageProps, MessageThread } from '@azure/communication-react';
import { Divider } from '@fluentui/react-northstar';
import React from 'react';

export const MessageThreadWithCustomMessagesExample: () => JSX.Element = () => {
  // As an example, we want to use render custom message as a Divider.
  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType === 'custom') {
      return <Divider content={messageProps.message.content} color="brand" important />;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
