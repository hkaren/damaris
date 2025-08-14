import React, { useEffect, useState } from "react";
import {StyleSheet, View} from "react-native";
import { SimpleCloseListComponentProps } from "../../Interface";
import { Select } from "./Select";

export const SimpleCloseListComponent = (props: SimpleCloseListComponentProps) => {
    const [items, setItems] = useState<any[]>([]);
    const [defaultValue, setDefaultValue] = useState<string>('');
    
    useEffect(() => {
        setDefaultValue(props.defaultValueTitle);

        if (props.data && typeof props.data === 'object') {
            const values = Object.values(props.data);
            const itemsWithLabelValue = values.map((value, index) => ({
                label: value,
                value: value
            }));
            setItems(itemsWithLabelValue);
        }
    }, [props.data]);

    return (
        <View style={styles.container}>
            <Select
                title={props.placeholder}
                defaultValue={defaultValue}
                data={items}
                onSelected={(value) => {
                    setDefaultValue(value);
                    props.onSelected(props.indexId, value);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 9
    }
});
