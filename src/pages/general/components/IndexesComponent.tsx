import React, { useState } from "react";
import {View, Text, StyleSheet} from "react-native";
import { IndexesComponentProps } from "../../../Interface";
import { 
    INDEX_TYPES_ALPHANUMERIC,
    INDEX_TYPES_CLOSED_LIST,
    INDEX_TYPES_DATE,
    INDEX_TYPES_DICTIONARY,
    INDEX_TYPES_EMAIL,
    INDEX_TYPES_ICON_LIST,
    INDEX_TYPES_MONEY,
    INDEX_TYPES_MULTI_VALUED,
    INDEX_TYPES_NUMERIC,
    INDEX_TYPES_OPEN_LIST,
    INDEX_TYPES_SECURE_FIELD,
    INDEX_TYPES_SIMPLE_CLOSED_LIST,
    INDEX_TYPES_TABLE_LINK,
    INDEX_TYPES_TEXTAREA,
    INDEX_TYPES_TIMESTAMP,
    INDEX_TYPES_URL,
    INDEX_TYPES_VIRTUAL_FOLDER,
 } from "../../../utils/AppConstants";
import { useTranslation } from "react-i18next";
import { InputOutlined } from "../../../components/core/InputOutlined";
import { DateTimePicker } from "../../../components/core/DateTimePicker";
import { OpenCloseListComponent } from "../../../components/core/OpenCloseListComponent";
import VirtualFolderComponent from "../../../components/core/VirtualFolderComponent";
import IconListComponent from "../../../components/core/IconListComponent";
import MultiValueInputComponent from "../../../components/core/MultiValuedInputComponent";
import { SimpleCloseListComponent } from "../../../components/core/SimpleCloseListComponent";
import { Styles } from "../../../core/Styles";

