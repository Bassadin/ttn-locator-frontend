// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Icons
// https://vuetifyjs.com/en/features/icon-fonts/#material-design-icons
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Colors
// https://github.com/vuetifyjs/vuetify/issues/17256
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import colors from 'vuetify/lib/util/colors';

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: colors.green.darken3, // #2E7D32
                    secondary: colors.blue.darken2, // #1976D2
                },
            },
            dark: {
                dark: true,
                colors: {
                    primary: colors.green.darken3,
                    secondary: colors.blue.darken2,
                },
            },
        },
    },
});
