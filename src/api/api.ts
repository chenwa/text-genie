import API_BASE_URL from '../config';

export async function callWriterApi({ text, documentType, tone }: { text: string; documentType: string; tone: string; }): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/writer_api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, document_type: documentType, tone }),
  });
  if (!response.ok) {
    throw new Error('Failed to get response from writer_api');
  }
  const data = await response.json();
  if (typeof data === 'string') return data;
  if (data && typeof data.text === 'string') return data.text;
  return JSON.stringify(data);
}

export const sendWriterMessengerMessage = async (text: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/write_messenger_api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from write messenger API');
  }
  const data = await response.json();
  // If API returns just a string, return it; if wrapped in {text: ...}, return data.text
  if (typeof data === 'string') return data;
  if (data && typeof data.text === 'string') return data.text;
  let str = JSON.stringify(data.response);
  if (str.length > 1 && str[0] === '"' && str[str.length - 1] === '"') {
    str = str.slice(1, -1);
  }
  return str;
};
