// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const sendEmojiRequest = async (identity: string, emoji: string, language: string): Promise<void> => {
  try {
    const postTokenRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Emoji: emoji, Language: language })
    };
    await (
      await fetch('/userConfig/' + identity, postTokenRequestOptions)
    ).json;
  } catch (error) {
    console.error('Failed at setting emoji, Error: ', error);
  }
};
