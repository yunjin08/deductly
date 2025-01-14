import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
    return useReducer(
        (
            state: [boolean, T | null],
            action: T | null = null
        ): [boolean, T | null] => {
            return [false, action];
        },
        initialValue
    ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: any) {
    const serializedValue = value ? JSON.stringify(value) : null;

    if (Platform.OS === 'web') {
        try {
            if (serializedValue === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, serializedValue);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (serializedValue == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, serializedValue);
        }
    }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
    // Public
    const [state, setState] = useAsyncState<T>();

    // Get
    useEffect(() => {
        if (Platform.OS === 'web') {
            try {
                if (typeof localStorage !== 'undefined') {
                    const storedValue = localStorage.getItem(key);
                    const parsedValue = storedValue
                        ? JSON.parse(storedValue)
                        : null;
                    setState(parsedValue);
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
        } else {
            SecureStore.getItemAsync(key).then((storedValue) => {
                const parsedValue = storedValue
                    ? JSON.parse(storedValue)
                    : null;
                setState(parsedValue);
            });
        }
    }, [key, setState]);

    // Set
    const setValue = useCallback(
        (value: T | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key, setState]
    );

    return [state, setValue];
}
