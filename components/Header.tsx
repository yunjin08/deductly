import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';

const Header = () => {
    return (
        <SafeAreaView edges={['top']}>
            <View style={styles.container}>
                <Link href="/(protected)/(tabs)/home" asChild>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.text}>Home</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/(protected)/profile" asChild>
                    <FontAwesome6
                        name="circle-user"
                        size={32}
                        color="#1fddee"
                        solid
                    />
                </Link>
            </View>
        </SafeAreaView>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16, // Add space only at the top
        paddingBottom: 16, // Minimal bottom padding
    },
    buttonContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#1fddee',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
});
