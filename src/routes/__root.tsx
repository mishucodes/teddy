import {HeadContent, Scripts, createRootRoute} from '@tanstack/react-router';
import {TanStackRouterDevtoolsPanel} from '@tanstack/react-router-devtools';
import {TanStackDevtools} from '@tanstack/react-devtools';
import appCss from '../styles.css?url';
//Components:
import {ThemeProvider} from '#/components/ui/theme/theme-provider';

export const Route = createRootRoute(
    {
        head: () => (
            {
                meta:
                    [
                        {charSet: 'utf-8'},
                        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                        {title: 'Teddy'},
                        {name: 'description', content: 'Claude will write something nice for me...'},
                    ],
                links: [{rel: 'stylesheet', href: appCss}],
            }),
        shellComponent: RootDocument,
    });

function RootDocument({children}: {children: React.ReactNode})
{
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider defaultTheme="system" storageKey="theme">
                    {children}
                    <TanStackDevtools config={{position: 'bottom-right'}} plugins={[{name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel />}]} />
                    <Scripts />
                </ThemeProvider>
            </body>
        </html>
    )
}