// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: 'expo',
    ignorePatterns: ['/dist/*'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
