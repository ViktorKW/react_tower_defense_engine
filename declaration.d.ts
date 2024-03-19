declare module "*.scss";
declare module "*.module.scss";
declare module "*.svg"

declare module "*.svg?react" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    export default content
}

declare module "*.png" {
    const value: any
    export = value;
}
