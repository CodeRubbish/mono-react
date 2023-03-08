import {RuleSetRule} from "webpack";
import {FontRegExp, HtmlRegExp, ImageRegExp} from "./regExp";

const assets: RuleSetRule[] = [
    {
        test: ImageRegExp,
        type: 'asset',
        generator: {
            filename: "images/[contenthash][ext][query]",
        }
    },
    {
        test: FontRegExp,
        type: 'asset/resource',
        generator: {
            filename: "font/[contenthash][ext][query]"
        }
    },
    {
        test: HtmlRegExp,
        loader: require.resolve('html-loader')
    }
];
export default assets;