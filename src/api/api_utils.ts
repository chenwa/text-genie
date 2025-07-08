import API_BASE_URL from '../config';

export async function callWriterApi({
  text,
  documentType,
  tone,
  revise,
  is_logged_in,
  language,
}: {
  text: string;
  documentType: string;
  tone: string;
  revise: string;
  is_logged_in: boolean;
  language: string;
}): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/writer_api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, document_type: documentType, tone, revise, is_logged_in, language }),
  });
  if (!response.ok) {
    throw new Error('Failed to get response from Typing Genie');
  }
  const data = await response.json();
  let resp = data.response || 'No response from Typing Genie';
  if (typeof resp === 'string') {
    resp = resp.replace(/\n/g, '<br />');
  }
  return resp;
}

export const callMessengerApi = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/write_messenger_api_with_history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Typing Genie');
  }
  const data = await response.json();
  if (data && typeof data.response === 'string') return data.response;
  return 'No response from Typing Genie';
};

export async function callLoginAPI(
  email: string,
  password: string
): Promise<{ access_token: string; user: any }> {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  form.append('org', 'typinggenie');
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!res.ok) {
    throw new Error('Login failed.');
  }
  const data = await res.json();
  return data;
}

export async function callForgotPasswordAPI(email: string): Promise<void> {
  const res = await fetch('/api/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw new Error('Failed to send reset email.');
  }
}

export async function callSignupAPI(
  email: string,
  password: string,
  first_name: string,
  last_name: string
): Promise<void> {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, first_name, last_name }),
  });
  if (!res.ok) {
    throw new Error('Signup failed.');
  }
}