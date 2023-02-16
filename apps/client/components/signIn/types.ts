export type FormValues = 'signIn' | 'signUp' | 'forgotPassword' | 'changePassword';
export type SetSelectedForm = (object: { username?: string, form: FormValues }) => void;
