export type FormValues = 'signIn' | 'signUp' | 'forgotPassword' | 'changePassword';
export type SetSelectedForm = (object: { form: FormValues }) => void;
