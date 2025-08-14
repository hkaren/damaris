const initialState: any = {
    isLogin: false,
    account: {},
    departments: {},
    permissions: {},
    uniqueDBKey: '',
    uniqueKey: '',
    userDefaultHomePage: '',
}

const customerReducer = (state = initialState, action: any): any => {
    switch (action.type) {
        case 'SET_CUSTOMER':
            return {
                ...state,
                ...action.payload,
            };
        case 'SET_CLEAR_CUSTOMER':
            return {
                ...state,
                ...{
                    isLogin: false,
                    account: {},
                    departments: {},
                    permissions: {},
                    uniqueDBKey: '',
                    uniqueKey: '',
                    userDefaultHomePage: ''
                },
            };
        default:
            return state;
    }
};

export default customerReducer;
