/**
 * compose the loader for different environment
 * compose(css,less) to compose loader to compile less
 */
export default function compose(...loaders) {
    return (commonArgs) => loaders.reduceRight(
        (list, loader, currentIndex) => {
            list.unshift(...loader(commonArgs, currentIndex, list));
            console.log(list);
            return list;
        },
        []);
}