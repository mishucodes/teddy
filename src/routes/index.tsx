//Router:
import {createFileRoute} from '@tanstack/react-router';
export const Route = createFileRoute('/')({component: LandingPage})
//Components:

//Page:
function LandingPage()
{
    return (
        <main>
            <h1>Hello World</h1>
        </main>
    )
}