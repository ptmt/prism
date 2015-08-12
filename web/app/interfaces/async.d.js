declare module "async.js" {
	declare function waterfall(functions: Array<Function>, final: Function): void;
}