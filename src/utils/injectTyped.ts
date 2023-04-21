// https://dev.to/avxkim/using-axios-globally-in-a-vue-3-with-provideinject-composition-api-1jk5
import { inject, InjectionKey } from 'vue';

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
    const resolved = inject(key, fallback);
    if (!resolved) {
        throw new Error(`Could not resolve ${key.description}`);
    }
    return resolved;
}
