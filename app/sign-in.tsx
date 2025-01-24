import { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { handleSignInWithGoogle } from '@/services/sso/google';
import { Image } from 'expo-image';
import WelcomeBackground from '@/assets/images/welcome-background.png';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { login } from '@/services/auth';
import { isAxiosError } from 'axios';
import { useSession } from '@/contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
    const { saveLoginData, resetLoginData } = useSession();
    const { registeredUsername } = useLocalSearchParams();
    const [username, setUsername] = useState(
        (registeredUsername as string) || ''
    );
    const [password, setPassword] = useState('');
    const [isSecure, setIsSecure] = useState(true);

    const [errors, setErrors] = useState([] as string[]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (response) {
                try {
                    const data = await handleSignInWithGoogle(response);
                    if (data && data.token && data.email) {
                        const token = data.token;
                        const email = data.email;
                        saveLoginData({ token, email });
                        router.push('/(protected)/(tabs)/home');
                    }
                } catch (error) {
                    console.error('Error during sign-in:', error);
                }
            }
        };

        fetchData();
    }, [response, saveLoginData]);

    const handleLoginWithGoogleButton = () => {
        resetLoginData();
        promptAsync();
    };

    const handleLoginButtonPress = async () => {
        if (!areValidInputs()) return;
        try {
            const data = await login(username, password);
            if (data) {
                const token = data.token;
                const email = data.email;
                saveLoginData({ token, email });
                router.push('/(protected)/(tabs)/home');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                const errorResponse = error.response;
                if (errorResponse) {
                    setErrors([errorResponse.data['error']]);
                } else {
                    setErrors([[error.name, error.message].join(': ')]);
                }
            } else if (error instanceof Error) {
                setErrors([[error.name, error.message].join(': ')]);
            } else {
                setErrors(['Caught something that is not an error']);
            }
        }
    };

    const areValidInputs = () => {
        let areErrorsPresent = false;
        if (!username) {
            appendError('Username must not be empty');
            areErrorsPresent = true;
        }

        if (!password) {
            appendError('Password must not be empty');
            areErrorsPresent = true;
        }

        if (areErrorsPresent) {
            return false;
        } else {
            return true;
        }
    };

    const appendError = (error: string) => {
        setErrors((prevError) => [...prevError, error]);
    };

    const handleRemoveError = (errorToRemove: string) => {
        setErrors((prevErrors) =>
            prevErrors.filter((error) => error !== errorToRemove)
        );
    };

    return (
        <View style={styles.screenContainer}>
            <Image
                style={styles.image}
                source={WelcomeBackground}
                contentFit="cover"
                transition={1000}
            />
            <View style={styles.contentContainer}>
                <Text style={styles.headerText}>Welcome to Deductly</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Username"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
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
                    <Link
                        href="/reset-password"
                        style={styles.forgotPasswordText}
                    >
                        Forgot Password?
                    </Link>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLoginButtonPress}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.signUpRedirect}>
                    <Text>No account yet?</Text>
                    <Link href="/sign-up" style={styles.signUpButton}>
                        Sign Up
                    </Link>
                </View>
                <View style={styles.ssoButtonContainer}>
                    <TouchableOpacity
                        style={styles.ssoButton}
                        onPress={handleLoginWithGoogleButton}
                    >
                        <Text style={styles.ssoButtonText}>
                            Sign in with Google
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.errorGroupContainer}>
                    {errors.length > 0 &&
                        errors.map((error) => {
                            return (
                                <View key={error} style={styles.errorContainer}>
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => handleRemoveError(error)} // Pass the index to identify which error to remove
                                    >
                                        <Text style={styles.closeButtonText}>
                                            X
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                </View>
            </View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
    },

    image: {
        width: '100%',
        height: '40%',
    },

    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
    },

    contentContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 40,
        gap: 25,
    },

    button: {
        backgroundColor: '#1fddee',
        width: '100%',
        padding: 16,
        borderRadius: 8,
    },

    ssoButton: {
        backgroundColor: '#1fddee',
        padding: 10,
        borderRadius: 4,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    ssoButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 10,
    },

    ssoButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
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

    forgotPasswordText: {
        color: '#1fddee',
        fontWeight: 'bold',
        fontSize: 12,
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

    signUpRedirect: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    },

    signUpButton: {
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
});
