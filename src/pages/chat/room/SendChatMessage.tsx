import { ref, push, update } from 'firebase/database';
import { database } from '../../../configs/firebase'; // your firebase setup

export const SendChatMessage = async (
  uniqueDbKey: string,
  fromId: string,
  toId: string,
  messageText: string
) => {
  if (!messageText.trim()) return;

  const date = new Date();

  const rootRef = ref(database, `chat__${uniqueDbKey}`);
  const messagesRef = ref(database, `chat__${uniqueDbKey}/messages`);
  const newMessageRef = push(messagesRef);

  const messageId = newMessageRef.key;

  const messageData = {
    text: messageText,
    fromId,
    toId,
    device: 'mobile', // or 'mobile' if you're using Expo or real device
    timestamp: date.getTime(),
    //isRead: false,
  };

  const updates: { [key: string]: any } = {};

  updates[`/messages/${messageId}`] = messageData;
  updates[`/users_messages_rel/${fromId}/${toId}/${messageId}`] = 1;
  updates[`/users_messages_rel/${toId}/${fromId}/${messageId}`] = 1;

  await update(rootRef, updates);

  //console.log('✅ Message sent:', messageText);
};