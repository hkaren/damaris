import React from "react";
import {
    View,
    Text,
} from "react-native";
import Modal from "react-native-modal";
import {styles} from "./styles";
import { SvgComponent } from "../../../core/SvgComponent";

interface FieldInfoModalProps {
    isVisible: boolean;
    showHideInfo: () => void;
    fieldInfoDescription: any
}

export const MoreIndexModal: React.FC<FieldInfoModalProps> = ({
                                                isVisible,
                                                showHideInfo,
                                                fieldInfoDescription
                                            }) => {

    const _renderMoreIndexes = () => {
        // Split the string by ';', trim, and filter out empty lines
        const lines = (fieldInfoDescription || '').split(';').map((s: string) => s.trim()).filter((s: string) => Boolean(s));
        return (
            <View>
                {lines.map((line: string, idx: number) => {
                    const [left, ...rightParts] = line.split(':');
                    const right = rightParts.join(':').trim();
                    return (
                        <View key={idx} style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 8, paddingTop: 5 }}>
                            <Text style={{ flex: 1 }}>{left.trim()}</Text>
                            <Text style={{ flex: 2, fontWeight: 'bold', textAlign: 'right' }}>{right}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <Modal
            testID={"modal"}
            isVisible={isVisible}
            swipeDirection={['down', 'up']}
            onSwipeComplete={showHideInfo}
            onBackdropPress={showHideInfo}
            style={styles.containerModal}
            statusBarTranslucent>
                <View style={styles.container}>
                    {_renderMoreIndexes()}
                </View>
        </Modal>
    );
};


