import React, { useEffect, useState } from 'react';
import { VirtualFolderComponentProps } from '../../Interface';
import { VirtualFolder } from './VirtualFolder';
import { StyleSheet, View } from 'react-native';

type PathMap = Record<string, string>;

type PathEntry = {
  key: string;
  depth: number;
  label: string;
  value: string;
};

const sortPathEntriesWithDepth = (paths: PathMap): PathEntry[] => {
    return Object.entries(paths)
      .map(([key, path]) => {
        const depth = path.split('/').length;
        const parts = path.split('/');
        const label = `${'\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'.repeat(depth - 1)}${parts[parts.length - 1]}`;
        return {
          key,
          value: path,
          label,
          depth,
        };
      })
      .sort((a, b) => {
        const pathCompare = a.value.localeCompare(b.value);
        return pathCompare !== 0 ? pathCompare : a.depth - b.depth;
      });
};

const VirtualFolderComponent: React.FC<VirtualFolderComponentProps> = (props) => {
    const [items, setItems] = useState<any[]>([]);
    
    useEffect(() => {
        const sortedEntries = sortPathEntriesWithDepth(props.data);
        setItems(sortedEntries);
    }, [props.randomKey]);

    return (
        <View style={styles.container}>
            <VirtualFolder
                title={props.placeholder}
                defaultValue={props.defaultValue}
                data={items}
                onSelected={(value) => {
                    props.onSelected(props.indexId, value);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 9
    }
});

export default VirtualFolderComponent;