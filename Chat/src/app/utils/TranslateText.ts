// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const authKey = ''; // Replace with your key

export interface DeepLResponse {
  translations: Translation[];
}
export interface Translation {
  detected_source_language: string;
  text: string;
} 

export const translateText = async (input: string, language: string): Promise<DeepLResponse> => {
  const getRequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'auth_key=' + authKey + '&text=' + input + '&target_lang=' + language
  };
  return new Promise<DeepLResponse>((resolve) => {
    fetch('https://api.deepl.com/v2/translate?auth_key=9900521e-a13d-52df-7636-ad6b43d49bab', getRequestOptions)
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
