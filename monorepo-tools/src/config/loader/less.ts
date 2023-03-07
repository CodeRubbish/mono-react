/**
 * less编译在生产环境和开发环境一致
 */
export default function less() {
    return [
        {
            loader: require.resolve('less-loader'),
            options: {
                lessOptions: {
                    strictMath: 'always', // 符合3.x用户使用习惯,
                    javascriptEnabled: true,
                },
            }
        }
    ];
}