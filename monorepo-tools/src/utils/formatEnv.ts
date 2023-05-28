export default function formatEnv(environment: Record<string, any>) {
    const keys = Object.keys(environment);
    return keys.reduce((o, key) => {
        o[key] = JSON.stringify(environment[key]);
        return o;
    }, {});
}