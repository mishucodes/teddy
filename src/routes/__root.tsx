import {HeadContent, Scripts, createRootRoute} from '@tanstack/react-router';
import {TanStackRouterDevtoolsPanel} from '@tanstack/react-router-devtools';
import {TanStackDevtools} from '@tanstack/react-devtools';
import appCss from '../styles.css?url';
//Components:
import {ThemeProvider} from '#/components/ui/theme/theme-provider';
import {Header} from '#/components/header/Header';
import {Footer} from '#/components/footer/Footer';
import {SITE_NAME, SITE_TAGLINE} from '#/constants/site';
import {APPLE_TOUCH_ICON_SRC, FAVICON_SRC, OG_IMAGE} from '#/constants/images';
import {author, twitter} from '#/constants/contact';
import {absoluteURL} from '#/lib/seo';
import {NotFound} from '#/components/not-found/NotFound';

export const Route = createRootRoute(
    {
        head: () => (
            {
                meta:
                    [
                        {charSet: 'utf-8'},
                        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                        {title: SITE_NAME},
                        {name: 'description', content: `${SITE_TAGLINE} Write it in the browser and watch it run.`},
                        {name: 'author', content: author},
                        {property: 'og:site_name', content: SITE_NAME},
                        {property: 'og:type', content: 'website'},
                        {property: 'og:locale', content: 'en_US'},
                        {property: 'og:image', content: absoluteURL(OG_IMAGE.src)},
                        {property: 'og:image:width', content: String(OG_IMAGE.width)},
                        {property: 'og:image:height', content: String(OG_IMAGE.height)},
                        {property: 'og:image:alt', content: OG_IMAGE.alt},
                        {name: 'twitter:card', content: 'summary_large_image'},
                        {name: 'twitter:creator', content: `@${new URL(twitter).pathname.slice(1)}`},
                    ],
                links:
                    [
                        {rel: 'stylesheet', href: appCss},
                        {rel: 'icon', href: FAVICON_SRC, sizes: '48x48'},
                        {rel: 'apple-touch-icon', href: APPLE_TOUCH_ICON_SRC},
                    ],
            }),
        shellComponent: RootDocument,
        notFoundComponent: NotFound,
    });

function RootDocument({children}: {children: React.ReactNode})
{
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body className="flex min-h-dvh flex-col">
                <ThemeProvider defaultTheme="system" storageKey="theme">
                    <Header />
                    {children}
                    <Footer />
                    <TanStackDevtools config={{position: 'bottom-right'}} plugins={[{name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel />}]} />
                    <Scripts />
                </ThemeProvider>
            </body>
        </html>
    )
}