import { ActivityIndicator, StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinkProps } from '../../Interface';

export const Link = function(props: LinkProps) {
    return (
        <TouchableOpacity key={props.keyProp} style={props.className as StyleProp<ViewStyle>} onPress={props.onClickHandler}>
            <Text key={props.keyProp} style={props.textClassName as StyleProp<ViewStyle>}>{props.title}</Text>
        </TouchableOpacity>
    )
}
