import type { Message, MessageResponse, MessageType } from './types';

export function sendMessage<T, R>(
  type: MessageType,
  payload?: T
): Promise<MessageResponse<R>> {
  return new Promise((resolve) => {
    const message: Message<T> = { type, payload };
    chrome.runtime.sendMessage(message, (response: MessageResponse<R>) => {
      if (chrome.runtime.lastError) {
        resolve({
          success: false,
          error: chrome.runtime.lastError.message,
        });
        return;
      }
      resolve(response);
    });
  });
}

export function createMessageHandler(
  handlers: Partial<Record<MessageType, (payload: unknown) => Promise<unknown>>>
) {
  return (
    message: Message,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ): boolean => {
    const handler = handlers[message.type];
    if (!handler) {
      sendResponse({ success: false, error: `Unknown message type: ${message.type}` });
      return false;
    }

    handler(message.payload)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true;
  };
}

