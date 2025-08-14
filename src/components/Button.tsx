import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Styles } from "../core/Styles"

type ButtonProps = {
    variant: 'login' | 'general',
    state?: boolean,
    onClickHandler?: () => void,
    key? : string,
    textCssClass?: React.CSSProperties[],
    buttonCssClass?: React.CSSProperties[],
    backgroundColor?: string,
    title?: string,
} & React.ComponentProps<'button'>

export const Button = ({
    variant,
    children,
    state,
    onClickHandler,
    key,
    textCssClass,
    buttonCssClass,
    backgroundColor,
    title,
    ...rest
}: ButtonProps) => {
    let buttonColor = Styles.none;
    let buttonTextCSS = Styles.none;
    if (backgroundColor !== undefined && backgroundColor.startsWith("#")) {
        buttonColor = {backgroundColor: backgroundColor};
    } else if (backgroundColor == 'login') {
        //buttonColor = state ? Styles.buttonColorLoginActive : Styles.buttonColorLogin;
    } else if (backgroundColor == 'blue') {
        buttonColor = state ? Styles.buttonColorBlueActive : Styles.buttonColorBlue;
        buttonTextCSS = {color: 'white'};
    }

    return (
        <View style={styles.container}>
            { variant === 'general' ? 
                <TouchableOpacity key={key} disabled={state} style={[Styles.button, buttonColor, buttonCssClass]} onPress={onClickHandler}>
                    { state ? 
                        <ActivityIndicator size="small" color="white" style={{marginRight: 5}} />
                        : null
                    }
                    <Text key={key} style={[Styles.buttonText, buttonTextCSS, textCssClass as StyleProp<ViewStyle>]}>{title}</Text>
                </TouchableOpacity>
                :
                <button className={`button-${variant}`} {...rest}>
                    {children}
                </button>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})