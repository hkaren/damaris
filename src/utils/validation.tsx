const ERROR_TEXT: {[key: string]: string} = {
    empty: 'Please enter ',
    email: 'Please enter valid email',
    password: 'Password mismatch',
    password_length: 'Password length at least must be 8',
};

const validateEmail = (email: string): RegExpMatchArray | null => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validateLength = (key: string, text: string): boolean => {
    if (key === 'password') {
        return text.length >= 6;
    }
    if (text) {
        return true;
    }
    return false;
};

const validatePasswordConfirmPassword = (pass: string, conf: string): boolean => {
    return pass.length === conf.length;
};

export function validation(data: {[key: string]: string | number}): {type: boolean, key?: string, error_text?: string} {

    for (const [key, value] of Object.entries(data)) {
        if (!validateLength(key, `${value}`)) {
            if (key === 'password') {
                return {
                    type: false,
                    key: key,
                    error_text: ERROR_TEXT.password_length,
                };
            }
            return {
                type: false,
                key: key,
                error_text: ERROR_TEXT.empty + key,
            };
        }
        if (key === 'email' && !validateEmail(`${value}`)) {
            return {
                type: false,
                key: key,
                error_text: ERROR_TEXT.email,
            };
        }
        if (key === 'password' && data.confirm_password && !validatePasswordConfirmPassword(`${data.password}`, `${data.confirm_password}`)) {
            return {
                type: false,
                key: key,
                error_text: ERROR_TEXT.password,
            };
        }
    }
    return {
        type: true,
    };
}
