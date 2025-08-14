// ChatService.ts
import { useSelector } from 'react-redux';
import { database } from '../../../configs/firebase';
import {
  ref,
  query,
  orderByChild,
  limitToLast,
  onChildAdded,
  get,
} from 'firebase/database';

interface ChatBean {
  uid: string;
  fromId: string;
  toId: string;
  message: string;
}

export const fetchMessages = async (
  uniqueDBKey: string,
  uid: string,
  toId: string,
  itemsPerPage: number,
  onNewMessage: (chat: ChatBean) => void,
) => {
  try {
    const chatRef = ref(
      database,
      `chat__${uniqueDBKey}/users_messages_rel/${uid}/${toId}`
    );
    console.log('🔍 Chat reference:', chatRef);
    
    const messagesQuery = query(
      chatRef,
      orderByChild('timestamp'),
      limitToLast(itemsPerPage)
    );
    console.log('🔍 Messages query created:', messagesQuery);
    
    // 1. First fetch existing messages (history)
    /*console.log('📥 Fetching existing messages...');
    const snapshot = await get(messagesQuery);
    console.log('✅ Snapshot received:', snapshot.exists() ? 'Data exists' : 'No data');
    
    if (snapshot.exists()) {
      const messageRefs = snapshot.val();
      console.log('📋 Found message references:', Object.keys(messageRefs).length);
      
      for (const messageId in messageRefs) {
        const messageRef = ref(database, `chat__${uniqueDBKey}/messages/${messageId}`);
        try {
          const messageSnap = await get(messageRef);
          
          if (messageSnap.exists()) {
            const data = messageSnap.val();
            onNewMessage({
              uid,
              fromId: data.fromId,
              toId: data.toId,
              message: data.text,
            });
          }
        } catch (messageError) {
          console.warn(`⚠️ Failed to fetch message ${messageId}:`, messageError);
        }
      }
    } else {
      console.log('ℹ️ No existing messages found');
    }*/

    // 2. Then listen for *new* messages (real-time)
    console.log('👂 Setting up real-time listener...');
    onChildAdded(messagesQuery, async (snapshot) => {
      console.log('🆕 New message detected:', snapshot.key);
      
      const messageId = snapshot.key;
      if (!messageId) {
        console.warn('⚠️ No message key found in snapshot');
        return;
      }

      const messageRef = ref(database, `chat__${uniqueDBKey}/messages/${messageId}`);
      try {
        const messageSnap = await get(messageRef);
        
        if (messageSnap.exists()) {
          const data = messageSnap.val();
          console.log('📨 Processing new message:', data);

          const chatBean: ChatBean = {
            uid,
            fromId: data.fromId,
            toId: data.toId,
            message: data.text,
          };

          onNewMessage(chatBean);
        } else {
          console.warn(`⚠️ Message ${messageId} not found in database`);
        }
      } catch (messageError) {
        console.error(`❌ Failed to fetch new message ${messageId}:`, messageError);
      }
    });
    
    console.log('✅ Chat service setup completed successfully');
    
  } catch (error) {
    console.error('❌ Firebase get() failed:', error);
    console.error('🔍 Error details:', {
      uniqueDBKey,
      uid,
      toId,
      itemsPerPage,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    
    // You might want to throw the error or handle it differently based on your app's needs
    throw error;
  }
};