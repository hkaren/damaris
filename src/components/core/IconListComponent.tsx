import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { IconListComponentProps } from '../../Interface';
import { Styles } from '../../core/Styles';
import { SvgComponent } from '../../core/SvgComponent';

const IconListComponent: React.FC<IconListComponentProps> = (props) => {
    const controllerRef = useRef<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const onOpenSuggestionsList = (isOpened: boolean) => {
        if (props.data && typeof props.data === 'object') {
            const values1 = Object.values(props.data); // ['1', '2', '3']
            const values2Mapped = Object.values(props.dataIcons); // ['a', 'c', 'e']
            const maxLength = Math.max(values1.length, values2Mapped.length);

            const result = Array.from({ length: maxLength }).map((_, index) => ({
                key: String(index),
                value1: values1[index],
                value2: values2Mapped[index],
            }));
            
            const dataArray = Object.values(result);
            const items = dataArray.map((item: any, index: number) => ({
                id: index.toString(),
                title: item.value1,
                icon: item.value2 ? <Image source={{ uri: 'data:image/jpeg;base64,' + item.value2 }} style={{ width: 20, height: 20 }} /> : null,
            }));
            setItems(items);
        } else {
            setItems([]);
        }
    };

    return (
        <View style={styles.container}>
            {inputValue ? <Text style={styles.label}>{props.placeholder}</Text> : null}
            <AutocompleteDropdown
                controller={(c) => (controllerRef.current = c)}
                dataSet={items}
                editable={false}
                onSelectItem={(item) => {
                    props.onSelected(props.indexId, item?.title || '');
                    setInputValue(item?.title || '');
                }}
                renderItem={(item, text) => (
                <View style={styles.item}>
                    {typeof (item as any).icon === 'string' ? (
                    <Text style={styles.icon}>{(item as any).icon}</Text>
                    ) : (
                    <View style={styles.iconContainer}>
                        {(item as any).icon}
                    </View>
                    )}
                    <Text>{item.title || (item as any).value1}</Text>
                </View>
                )}
                onOpenSuggestionsList={onOpenSuggestionsList}
                textInputProps={{
                    placeholder: props.placeholder,
                }}
                containerStyle={{
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: '#d9d9d9',
                }}
                inputContainerStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: '#ffffff',
                    height: 48,
                }}
                ChevronIconComponent={
                    <View style={{ width: 0, height: 0 }} />
                }
                ClearIconComponent={
                    <Text style={{ color: '#999999', fontSize: 16, marginTop: 3 }}>✕</Text>
                }
            />
            <View style={{
                position: 'absolute',
                right: 15,
                top: 18,
                zIndex: 1,
                pointerEvents: 'none'
            }}>
                <SvgComponent name={'drow'}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginTop: 4
    },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    fontSize: 18,
  },
  iconContainer: {
    marginRight: 10,
  },
  label: {
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#666',
    zIndex: 1,
  },
});

export default IconListComponent;