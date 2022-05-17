// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack } from '@fluentui/react';
import { paneButtonContainerStyle } from './styles/ChatHeader.styles';
import { ParticipantList, ParticipantListParticipant } from '@azure/communication-react';

export type ChatParticipantsProps = {
  isParticipantsDisplayed: boolean;
  participants: ParticipantListParticipant[] | undefined;
};

export const ChatParticipants = (props: ChatParticipantsProps): JSX.Element => {
  return (
    <Stack>
      <div className={paneButtonContainerStyle}>
        {props.isParticipantsDisplayed && props.participants !== undefined && (
          <div>
            teqsdf
            <ParticipantList participants={props.participants}></ParticipantList>
          </div>
        )}
      </div>
    </Stack>
  );
};
