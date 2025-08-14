import React, {FC} from 'react';

import { MainTabActivityScreenProps} from '../../Interface';

import {
  Header,
} from '../../components';
import {useSelector} from "react-redux";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';

const About: FC<MainTabActivityScreenProps> = (props) => {
    const { t } = useTranslation();
    const customer = useSelector((store: any) => store.customer);

    return (
      <View style={styles.container}>
        <Header title={t('fragment_about_us_title')} navigation={props.navigation} />
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.headerText}>About</Text>
        </View> */}
  
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo_intro.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
  
        {/* Description */}
        <Text style={styles.description}>{t('fragment_about_us_text')}</Text>
  
        {/* Vendor ID */}
        {/* <View style={styles.vendorContainer}>
          <Text style={styles.vendorLabel}>{t('vendor_id')}</Text>
          <Text style={styles.vendorValue}>5CE0307A-C968-4991-A819-DC591857DDF</Text>
        </View> */}
  
        {/* Copyright */}
        <Text style={styles.copyright}>{t('fragment_about_us_copy')}</Text>
  
        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default About;