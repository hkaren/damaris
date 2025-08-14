import React, {FC, useEffect, useState, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TextInputComponent, TextInput} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import styles from './styles';
import { Header } from '../../../components';
import { Loading } from '../../../components/loading/Loading';
import { InputOutlined } from '../../../components/core/InputOutlined';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from './ChatService';
import { SendChatMessage } from './SendChatMessage';

type RoomProps = {
    navigation: any;
    route: RouteProp<Record<string, any>, string>;
};

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isOwn: boolean;
}

export const Room: FC<RoomProps> = (props: RoomProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);
    const userInfo = useSelector((store: any) => store.userInfo);
    const flatListRef = useRef<FlatList>(null);
  
    useEffect(() => {
      console.log(' /////////////00000000000');
      
        setMessages([]);
        initData();
    }, [props.route.params?.randomKey, reloadKey]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({animated: true});
            }, 100);
        });

        return () => {
            keyboardDidShowListener?.remove();
        };
    }, []);

    const initData = async () => {
      const currentUserId = userInfo.firebase_uid;
      const toUserId = props.route.params?.data?.id;
      
      fetchMessages(userInfo.uniqueDBKey, currentUserId, toUserId, 30, (chatBean: any) => {
        const message: Message = {
          id: chatBean.uid,
          text: chatBean.message,
          sender: chatBean.fromId === currentUserId ? userInfo?.firstName || 'Me' : props.route.params?.data?.name || 'User',
          timestamp: new Date(),
          isOwn: chatBean.fromId === currentUserId
        };
        setMessages((prev) => [...prev, message]);
      });
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
        setSending(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        /*const message: Message = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: userInfo?.firstName || 'Me',
            timestamp: new Date(),
            isOwn: true
        };
        setMessages(prev => [...prev, message]);*/

        await SendChatMessage(
          userInfo.uniqueDBKey,        // ex: '882e5b66-77ba-479f-acab-eda89cb933a6'
          userInfo.firebase_uid,    // fromId
          props.route.params?.data?.id,      // toId
          newMessage.trim() // your TextInput value
        );

        setNewMessage('');
        setSending(false);
    };

    const renderMessage = ({ item }: { item: Message }) => {
      return (
        <View style={[styles.messageContainer, item.isOwn ? styles.ownMessage : styles.otherMessage]}>
            <View style={[styles.messageBubble, item.isOwn ? styles.ownBubble : styles.otherBubble]}>
                <Text style={[styles.messageText, item.isOwn ? styles.ownMessageText : styles.otherMessageText]}>
                    {item.text}
                </Text>
                {/* <Text style={[styles.messageTime, item.isOwn ? styles.ownMessageTime : styles.otherMessageTime]}>
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text> */}
            </View>
        </View>
    )};

    const goBackToChat = () => {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveId: 220,
          profileDrawerActiveCode: "Chat",
          profileDrawerActiveTitle: t('word_chat'),
        }
      });
      props.navigation.navigate('Chat', {randomKey: Math.random()});
    }

    return (
      <>
        <Header 
          title={props.route.params?.data?.name} 
          navigation={props.navigation} 
          hideMoreIcon={true} 
          type='back_callback' 
          backCallbackFunction={goBackToChat}
        />
        <KeyboardAvoidingView
                    style={{flex: 1, justifyContent: 'flex-end'}}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20} >
        
            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.text + item.timestamp.getTime().toString()}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                inverted={false}
                onContentSizeChange={() => {
                    if (messages.length > 0) {
                        flatListRef.current?.scrollToEnd({animated: true});
                    }
                }}
            />

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                      value={newMessage}
                      placeholder={t('msg_enter_message')}
                      multiline
                      onChangeText={(value) => setNewMessage(value)}
                      style={styles.messageInput}
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={sending || !newMessage.trim()}
                >
                    <Text style={[styles.sendButtonText, sending && styles.sendButtonTextDisabled]}>
                        {sending ? '...' : '➤'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Loading visible={loading} />
        </KeyboardAvoidingView>
      </>
    );
};