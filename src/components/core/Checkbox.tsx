import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

export interface CheckboxProps {
    label: any,
    selected: any,
    onSelect: (e: any) => any,
    containerStyle?: React.CSSProperties[],
    touchableStyle?: React.CSSProperties[],
};

export const Checkbox = (props: CheckboxProps) => {
    return (
        <View style={props.containerStyle as StyleProp<ViewStyle>}>
            <TouchableOpacity style={[styles.radioButtonArea, props.touchableStyle as StyleProp<ViewStyle>]} onPress={props.onSelect}> 
                <View style={[styles.checkbox, props.selected ? styles.checkboxSelected : null]}>
                    {props.selected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                { props.label ?
                    <Text style={[styles.radioButtonText, props.selected ? styles.radioButtonTextSelected : null]}> 
                        {props.label} 
                    </Text> 
                    : null
                }
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({ 
    radioButtonArea: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center'
    },
    checkbox: { 
        width: 20,
        height: 20,
        borderWidth: 2, 
        borderColor: '#d9d9d9',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    checkboxSelected: {
        borderColor: '#368200',
        backgroundColor: '#368200'
    },
    radioButtonText: { 
        fontSize: 14, 
        marginLeft: 10
    }, 
    radioButtonTextSelected: {
        
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    }
}); 
  
