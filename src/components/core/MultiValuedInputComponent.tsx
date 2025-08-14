import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { MultiValueInputComponentProps } from '../../Interface';
import { TextInput } from 'react-native-paper';

const MultiValueInputComponent: React.FC<MultiValueInputComponentProps> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const addValue = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      const newValues = [...values, trimmed];
      setValues(newValues);

      const separator = props.data["0"];
      const joinedString = newValues.join(separator);
      props.onSelected(props.indexId, joinedString);
    }
    setInputValue('');
  };

  const removeValue = (valueToRemove: string) => {
    const newValues = values.filter((val) => val !== valueToRemove);
    setValues(newValues);

    const separator = props.data["0"];
    const joinedString = newValues.join(separator);
    props.onSelected(props.indexId, joinedString);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && inputValue === '' && values.length > 0) {
      // Remove last item
      const newValues = [...values];
      newValues.pop();
      setValues(newValues);

      const separator = props.data["0"];
      const joinedString = newValues.join(separator);
      props.onSelected(props.indexId, joinedString);
    }
  };

  return (
    <View style={styles.container}>
      {(isFocused || inputValue || values.length > 0) && <Text style={styles.label}>{props.placeholder}</Text>}
      <View style={styles.box}>
        <View style={styles.chipContainer}>
          {values.map((value) => (
            <View key={value} style={styles.chip}>
              <Text style={styles.chipText}>{value}</Text>
              <TouchableOpacity onPress={() => removeValue(value)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={props.placeholder}
          placeholderTextColor={isFocused ? 'transparent' : '#999999'}
          onSubmitEditing={addValue}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          blurOnSubmit={false}
          mode="outlined"
          outlineStyle={styles.inputOutline}
          style={styles.input}
          textColor={'black'}
          activeOutlineColor={'black'}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    marginTop: 6
  },
  box: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    minHeight: 80,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    marginTop: 4
  },
  chip: {
    backgroundColor: '#e1f0ff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    marginRight: 8,
    color: '#333',
  },
  closeButton: {
    color: '#444',
    fontSize: 16,
    width: 24,
    height: 24,
    lineHeight: 24,
    textAlign: 'center',
    overflow: 'hidden',
  },
  input: {
    fontSize: 16,
    width: '100%',
    height: 47,
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
  },
  inputOutline: {
    borderWidth: 0,
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

export default MultiValueInputComponent;