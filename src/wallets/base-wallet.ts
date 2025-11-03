export abstract class BaseWallet {
    abstract onboard(): Promise<void>;
}
