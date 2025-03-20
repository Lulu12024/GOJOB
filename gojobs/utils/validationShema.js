import * as yup from 'yup';

export const validationSchemaRegister = yup.object().shape({
    fullNameRegister: yup.string().required("Le nom est obligatoire"),
    emailRegister: yup.string().email("L'email est invalide").required("L'email est obligatoire"),
    phoneNumberRegister: yup.string().required("Le numéro de téléphone est obligatoire"),
    passwordRegister: yup.string().required("Le mot de passe est obligatoire").min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPasswordRegister: yup.string()
        .required("La confirmation du mot de passe est obligatoire")
        .oneOf([yup.ref('passwordRegister')], 'Les mots de passe doivent correspondre').min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const initialValuesRegister = {
    fullNameRegister: "",
    emailRegister: "",
    phoneNumberRegister: "",
    passwordRegister: "",
    confirmPasswordRegister: "",
};

export const validationSchemaLogin = yup.object().shape({
    emailLogin: yup.string().email("L'email est invalide").required("L'email est obligatoire"),
    passwordLogin: yup.string().required("Le mot de passe est obligatoire"),
});

export const initialValuesLogin = {
    emailLogin: "",
    passwordLogin: "",
};

export const validationSchemaForgotPassword = yup.object().shape({
    emailForgotPassword: yup.string().email("L'email est invalide").required("L'email est obligatoire"),
});

export const initialValuesForgotPassword = {
    emailForgotPassword: "",
};

export const validationSchemaForgotPasswordOtp = yup.object().shape({
    otp: yup.string().required("Le code OTP est obligatoire"),
});

export const initialValuesForgotPasswordOtp = {
    otp: "",
};

export const validationSchemaForgotPasswordNewPassword = yup.object().shape({
    newPassword: yup.string().required("Le mot de passe est obligatoire").min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: yup.string().required("La confirmation du mot de passe est obligatoire").oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre').min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const initialValuesForgotPasswordNewPassword = {
    newPassword: "",
    confirmPassword: "",
};

