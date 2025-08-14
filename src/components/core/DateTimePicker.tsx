import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { InputOutlined } from "./InputOutlined";

interface DateTimePickerProps {
    label: string;
    confirmDate?: (date: number) => void;
    cancelDate?: () => void;
    modeDate?: "date" | "time" | "datetime";
    value?: string;
    cancelTextIOS?: 'string';
    confirmTextIOS?: 'string';
    backdropStyleIOS?: object;
    outlineStyle?: React.CSSProperties[];
    format: 'h:m' | 'h:m a' | 'dd/mm/yyyy' | 'dd/mm/yyyy h:m a' | 'yyyy/mm/dd' | 'yyyy/mm/dd h:m a' | 
            'dd-mm-yyyy' | 'dd-mm-yyyy h:m a' | 'yyyy-mm-dd' | 'yyyy-mm-dd h:m a' | 'dd/mm/yyyy h:m';
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
                                                                label = '',                
                                                                confirmDate = () => undefined,
                                                                cancelDate = () => undefined,
                                                                modeDate = 'date',
                                                                value = '',
                                                                cancelTextIOS = 'Cancel',
                                                                confirmTextIOS = 'Confirm',
                                                                backdropStyleIOS = {},
                                                                outlineStyle = [],
                                                                format = ''
                                                              }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [isFirstCalled, setIsFirstCalled] = useState<boolean>(true);
    const [dateUI, setDateUI] = useState<string>('');
    const [pickerValue, setPickerValue] = useState<string>('');

    useEffect(() => {
        setDatePickerVisibility(false);

        if(value && isFirstCalled){
            setIsFirstCalled(false);
            setPickerValue(value);
            initDateUI(new Date(parseInt(value)));
        }
    }, [value]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        cancelDate();
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setDatePickerVisibility(false);
        if(date && date.getTime()){
            initDateUI(date);
            setPickerValue(date.getTime()+'');
            confirmDate(date.getTime());
        }
    };

    const initDateUI = (date: Date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let hour12 = hour % 12;
            hour12 = hour12 ? hour12 : 12;
        let minute = date.getMinutes();
        let dayStr = (day < 10 ? '0' + day : day) + '';
        let monthStr = (month < 10 ? '0' + month : month) + '';
        let minuteStr = (minute < 10 ? '0' + minute : minute) + '';
        let hour12Str = (hour12 < 10 ? '0' + hour12 : hour12) + '';
        let amPmformat = hour >= 12 ? 'PM' : 'AM';

        let dateResult: string = format
                                    .replace('dd', dayStr+'')
                                    .replace('mm', monthStr+'')
                                    .replace('yyyy', year+'')
                                    .replace('h', hour12Str+'')
                                    .replace('m', minuteStr+'')
                                    .replace('a', amPmformat+'');
        setDateUI(dateResult);
    };

    return (
        <View>
            <InputOutlined
                label={label}
                value={dateUI}
                editable={-1}
                onChange={(value) => {}}
                onClickCallback={() => {
                    showDatePicker();
                }}
                outlineStyle={outlineStyle}
            />

            <DateTimePickerModal
                date={pickerValue ? new Date(parseInt(pickerValue)) : new Date()}
                isVisible={isDatePickerVisible}
                mode={modeDate}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                cancelTextIOS={cancelTextIOS}
                confirmTextIOS={confirmTextIOS}
                backdropStyleIOS={backdropStyleIOS}
            />
        </View>
    );
};