import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Link } from 'expo-router';

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [isSecure, setIsSecure] = useState(true);
    const [isSecureRepeated, setIsSecureRepeated] = useState(true);

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.headerText}>Sign Up Form</Text>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Username"
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setFirstName}
                    value={firstName}
                    placeholder="First Name"
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setLastName}
                    value={lastName}
                    placeholder="Last Name"
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={isSecure}
                        placeholder="Password"
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
            <TouchableOpacity style={styles.createAccountButton}>
                <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
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
});
