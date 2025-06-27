import API_BASE_URL from '../config';

export async function callWriterApi({ text, documentType, tone }: { text: string; documentType: string; tone: string; }): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/writer_api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, document_type: documentType, tone }),
  });
  if (!response.ok) {
    throw new Error('Failed to get response from Typing Genie');
  }
  const data = await response.json();
  let resp = data.response || "No response from Typing Genie";
  if (typeof resp === 'string') {
    resp = resp.replace(/\n/g, '<br />');
  }
  // console.log('API return data:', resp);
  return resp;
}

export const sendMessengerMessage = async (text: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/write_messenger_api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Typing Genie');
  }
  const data = await response.json();
  if (data && typeof data.response === 'string') return data.response;
  return "No response from Typing Genie";
};
