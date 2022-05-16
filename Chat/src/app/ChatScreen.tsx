// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter,
  fromFlatCommunicationIdentifier,
  MessageProps,
  MessageRenderer,
  ParticipantListParticipant
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';

import { ChatHeader } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';
import { ChatParticipants } from './ChatParticipants';
import { getExistingThreadIdFromURL } from './utils/getExistingThreadIdFromURL';
import { getParticipants } from './utils/getParticipants';
import { translateText, Translations } from './utils/TranslateText';
import { Divider } from '@fluentui/react-northstar';
import { LineStyle24Regular } from '@fluentui/react-icons';
import { MessageThreadWithCustomMessagesExample } from './MessageRender';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  translateLanguage: string;
  endChatHandler(isParticipantRemoved: boolean): void;
  errorHandler(): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, translateLanguage, errorHandler, endChatHandler } = props;

  const adapterRef = useRef<ChatAdapter>();
  const [adapter, setAdapter] = useState<ChatAdapter>();
  const [hideParticipants, setHideParticipants] = useState<boolean>(false);
  const { currentTheme } = useSwitchableFluentTheme();
  const [participantsList, setParticipants] = useState<ParticipantListParticipant[]>();

  useEffect(() => {
    (async () => {
      const adapter = await createAzureCommunicationChatAdapter({
        endpoint: endpointUrl,
        userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
        displayName: displayName,
        credential: createAutoRefreshingCredential(userId, token),
        threadId: threadId
      });
      if (threadId) {
        getParticipants(threadId).then((data) => {
          console.log(data.map((o) => console.log(o)));
          setParticipants(data);
        });
      }
      adapter.on('participantsRemoved', (listener) => {
        // Note: We are receiving ChatParticipant.id from communication-signaling, so of type 'CommunicationIdentifierKind'
        // while it's supposed to be of type 'CommunicationIdentifier' as defined in communication-chat
        const removedParticipantIds = listener.participantsRemoved.map(
          (p) => (p.id as CommunicationUserIdentifier).communicationUserId
        );
        if (removedParticipantIds.includes(userId)) {
          const removedBy = (listener.removedBy.id as CommunicationUserIdentifier).communicationUserId;
          endChatHandler(removedBy !== userId);
        }
      });
      adapter.on('messageReceived', (listener) => {
        console.log(listener.message.content?.message);
        listener.message.content?.message?.toLocaleUpperCase();
        const a = (listener.message.sender as CommunicationUserIdentifier).communicationUserId;
        console.log(userId);
        if (listener.message.content?.message !== undefined && a !== userId) {
          translateText(listener.message.content?.message, translateLanguage).then((data) => {
            if (listener.message.content?.message !== undefined) {
              localStorage.setItem(listener.message.content.message, data.translations[0].text);
              adapter.sendReadReceipt(listener.message.id);
            }
          });
        }
      });
      /*adapter.on('participantsAdded', () => {
        const threadId = getExistingThreadIdFromURL();
        if (threadId) {
          getParticipants(threadId).then((data) => {
            console.log(data.map((o) => console.log(o)));
            setParticipants(data);
          });
        }
      });*/
      adapter.on('error', (e) => {
        console.error(e);
        errorHandler();
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [displayName, endpointUrl, threadId, token, userId, errorHandler, endChatHandler, hideParticipants]);

  if (adapter) {
    const onFetchAvatarPersonaData = (userId): Promise<AvatarPersonaData> =>
      fetchEmojiForUser(userId).then(
        (emoji) =>
          new Promise((resolve) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: getBackgroundColor(emoji)?.backgroundColor
            });
          })
      );
    const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
      if (messageProps.message.messageType === 'chat') {
        if (messageProps.message.content !== undefined) {
          const a = localStorage.getItem(messageProps.message.content);
          if (a) {
            return (
              <div>
                <b>{a}</b>
              </div>
            );
          } else {
            return (
              <div>
                <b>{messageProps.message.content}</b>
              </div>
            );
          }
        }
      }
      /*  if (messageProps.message.content !== undefined) {
           translateText(messageProps.message.content).then((data) => {
             return <div>{data.translations[0].text} </div>;
           });
         }
      }*/

      return defaultOnRender ? defaultOnRender(messageProps) : <></>;
    };
    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatCompositeContainerStyle}>
          <ChatComposite
            adapter={adapter}
            fluentTheme={currentTheme.theme}
            options={{ topic: false }}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onRenderMessage={onRenderMessage}
          />
        </Stack.Item>
        <ChatHeader
          isParticipantsDisplayed={hideParticipants !== true}
          onEndChat={() => adapter.removeParticipant(userId)}
          setHideParticipants={setHideParticipants}
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
