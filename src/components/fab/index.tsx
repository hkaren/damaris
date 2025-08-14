import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SvgComponent } from '../../core/SvgComponent';
import Modal from "react-native-modal";

interface Props {
  navigation: any;
}

export const Fab: React.FC<Props> = ({navigation}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const [isOpen, setIsOpen] = useState(false);
    const [showModalFab, setShowModalFab] = useState(false);

    useEffect(() => {
      setShowModalFab(false);
      setIsOpen(false);
      setIsFabOpen(false);
    }, []);

    const toggleFab = () => {
        setIsOpen(!isOpen);
        const toValue = isFabOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            useNativeDriver: true,
        }).start();
        setIsFabOpen(!isFabOpen);
        setShowModalFab(!showModalFab);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);

        if(!isOpen) {
            setTimeout(() => {
                toggleFab();
            }, 300);
        }
    };

    const handleMenuPress = (menuType: string) => {
        console.log(`Menu pressed: ${menuType}`);
        if (menuType === 'chat') {
          dispatch({
            type: 'SET_CONFIG',
            payload: {
              profileDrawerActiveId: 220,
              profileDrawerActiveCode: "Chat",
              profileDrawerActiveTitle: t('word_chat'),
            }
          });
          navigation.navigate('Chat', {randomKey: Math.random()});
        } else if (menuType === 'newMessage') {
          dispatch({
            type: 'SET_CONFIG',
            payload: {
              profileDrawerActiveId: 221,
              profileDrawerActiveCode: "MessagesNew",
              profileDrawerActiveTitle: t('word_new_message'),
            }
          });
          navigation.navigate('MessagesNew', {randomKey: Math.random()});
        }
        toggleFab();
    };

    const onClose = () => {
      // Only proceed if FAB is fully opened
      if (isFabOpen) {
        setIsOpen(false);
        setTimeout(() => {
          toggleFab();
        }, 300);
      }
    };

    return (
      <>
        <Modal
            testID={"modal"}
            isVisible={isOpen}
            onSwipeComplete={onClose}
            onBackdropPress={onClose}
            style={styles.containerModal}
            statusBarTranslucent>
                {/* {isOpen && <View style={styles.transparent} />} */}
                <View style={styles.fabContainer}>
                  {/* Menu Item 2 - New Message */}
                  <Animated.View style={[
                    styles.fabMenuItem,
                    {
                      transform: [{
                        translateY: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      }],
                      opacity: animation,
                    },
                  ]}>
                    <TouchableOpacity 
                      style={styles.fabMenuButton}
                      onPress={() => handleMenuPress('newMessage')}
                    >
                      <Text style={styles.fabMenuText}>✉️</Text>
                    </TouchableOpacity>
                    <Text style={styles.fabMenuLabel}>New message</Text>
                  </Animated.View>

                  {/* Menu Item 1 - Chat */}
                  <Animated.View style={[
                    styles.fabMenuItem,
                    {
                      transform: [{
                        translateY: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -160],
                        }),
                      }],
                      opacity: animation,
                    },
                  ]}>
                    <TouchableOpacity 
                      style={styles.fabMenuButton}
                      onPress={() => handleMenuPress('chat')}
                    >
                      <Text style={styles.fabMenuText}>💬</Text>
                    </TouchableOpacity>
                    <Text style={styles.fabMenuLabel}>Chat</Text>
                  </Animated.View>

                  {/* Main FAB Button */}
                  { showModalFab ?
                  <TouchableOpacity style={styles.fab} onPress={toggleFab}>
                    <Animated.Text style={[
                      styles.fabText,
                      {
                        transform: [{
                          rotate: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '45deg'],
                          }),
                        }],
                      },
                    ]}>
                      +
                    </Animated.Text>
                  </TouchableOpacity>
                  : null
                  }
                </View>
        </Modal>
        <View style={[styles.fabContainer, {marginRight: 40}]}>  
          <TouchableOpacity style={styles.fab} onPress={toggleModal}>
            <Animated.Text style={[
              styles.fabText,
              {
                transform: [{
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                }],
              },
            ]}>
              +
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </>
    );
};