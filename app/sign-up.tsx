import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { isValidEmail } from '@/utils/validator';
import { registerUser } from '@/contexts/actions/authActions';
import { useAppSelector, useAppDispatch } from '@/hooks/useAuthHooks';
import { removeError } from '@/contexts/reducers/authReducers';

const SignUpScreen = () => {
    const dispatch = useAppDispatch();
    const { isLoading, errors } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [isSecure, setIsSecure] = useState(true);
    const [isSecureRepeated, setIsSecureRepeated] = useState(true);

    const handleCreateAccountButton = async () => {
        if (!areValidInputs()) return;
        const result = await dispatch(
            registerUser({
                username,
                firstName,
                lastName,
                email,
                password,
            })
        );

        if (registerUser.fulfilled.match(result)) {
            router.push({
                pathname: '/sign-in',
                params: {
                    registeredUsername: result.payload,
                },
            });
        }
    };

    const areValidInputs = () => {
        const validationErrors: string[] = [];

        if (!username) {
            validationErrors.push('Username must not be empty');
            return false;
        }
        if (!firstName) {
            validationErrors.push('First Name must not be empty');
            return false;
        }
        if (!lastName) {
            validationErrors.push('Last Name must not be empty');
            return false;
        }
        if (!email) {
            validationErrors.push('Email must not be empty');
            return false;
        } else if (isValidEmail(email)) {
            validationErrors.push('Invalid email format');
            return false;
        }
        if (!password) {
            validationErrors.push('Password must not be empty');
            return false;
        } else if (password !== repeatedPassword) {
            validationErrors.push('Passwords do not match');
            return false;
        }

        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
                dispatch(removeError(error));
            });
            return false;
        }
        return true;
    };

    const handleRemoveError = (errorToRemove: string) => {
        dispatch(removeError(errorToRemove));
    };

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.headerText}>Sign Up Form</Text>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Username"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setFirstName}
                    value={firstName}
                    placeholder="First Name"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setLastName}
                    value={lastName}
                    placeholder="Last Name"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={isSecure}
                        placeholder="Password"
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity
                        onPress={() => setIsSecure(!isSecure)}
                        style={styles.eyeIcon}
                    >
                        <FontAwesome
                            name={isSecure ? 'eye-slash' : 'eye'}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        onChangeText={setRepeatedPassword}
                        value={repeatedPassword}
                        secureTextEntry={isSecureRepeated}
                        placeholder="Repeated Password"
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity
                        onPress={() => setIsSecureRepeated(!isSecureRepeated)}
                        style={styles.eyeIcon}
                    >
                        <FontAwesome
                            name={isSecureRepeated ? 'eye-slash' : 'eye'}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.signInRedirect}>
                <Text>Already have an account?</Text>
                <Link href="/sign-in" style={styles.signInButton}>
                    Sign In
                </Link>
            </View>
            <TouchableOpacity
                style={styles.createAccountButton}
                onPress={handleCreateAccountButton}
            >
                <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1fddee" />
                </View>
            )}
            <View style={styles.errorGroupContainer}>
                {errors &&
                    errors.length > 0 &&
                    errors.map((error) => (
                        <View key={error} style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => handleRemoveError(error)}
                            >
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </View>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: 25,
    },

    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    textInputContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 10,
    },

    textInput: {
        padding: 15,
        fontSize: 16,
        color: 'black',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
    },

    passwordInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },

    eyeIcon: {
        padding: 8,
    },

    createAccountButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#1fddee',
        padding: 15,
        borderRadius: 10,
    },

    createAccountText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    signInRedirect: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    },

    signInButton: {
        color: '#1fddee',
        borderBottomWidth: 1,
        borderBottomColor: '#1fddee',
    },

    errorGroupContainer: {
        position: 'absolute',
        gap: 5,
        width: '100%',
        bottom: 50,
    },

    errorContainer: {
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'red',
        borderRadius: 5,
    },

    errorText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 10,
    },

    closeButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: '10%' }],
        right: 5,
        width: 24,
        height: 24,
    },

    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },

    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});