export const IndexesComponent = (props: IndexesComponentProps) => {
    const { t } = useTranslation();
    const [selectedIndexFormData, setSelectedIndexFormData] = useState<any[]>([]);
    
    return (
        <View style={styles.indexesContainer}>
            <Text style={styles.indexesTitle}>{t('indexes')}</Text>
            { props.indexes?.map((item: any, index: number) => {
                return (
                    <View key={index} style={{marginTop: 3, marginBottom: 3}}> 
                        {item.indexType === INDEX_TYPES_NUMERIC ? 
                            <InputOutlined
                                label={item.indexName}
                                keyboardType="numeric"
                                value={selectedIndexFormData[item.indexID]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }}
                                outlineStyleCustom={[props.errorFieldNames.includes(item.indexID) ? Styles.border_red : Styles.none]} />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_ALPHANUMERIC ? 
                            <InputOutlined
                                label={item.indexName}
                                value={selectedIndexFormData[item.indexID]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }}
                                outlineStyleCustom={[props.errorFieldNames.includes(item.indexID) ? Styles.border_red : Styles.none]} />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_MONEY ?
                            <InputOutlined
                                label={item.indexName}
                                keyboardType="numeric"
                                value={selectedIndexFormData[item.indexID]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }}
                                outlineStyleCustom={[props.errorFieldNames.includes(item.indexID) ? Styles.border_red : Styles.none]} />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_DATE ? 
                            <DateTimePicker
                                label={item.indexName}
                                modeDate={'date'}
                                format='dd/mm/yyyy'
                                value={selectedIndexFormData[item.indexID]}
                                confirmDate={(value: number) => {
                                    props.onSelected(item.indexID, value+'');
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_TIMESTAMP ? 
                            <DateTimePicker
                                label={item.indexName}
                                modeDate={'datetime'}
                                format='dd/mm/yyyy h:m'
                                value={selectedIndexFormData[item.indexID]}
                                confirmDate={(value: number) => {
                                    props.onSelected(item.indexID, value+'');
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_CLOSED_LIST ? 
                            <OpenCloseListComponent
                                type='closed-list'
                                data={item.indexValues}
                                placeholder={item.indexName}
                                indexId={item.indexID}
                                defaultValueTitle={selectedIndexFormData[item.indexID]}
                                selectedIndexFormData={selectedIndexFormData}
                                onSelected={(indexId, title) => {
                                    props.onSelected(indexId, title);
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_OPEN_LIST ? 
                            <OpenCloseListComponent
                                type='open-list'
                                data={item.indexValues}
                                placeholder={item.indexName}
                                indexId={item.indexID}
                                defaultValueTitle={selectedIndexFormData[item.indexID]}
                                selectedIndexFormData={selectedIndexFormData}
                                onSelected={(indexId, title) => {
                                    props.onSelected(indexId, title);
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_EMAIL ? 
                            <InputOutlined
                                label={item.indexName}
                                keyboardType="email-address"
                                value={selectedIndexFormData[item.indexID]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }} />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_VIRTUAL_FOLDER ? 
                            <VirtualFolderComponent
                                placeholder={item.indexName}
                                data={item.indexValues}
                                indexId={item.indexID}
                                defaultValue={selectedIndexFormData[item.indexID] || ''}
                                onSelected={(indexId: string, value: string) => {
                                    props.onSelected(indexId, value);
                                }}
                                randomKey={Math.random()}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_DICTIONARY ? 
                            <OpenCloseListComponent
                                type='closed-list'
                                showAllSuggestions={true}
                                data={item.indexValues}
                                placeholder={item.indexName}
                                indexId={item.indexID}
                                defaultValueTitle={selectedIndexFormData[item.indexID]}
                                selectedIndexFormData={selectedIndexFormData}
                                onSelected={(indexId, title) => {
                                    props.onSelected(indexId, title);
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_SIMPLE_CLOSED_LIST ? 
                            <SimpleCloseListComponent
                                data={item.indexValues}
                                placeholder={item.indexName}
                                indexId={item.indexID}
                                defaultValueTitle={selectedIndexFormData[item.indexID]}
                                selectedIndexFormData={selectedIndexFormData}
                                onSelected={(indexId, title) => {
                                    props.onSelected(indexId, title);
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_URL ? 
                            <InputOutlined
                                label={item.indexName}
                                keyboardType="url"
                                value={selectedIndexFormData[item.indexID]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }} />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_TABLE_LINK ? 
                            <OpenCloseListComponent
                                type='closed-list'
                                showAllSuggestions={true}
                                data={item.indexValues}
                                placeholder={item.indexName}
                                indexId={item.indexID}
                                defaultValueTitle={selectedIndexFormData[item.indexID]}
                                selectedIndexFormData={selectedIndexFormData}
                                onSelected={(indexId, title) => {
                                    props.onSelected(indexId, title);
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_SECURE_FIELD ? 
                            <InputOutlined
                                label={item.indexName}
                                value={selectedIndexFormData[item.indexID]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }} />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_ICON_LIST ? 
                            <IconListComponent
                                placeholder={item.indexName}
                                data={item.indexValues}
                                dataIcons={item.indexFiles}
                                indexId={item.indexID}
                                defaultValue={selectedIndexFormData[item.indexID] || ''}
                                onSelected={(indexId: string, value: string) => {
                                    props.onSelected(indexId, value);
                                }}
                                randomKey={Math.random()}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_MULTI_VALUED ? 
                            <MultiValueInputComponent
                                placeholder={item.indexName}
                                data={item.indexValues}
                                indexId={item.indexID}
                                defaultValue={selectedIndexFormData[item.indexID] || ''}
                                onSelected={(indexId: string, value: string) => {
                                    props.onSelected(indexId, value);
                                }}
                            />
                            : null
                        }
                        {item.indexType === INDEX_TYPES_TEXTAREA ? 
                            <View style={{marginTop: 5}}>
                                <InputOutlined
                                label={item.indexName}
                                value={selectedIndexFormData[item.indexID]}
                                multiline
                                fieldCss={[styles.comment]}
                                onChange={(value) => {
                                    props.onSelected(item.indexID, value);
                                }} />
                            </View>
                            : null
                        }
                    </View>
                );
            }) }
        </View>
    );
}

const styles = StyleSheet.create({
    indexesContainer: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    indexesTitle: {
        position: 'absolute',
        top: -12,
        left: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        fontSize: 16,
        fontWeight: '600',
    },
    comment: {
        height: 150
    },
});
