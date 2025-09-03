import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';

export type DrawerParamList = {
  Home: { randomKey?: number, actionType?: string };
  Messages: { randomKey?: number, actionType?: string };
  MessagesNew: { randomKey?: number, actionType?: string };
  PhysicalArchive: { randomKey?: number, actionType?: string };
  ElectronicArchive: { randomKey?: number, actionType?: string, data?: any };
  SearchDocument: { randomKey?: number, actionType?: string, data?: any };
  AdvancedSearch: { randomKey?: number, actionType?: string };
  ElectronicDocumentView: { randomKey?: number, actionType?: string };
  DamarisPredictActions: { randomKey?: number, actionType?: string, data?: any };
  ManualTask: { randomKey?: number, actionType?: string };
  OfflineActions: { randomKey?: number, actionType?: string };
  GenerateToken: { randomKey?: number, actionType?: string };
  Settings: { randomKey?: number, actionType?: string };
  About: { randomKey?: number, actionType?: string };
  Logout: { randomKey?: number, actionType?: string };
  Chat: { randomKey?: number, actionType?: string };
  Room: { randomKey?: number, actionType?: string };
};


export type DrawerNavigationProps = DrawerNavigationProp<DrawerParamList>;

export interface MainTabScreenHeaderProps {
    //onMoreIconClickHandler?: (e: any) => void
   // onMoreIconClickHandler(...args: any[]): any,
    showHumburgerIcon?: boolean | false,
    hideMoreIcon?: boolean | false,
    type?: string,
    navigation: DrawerNavigationProps,
    chosenProfileAccountId?: string,
    title?: string,
    callBackFunction?: (e: any) => void
    backCallbackFunction?: (e: any) => void
}
export interface MainTabActivityScreenProps {
    navigation: DrawerNavigationProps,
    route: RouteProp<DrawerParamList, keyof DrawerParamList>,
}
export interface LoginFormProps {
    
}

export interface FormData {
    [key: string]: any;
}

export interface MenuItem {
    icon?: any;
    id: string;
    code: string;
    navigateTo: string;
    title: string;
    name?: string;
}
export interface SvgProps {
    name: string,
    isFocused?: boolean,
    onClickHandler?: (e: any) => void,
    cssClass?: React.CSSProperties[],
    color?: string,
    width?: string,
    height?: string
}

export interface InputOutlinedProps {
    label: string,
    value?: any,
    outlineStyleCustom?: Object,
    placeholderStyle?: Object,
    outlineStyle?: React.CSSProperties[],
    fieldCss?: React.CSSProperties[],
    onChange: (e: any) => void,
    keyboardType?: any,
    secureTextEntry?: boolean,
    multiline?: boolean,
    editable?: number,
    textArea?: boolean,
    onClickCallback?: () => void,
    fieldInfo?: any,
    rightIcon?: React.ReactNode,
}

export interface SelectComponentProps {
    containerStyle?: {[key: string]: string | number}[],
    pickerBtnContStyle?: {[key: string]: string | number},
    pickerStyle?: {[key: string]: string | number},
    selectedTextStyle?: {[key: string]: string | number},
    arrowImgStyle?: {[key: string]: string | number},
    placeholderStyle?: {[key: string]: string | number},
    data: any,
    title: string
    outlineStyleCustom?: object
    type?: string
    keyItem?: string
    defaultValue?: string | number,
    idItem?: string | number,
    onSelected: (e: any) => void,
    fieldCss?: React.CSSProperties[],
    outlineStyle?: React.CSSProperties[],
}

export interface VirtualFolderProps {
    containerStyle?: {[key: string]: string | number}[],
    pickerBtnContStyle?: {[key: string]: string | number},
    pickerStyle?: {[key: string]: string | number},
    selectedTextStyle?: {[key: string]: string | number},
    arrowImgStyle?: {[key: string]: string | number},
    placeholderStyle?: {[key: string]: string | number},
    data: any,
    title: string
    outlineStyleCustom?: object
    type?: string
    keyItem?: string
    defaultValue?: string | number,
    idItem?: string | number,
    onSelected: (e: any) => void
}

export interface NoDataFoundPageProps {
    reInitHandler(...args: any[]): any,
    state?: boolean | false
    hideButton?: boolean,
    containerStyle?: Object,
}

export interface LinkProps {
    keyProp?: number | string,
    title: string,
    onClickHandler: (e: any) => void,
    className?: React.CSSProperties[],
    textClassName?: React.CSSProperties[]
}

export interface OpenCloseListComponentProps {
    type: 'open-list' | 'closed-list',
    data: any,
    placeholder: string,
    indexId: string,
    defaultValueTitle: string,
    selectedIndexFormData: any,
    showAllSuggestions?: boolean | false,
    onSelected: (indexId: string, title: string) => void
}

export interface VirtualFolderComponentProps {
    placeholder: string,
    data: any,
    indexId: string,
    defaultValue: string,
    onSelected: (indexId: string, title: string) => void,
    randomKey: number
}

export interface MultiValueInputComponentProps {
    placeholder: string,
    data: any,
    indexId: string,
    defaultValue: string,
    onSelected: (indexId: string, title: string) => void
}

export interface IconListComponentProps {
    placeholder: string,
    data: any,
    dataIcons: any,
    indexId: string,
    defaultValue: string,
    onSelected: (indexId: string, title: string) => void,
    randomKey: number
}

export interface IndexesComponentProps {
    indexes: any[],
    onSelected: (indexId: string, title: string) => void,
    errorFieldNames: string[]
}

export interface SimpleCloseListComponentProps {
    data: any,
    placeholder: string,
    indexId: string,
    defaultValueTitle: string,
    selectedIndexFormData: any,
    onSelected: (indexId: string, title: string) => void
}