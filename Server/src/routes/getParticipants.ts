// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import * as express from 'express';
import { getEndpoint } from '../lib/envHelper';
import { threadIdToModeratorCredentialMap } from '../lib/chat/threadIdToModeratorTokenMap';
import { CommunicationUserIdentifier } from '@azure/communication-common';

const router = express.Router();

interface Participant {
  displayName: string;
  userId: string;
}

router.get('/:threadId', async function (req, res, next) {
  const threadId = req.params['threadId'];
  const moderatorCredential = threadIdToModeratorCredentialMap.get(threadId);

  const chatClient = new ChatClient(getEndpoint(), moderatorCredential);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  const participants = chatThreadClient.listParticipants().byPage();
  let participantList: Participant[] = [];
  (async () => {
    for await (const p of participants) {
      const val = await p;
      for (const a of val) {
        if (participantList !== undefined) {
          const user: Participant = {
            displayName: a.displayName,
            userId: (a.id as CommunicationUserIdentifier).communicationUserId
          };
          participantList.push(user);
          console.log(user);
        }
      }
    }
    res.send(JSON.stringify(participantList));
  })();
});

export default router;
