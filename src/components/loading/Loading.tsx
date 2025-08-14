import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Alert, View } from 'react-native';

interface LoadingProps {
    visible: boolean;
    style?: any;
    transparent?: boolean;
}

export const Loading: React.FC<LoadingProps> = (props) => {
    return (
        <Modal
            transparent={true}
            visible={props.visible}
        >
            <View style={styles.containerStyle}>
                <View style={styles.indicator_container}>
                    <ActivityIndicator
                        style={[props.style]}
                        size={'large'}
                        color={'#fff'}
                    />
                </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(236, 236, 236, 0)'
    },
    indicator_container: {
        padding: 20,
        backgroundColor:  '#00000080',
        borderRadius: 10
    }
})
