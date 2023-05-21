import type { User } from '@prisma/client';
import type { AuthClient, AuthPageData } from '@rabrennie/sveltekit-auth';

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user?: User;
            auth: AuthClient;
        }
        interface PageData {
            session: { user?: User };
            auth: AuthPageData;
        }
        // interface Platform {}
    }
}

export {};
