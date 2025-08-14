import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 0,
    marginHorizontal: 16,
  },
  
  // Messages List Styles
  messagesList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  
  // Message Container Styles
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  
  // Message Bubble Styles
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  
  // Message Text Styles
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  
  // Message Time Styles
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  ownMessageTime: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#8E8E93',
    textAlign: 'left',
  },
  
  // Input Container Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    marginBottom: 10
  },
  messageInput: {
    height: 40,
    fontSize: 16,
    borderColor: '#d9d9d9',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  // Send Button Styles
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: '#8E8E93',
  },
});
export default styles;