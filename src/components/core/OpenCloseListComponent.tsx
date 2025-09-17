import React, { useCallback, useEffect, useRef, useState } from "react";
import {View, Text, StyleSheet} from "react-native";
import { OpenCloseListComponentProps } from "../../Interface";
import { SvgComponent } from "../../core/SvgComponent";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Styles } from "../../core/Styles";

export const OpenCloseListComponent = (props: OpenCloseListComponentProps) => {
    const dropdownController = useRef<any>(null);
    const searchRef = useRef<any>(null);
    const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
    //const [selectedIndexFormData, setSelectedIndexFormData] = useState<any[]>([]);
    //const [filterToken, setFilterToken] = useState<string>('');
    //const [itemSelected, setItemSelected] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    
    useEffect(() => {
        setSuggestionsList(getIndexValues(props.data));
    }, []);

    const getIndexValues = (data: any) => {
        let indexValues_: any = [];
        Object.entries(data).map(([key, value]) => {
            indexValues_.push({id: key, title: value});
        });
        return indexValues_;
    };

    const getSuggestions = useCallback(async (q: string) => {
        //setItemSelected(false);

        let filterToken_ = '';
        if(!props.showAllSuggestions) {
            filterToken_ = q.toLowerCase();
        }

        //setFilterToken(filterToken_);
        //console.log('getSuggestions', q)
        // if (typeof q !== 'string' || q.length < 3) {
        //     console.log('q.length < 3');
            
        //   setSuggestionsList([])
        //   return
        // }
        //const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        //const items = await response.json()
        const items = getIndexValues(props.data);
        
        const suggestions = items
          .filter((item: any) => item.title.toLowerCase().startsWith(filterToken_))
          .map((item: any) => ({
            id: item?.id,
            title: item?.title,
        }));
        setSuggestionsList(suggestions);
    }, []);

    const onOpenSuggestionsList = (isOpened: boolean) => {
        const items = getIndexValues(props.data);

        let title = '';
        if(!props.showAllSuggestions) {
            title = String(inputValue || '') || '';
        }

        const suggestions = items
          .filter((item: any) => item?.title.toLowerCase().startsWith(title?.toLowerCase() || ''))
          .map((item: any) => ({
            id: item?.id,
            title: item?.title,
        }));

        setSuggestionsList(suggestions);
    };
    
    const onClearPress = useCallback(() => {
        setSuggestionsList([]);
    }, []);

    const onBlurHandler = () => {
        if(props.type === 'closed-list') {
            const valueFoundInList = Object.values(props.data).includes(inputValue);
            if(!valueFoundInList) {
                setInputValue('');
            }
        }
    };

    return (
        <View style={styles.container}>
            {(isFocused || inputValue) ? <Text style={styles.label}>{props.placeholder}</Text> : null}
            <AutocompleteDropdown
                ref={searchRef}
                controller={controller => {
                    dropdownController.current = controller
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    onBlurHandler();
                    setIsFocused(false);
                }}
                clearOnFocus={false}
                closeOnBlur={true}
                closeOnSubmit={false}
                //initialValue={{ id: '0' }}
                onSelectItem={(item) => {
                    //setItemSelected(true);
                    //setSelectedIndexFormData({...selectedIndexFormData, [String(item?.id)]: item?.title});
                    props.onSelected(props.indexId, item?.title || '');
                    setInputValue(item?.title || '');
                }}
                dataSet={suggestionsList}
                onChangeText={(text) => {
                    setInputValue(text);
                    getSuggestions(text);
                }}
                onOpenSuggestionsList={onOpenSuggestionsList}
                // dataSet={[
                //     { id: '1', title: 'Alpha' },
                //     { id: '2', title: 'Beta' },
                //     { id: '3', title: 'Gamma' },
                // ]}
                textInputProps={{
                    placeholder: props.placeholder,
                    autoCorrect: false,
                    autoCapitalize: 'none',
                    value: inputValue,
                    placeholderTextColor: isFocused ? 'transparent' : '#999999'
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
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginTop: 4
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
