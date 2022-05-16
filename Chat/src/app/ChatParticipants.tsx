// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import { paneButtonContainerStyle } from './styles/ChatHeader.styles';
import { useTheme, ParticipantList, ParticipantListParticipant } from '@azure/communication-react';
import { getParticipants } from './utils/getParticipants';
import { getExistingThreadIdFromURL } from './utils/getExistingThreadIdFromURL';

export type ChatParticipantsProps = {
  isParticipantsDisplayed: boolean;
  participants: ParticipantListParticipant[] | undefined;
};

export const ChatParticipants = (props: ChatParticipantsProps): JSX.Element => {
  const theme = useTheme();


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
