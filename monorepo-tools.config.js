module.exports = {
    base: {
        root: true,
        deployUrl: 'https://base.com',
        lessOptions: {
            modifyVars: {
                '@buttonFace': '#5B83AD',
                '@buttonText': '#D9EEF2'
            }
        }
    },
    app: {
        deployUrl: 'https://base.com/app'
    },
    utils: {
        deployUrl: 'https://base.com/utils'
    }
};