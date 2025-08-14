import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NoDataFoundPageProps } from '../../Interface';
import { Styles } from '../../core/Styles';
import { Button } from '../Button';
import { useTranslation } from 'react-i18next';

export const NoDataFoundPage: React.FC<NoDataFoundPageProps> = (props: NoDataFoundPageProps) => {
    const { t } = useTranslation();

    const reInit = (e: any) => {
        props.reInitHandler(e);
    }
    
    return (
        <View style={{position: 'absolute', top: '50%', left: '45%', transform: [{translateX: -50}, {translateY: -50}], alignItems: 'center'}}>
            <Text style={[Styles.fw_b, Styles.fs_20, Styles.color_d9]}>{t('no_data_found')}</Text>
            <Button 
                variant="general"
                title={t('try_again')} 
                state={props.state == null ? false : props.state} 
                backgroundColor="blue" 
                onClickHandler={() => reInit([])}  
                textCssClass={[Styles.fs_14]} />
        </View>
    )
}
