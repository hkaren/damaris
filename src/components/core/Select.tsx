import React, {useCallback, useEffect, useRef, useState} from "react";
import RNPickerSelect from 'react-native-picker-select';
import {TouchableOpacity, View, Text, Platform, Modal, StyleSheet} from "react-native";
import { SvgComponent } from "../../core/SvgComponent";
import {TextInput} from "react-native-paper";
import {SelectComponentProps} from "../../Interface";

export const Select = (props: SelectComponentProps) => {
    const ref = useRef<RNPickerSelect>(null);
    const [defaultValue, setDefaultValue] = useState<number | string>('');
    const [chooseValue, setChooseValue] = useState<number | string>('');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        setDefaultValue('');
        setChooseValue('');

        if (props.defaultValue || props.defaultValue === 0) {
            let index = props.data?.findIndex((e: any) => e.value == props.defaultValue)
            if (index !== -1) {
                setDefaultValue(props.data[index]?.label);
                setChooseValue(props.data[index]?.value);
            }
        }
    }, [props]);

    const handleValueChange = (value: any) => {
        setChooseValue(value);
        if (Platform.OS === 'android') {
            if (value === 'null' || value === null || value === '') {
                setDefaultValue('');
                props.onSelected('');
            } else {
                const selectedItem = props.data?.find((item: any) => item.value === value);
                if (selectedItem) {
                    setDefaultValue(selectedItem.label);
                    props.onSelected(value);
                }
            }
            setShowPicker(false);
        }
    };

    const _renderHeader = useCallback(() => {
        if (Platform.OS === 'android') return null;

        return (
          <View style={styles.header_picker}>
              <TouchableOpacity onPress={() => ref.current?.togglePicker()} style={styles.btn_area}>
                  <Text style={styles.header_btn_cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                  if (chooseValue === 'null' || chooseValue === null || chooseValue === '') {
                      setDefaultValue('');
                      props.onSelected('');
                  } else {
                      const selectedItem = props.data?.find((item: any) => item.value === chooseValue);
                      if (selectedItem) {
                          setDefaultValue(selectedItem.label);
                          props.onSelected(chooseValue);
                      }
                  }
                  ref.current?.togglePicker();
              }} style={styles.btn_area}>
                  <Text style={styles.header_btn_done}>Done</Text>
              </TouchableOpacity>
          </View>
        );
    }, [chooseValue, props.data]);

    const renderAndroidPicker = () => {
        if (Platform.OS !== 'android') return null;

        return (
          <Modal
            visible={showPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPicker(false)}
          >
              <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                          <TouchableOpacity onPress={() => setShowPicker(false)}>
                              <Text style={styles.header_btn_cancel}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                              handleValueChange(chooseValue);
                          }}>
                              <Text style={styles.header_btn_done}>Done</Text>
                          </TouchableOpacity>
                      </View>
                      <RNPickerSelect
                        onValueChange={handleValueChange}
                        items={props.data}
                        value={chooseValue}
                        style={{
                            inputAndroid: {
                                color: 'black',
                                padding: 10,
                            },
                        }}
                      />
                  </View>
              </View>
          </Modal>
        );
    };

    return (
      <>

          {!props.type && (
            <View style={[styles.container, props.containerStyle]}>
                <TouchableOpacity onPress={() => {
                    if (Platform.OS === 'android') {
                        setShowPicker(true);
                    } else {
                        ref.current?.togglePicker();
                    }
                }} style={styles.btn_input}>
                    <TextInput
                      onPress={() => {
                          if (Platform.OS === 'android') {
                              setShowPicker(true);
                          } else {
                              ref.current?.togglePicker();
                          }
                      }}
                      label={<Text style={props.placeholderStyle}>{props.title}</Text>}
                      mode="outlined"
                      value={`${defaultValue}`}
                      outlineStyle={props.outlineStyleCustom}
                      style={styles.input}
                      activeOutlineColor={'#d9d9d9'}
                      outlineColor={'#d9d9d9'}
                      editable={false}
                      placeholderTextColor={'blue'}
                    />
                    <View style={{position: 'absolute', top: 20, right: 20,}}>
                        <SvgComponent name={'drow'}/>
                    </View>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
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
                        InputAccessoryView={Platform.OS === 'ios' ?_renderHeader as any : null}
                        onValueChange={handleValueChange}
                        items={props.data}
                        onOpen={() => {
                            const findIndex = props.data.findIndex((e: any) => e.label === defaultValue);
                            if (findIndex !== -1) {
                                setChooseValue(props.data[findIndex].value);
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
                )}
                {renderAndroidPicker()}
            </View>
          )}
      </>
    );
}



const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        position: 'relative',
    },
    btn_input: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
    },
    input: {
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        color: '#000',
    },
    select_cont: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
    },
    placeholder: {
        color: '#000',
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
    header_picker: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    btn_area: {
        padding: 10,
    },
    header_btn_cancel: {
        color: '#666',
        fontSize: 16,
    },
    header_btn_done: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
});

