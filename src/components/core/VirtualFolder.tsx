import React, {useCallback, useEffect, useRef, useState} from "react";
import RNPickerSelect from 'react-native-picker-select';
import {TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {TextInput} from "react-native-paper";
import { VirtualFolderProps } from "../../Interface";
import { SvgComponent } from "../../core/SvgComponent";

export const VirtualFolder = (props: VirtualFolderProps) => {
    const ref = useRef<RNPickerSelect>(null); // Specify the ref type
    const [defaultValue, setDefaultValue] = useState<number | string>(''); // Provide initial value
    const [chooseValue, setChooseValue] = useState<number | string>('');

    useEffect(() => {
        //setDefaultValue('');
        //setChooseValue('');

        if (props.defaultValue || props.defaultValue === 0) {
            if (props.data && props.data.length > 0) {
                let index = props.data?.findIndex((e: any) => e.value == props.defaultValue)
                if (index !== -1) {
                    setDefaultValue(props.data[index]?.value);
                    setChooseValue(props.data[index]?.value);
                }
            }
        }
    }, [props]);


    const _renderHeader = useCallback(() => {
        return (
            <View style={styles.header_picker}>
                <TouchableOpacity onPress={() => {
                    ref.current?.togglePicker();
                }} style={styles.btn_area}>
                    <Text style={styles.header_btn_cancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (chooseValue === 'null' || chooseValue === null || chooseValue == '') {
                        setDefaultValue('');
                        props.onSelected('');
                    } else {
                        setDefaultValue(props.data?.filter((item: any) => item.value == chooseValue)[0].value);
                        props.onSelected(chooseValue);
                    }
                    ref.current?.togglePicker();
                }} style={styles.btn_area}>
                    <Text style={styles.header_btn_done}>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }, [chooseValue]);

    return (
        <View style={[styles.container, props.containerStyle]}>
            <TouchableOpacity onPress={() => ref.current?.togglePicker()} style={styles.btn_input}>
                <TextInput
                    label={<Text style={props.placeholderStyle}>{props.title}</Text>}
                    //   label={props.title}
                    mode="outlined"
                    value={`${defaultValue}`}
                    outlineStyle={[props.outlineStyleCustom, {borderRadius: 15, borderWidth: 2}]}
                    style={styles.input}
                    activeOutlineColor={'#d9d9d9'}
                    outlineColor={'#d9d9d9'}
                    editable={false}
                    placeholderTextColor={'blue'}
                    onPress={() => ref.current?.togglePicker()}
                />
                <View style={{position: 'absolute', top: 20, right: 20,}}>
                    <SvgComponent name={'drow'}/>
                </View>
            </TouchableOpacity>

            <View style={styles.select_cont}>
                <RNPickerSelect
                    textInputProps={{}}
                    ref={ref}
                    style={{
                        placeholder: styles.placeholder,
                        inputIOS: [styles.inputIOS],
                        inputAndroid: [styles.inputAndroid],
                    }}
                    placeholder={{
                        label: props.title,
                        value: null,
                    }}
                    touchableWrapperProps={{}}
                    InputAccessoryView={_renderHeader}
                    onValueChange={(value, index) => {
                        setChooseValue(value);
                    }}
                    // onClose={() => {
                    //     setChooseValue('')
                    // }}
                    items={props.data}
                    onOpen={() => {
                        let findIndex = (props.data && props.data.length > 0) ? props.data.findIndex((e: any) => e.label === defaultValue) : -1;
                        if (findIndex !== -1) {
                            {
                                setChooseValue(props.data[findIndex].value);
                            }
                        }
                    }}
                    value={chooseValue}
                    pickerProps={{
                        itemStyle: {
                            backgroundColor: '#d3d6dd',
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 48,
        backgroundColor: 'white',
        position: 'relative',
    },
    btn_input: {
        position: 'absolute',
        zIndex: 999,
        width: '100%',
    },
    input: {
        width: '100%',
        height: 48,
        backgroundColor: 'white',
        color: '#000'
    },
    placeholder: {
        fontSize: 16
    },
    select_cont: {
        width: 0,
        height: 0,
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 5,
        color: '#000',
        backgroundColor: '#fff',
        paddingRight: 30,
        width: '100%',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 5,
        paddingVertical: 8,
        color: '#fff',
        paddingRight: 30,
        width: '100%',
    },
    picker: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    selected: {
        fontSize: 16,
    },
    header_picker: {
        backgroundColor: '#f0f1f2',
        height: 44,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: '#d9d9d9'
    },
    header_btn_cancel: {
        color: '#007aff',
        fontWeight: '600',
        fontSize: 17,
    },
    header_btn_done: {
        color: '#007aff',
        fontWeight: '600',
        fontSize: 17,
        paddingRight: 11,
    },
    btn_area: {
        justifyContent: 'center',
        height: 40,
    },
});
