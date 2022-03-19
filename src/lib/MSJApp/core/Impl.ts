export const ImplFlag = "MSJApp_Impl_202203191129"

export abstract class Impl {
    public static flag: string = ImplFlag;
    public abstract nativateTo(to: string, args: any[]): void;
}
