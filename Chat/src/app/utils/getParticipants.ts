// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantListParticipant } from '@azure/communication-react';

export const getParticipants = async (threadId: string): Promise<ParticipantListParticipant[]> => {
  const getRequestOptions = {
    method: 'GET'
  };
  return new Promise<ParticipantListParticipant[]>((resolve) => {
    fetch('/getParticipants/' + threadId, getRequestOptions)
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        console.error('Failed at getting emoji, Error: ', error);
        // Emoji defaults to '' if there was an error retrieving it from server.
      });
  });
};
