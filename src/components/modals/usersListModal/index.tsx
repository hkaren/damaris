import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    ScrollView
} from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";
import { Checkbox } from "../../core/Checkbox";
import { Styles } from "../../../core/Styles";


interface Props {
    visible: boolean,
    onClose: () => void,
    usersList: any[],
    filterData?: any
    onChangeData: (type: string, key: string, value: string) => void
}

export const UsersListModal: React.FC<Props> = ({ 
    visible,
    onClose,
    usersList,
    filterData,
    onChangeData
}) => {
console.log(filterData, ' / filterData');

    return (
        <Modal
            testID={"modal"}
            isVisible={visible}
            onBackdropPress={onClose}
            style={styles.containerModal}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={true} style={{flex: 1}}>
                    {usersList?.map((user) => (
                        <Checkbox
                            key={user.userID}
                            label={`${user?.firstName} ${user.lastName}`}
                            selected={filterData['users']?.some((item_: any) => item_ == user.userID)}
                            onSelect={() => onChangeData('multi', 'users', user.userID)}
                            containerStyle={[Styles.mb_3]}
                            touchableStyle={[styles.touchArea]}
                        />
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};
